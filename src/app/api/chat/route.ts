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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
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
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text || "")
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
    const sanitizedMessages = messages.map((m: any) => {
      // 1. If it has a standard content string, map it directly
      if (typeof m.content === "string" && m.content.trim() !== "") {
        return { role: m.role, content: m.content };
      }
      
      // 2. If it uses modern UI SDK v6 message.parts, normalize it to standard text strings
      if (Array.isArray(m.parts)) {
        const textContent = m.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text || "")
          .join("");
        return { role: m.role, content: textContent };
      }

      // 3. Fallback to extracting the direct raw text parameter
      return { role: m.role, content: m.text || m.content || "" };
    }).filter((m: any) => m.content !== ""); // Remove any completely empty text payloads

    // 4. Send context + conversation history to the LLM and stream the response back
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are the exclusive AI Career Representative for Ashutosh Vijay. Your objective is to communicate his technical competence and structural project architecture to recruiters and hiring managers.
      
      CRITICAL INSTRUCTIONS:
      - Answer questions using ONLY the verified technical context provided below.
      - Speak with the high-fidelity clarity of a Senior Systems Engineer/Developer. 
      - Highlight specific details from his FoodApp project (e.g., AWS EC2 deployment, Multi-tenancy isolation rules, Redux state handling, IndexedDB offline support, GitHub Actions backups) when applicable.
      - If the user asks about a technology or detail not covered in the verified context, gracefully explain that you don't have that specific data block, but offer to flag it for Ashutosh's direct follow-up. Do not hallucinate metrics or architectures.

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
