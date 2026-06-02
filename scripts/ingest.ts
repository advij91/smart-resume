import { Index } from "@upstash/vector";
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Initialize Upstash Client using HTTP REST transport layer
const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Configure standard 1536-dimension OpenAI Embedding provider
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    modelName: "text-embedding-3-small",
});

async function runIngestionPipeline() {
    const dataDirectory = path.join(process.cwd(), "data");
    const markdownFiles = fs.readdirSync(dataDirectory).filter(file => file.endsWith(".md"));

    console.log(`[Ingest Master] Found ${markdownFiles.length} documentation blocks to process.`);

    for (const fileName of markdownFiles) {
        const filePath = path.join(dataDirectory, fileName);
        const content = fs.readFileSync(filePath, "utf-8");

        console.log(`[Ingest Worker] Vectorizing metadata for: ${fileName}`);

        // Generate semantic embedding vectors via OpenAI api
        const vectorArray = await embeddings.embedDocuments([content]);

        // Upsert directly to Upstash with structural payload data
        await index.upsert({
            id: fileName.replace(".md", ""),
            vector: vectorArray[0],
            metadata: {
                rawText: content,
                fileName: fileName,
            },
        });
    }

    console.log("[Ingest Master] Pipeline sync executed successfully.");
};

runIngestionPipeline().catch(console.error);