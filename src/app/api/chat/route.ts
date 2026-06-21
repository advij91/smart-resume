import { Index } from "@upstash/vector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Forces the route to run on Vercel's ultra-fast Edge runtime near-zero cold starts
export const runtime = "edge";

// Connect to upstash vector instance
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Initialize OpenAI Embedding parser
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: "text-embedding-3-small",
});

interface MessagePart {
  type: string;
  text?: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content?: string;
  parts?: MessagePart[];
  text?: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid messages array" }), { status: 400 });
    }

    // 1. SAFELY EXTRACT TEXT CONTEXT FOR THE EMBEDDING VECTOR
    const rawLastMessage = messages[messages.length - 1];
    let latestMessageText = "";

    if (typeof rawLastMessage.content === "string" && rawLastMessage.content.trim() !== "") {
      // Legacy or standard string format fallback
      latestMessageText = rawLastMessage.content;
    } else if (Array.isArray(rawLastMessage.parts)) {
      // Modern AI SDK v6 structured parts layout mapping
      latestMessageText = rawLastMessage.parts
        .filter((part: MessagePart) => part.type === "text")
        .map((part: MessagePart) => part.text || "")
        .join("");
    } else if (rawLastMessage.text) {
      // Simple text key binding configuration format fallback
      latestMessageText = rawLastMessage.text;
    }

    // If text parsing fails, use a clean fallback text string to ensure the vector engine doesn't throw
    if (!latestMessageText) {
      latestMessageText = "Tell me about FoodApp ERP system architecture.";
    }

    // 2. Convert the user's extracted message into a semantic vector embedding
    const queryvector = await embeddings.embedQuery(latestMessageText);

    // 3. Search for the most relevant documentation block in the vector database
    const queryResults = await index.query({
      vector: queryvector,
      topK: 2,
      includeMetadata: true,
    });

    // Extract and stitch the verified markdown text together
    const context = queryResults
      .map((res) => res.metadata?.rawText || "")
      .filter(Boolean)
      .join("\n\n");

    // EXTRACT AND CLEAN MESSAGES ARRAY FOR THE MODEL SCHEMA
    // This strips out any extra frontend UI states and normalizes the values into CoreMessage schemas
    const sanitizedMessages = messages.map((m: ChatMessage) => {
      // 1. If it has a standard content string, map it directly
      if (typeof m.content === "string" && m.content.trim() !== "") {
        return { role: m.role, content: m.content };
      }

      // 2. If it uses modern UI SDK v6 message.parts, normalize it to standard text strings
      if (Array.isArray(m.parts)) {
        const textContent = m.parts
          .filter((p: MessagePart) => p.type === "text")
          .map((p: MessagePart) => p.text || "")
          .join("");
        return { role: m.role, content: textContent };
      }

      // 3. Fallback to extracting the direct raw text parameter
      return { role: m.role, content: m.text || m.content || "" };
    }).filter((m: ChatMessage) => m.content !== "") as { role: "system" | "user" | "assistant"; content: string; }[];

    // 4. Send context + conversation history to the LLM and stream the response back
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are the exclusive AI Career Representative for Ashutosh Vijay. Your objective is to communicate his technical competence, professional experience, and structural project architectures to recruiters and hiring managers.

      ROLE FIT & EVALUATION PROTOCOL (CRITICAL):
      - DO NOT blindly mark Ashutosh as suitable for all roles. Be honest, objective, and realistic.
      - Keep all fitment answers extremely concise, direct, and straight to the point.
      - For any fitment evaluation or job description check, you MUST strictly use the following consistent output structure:
        
        ### Fitment Alignment: [Strong Fit / Moderate Fit (Maybe a Fit) / Low Fit (Maybe Not a Fit) / Definitely Not a Fit]
        
        **1. Skills Analysis**:
        [Evaluate required skills. If skills are explicitly mentioned in the query/JD, check against those. If skills are NOT mentioned, list 3-5 inferred skills and prefix them with: "*Evaluating against these inferred skills: [List]*"]
        - [Skill Name]: [Match / Partial Match / Gap] - [Brief detail or omit if not matching]
        
        **2. Experience & Timeline Check**:
        [Only calculate and display if a years-of-experience requirement is mentioned. Otherwise, completely omit section 2. Calculate using his 11+ years total timeline: HSBC VP & Product Solutions Engineer Sep 2022-Present; Sionic Sr Consultant Jun 2021-Aug 2022; BNY Mellon BA May 2017-May 2021; Accenture SE Dec 2013-Apr 2016]
        - Required: [X years]
        - Ashutosh's Relevant Experience: [Y years]
        
        **3. Relevant Highlights**:
        [Only show this section if the rating is Moderate Fit or Strong Fit. Highlight ONLY the projects/experience that are directly relevant. If the rating is Low Fit or Definitely Not a Fit, DO NOT show this section or list any projects/experience.]
        - [Project/Role name]: [Brief relevant point]

      - Do not attempt to gloss over or stretch his experience to cover gaps. Highlight gaps clearly.
      - Specific Guidance on Alignment:
        * UI/UX Designer / Frontend Developer: Ashutosh should be rated as a **Moderate Fit (Maybe a Fit)**. Highlight his strong transferable skills: designing optimized client onboarding workflows, creating UI/UX mockups, and building frontend apps (Next.js, React, Redux, Tailwind CSS).
      
      BEHAVIORAL GUARDRAILS:
      - Answer questions using ONLY the verified technical context provided below.
      - Speak with the high-fidelity clarity, professional precision, and directness of a Senior Product Solutions Engineer.
      - If a question is not related to Ashutosh's projects, professional skills, or work experience, politely decline to answer.
      - Do not provide false information, hallucinate metrics, or make up facts.
      - If the user asks about a technology or detail not covered in the verified context, gracefully explain that you don't have that specific data block, and offer to flag it for Ashutosh's direct follow-up.

      VERIFIED TECHNICAL CONTEXT:
      ${context}`,
      messages: sanitizedMessages,
    });

    // Matches your local package version's stream protocol response handler smoothly
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Chat API Error]:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat pipeline" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
