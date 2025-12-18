import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import fs from "fs";
import path from "path";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not loaded");
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 🔴 CHANGE THIS
const VECTOR_STORE_ID = "vs_693ff9913d7c8191aa78e0bdc6739681";

// 🔴 CHANGE THIS IF NEEDED
const NOTES_DIR = "notes";

async function rebuildVectorStore() {
    console.log("🔍 Fetching existing files in vector store...");

    // 1. List all files currently in the vector store
    const existingFiles = await client.vectorStores.files.list(
        VECTOR_STORE_ID
    );

    // 2. Delete each file
    for (const file of existingFiles.data) {
        console.log(`🗑 Deleting file ${file.id}`);
        await client.vectorStores.files.delete(
            file.id,
            {vector_store_id : VECTOR_STORE_ID},
        );
    }

    console.log("✅ Vector store wiped");

    // 3. Collect all .md files recursively
    const filesToUpload = [];

    function walk(dir) {
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (entry.endsWith(".md")) {
                filesToUpload.push(fs.createReadStream(fullPath));
            }
        }
    }

    walk(NOTES_DIR);

    if (filesToUpload.length === 0) {
        console.error("❌ No markdown files found to upload");
        return;
    }

    console.log(`⬆️ Uploading ${filesToUpload.length} files...`);

    // 4. Upload and wait for indexing
    const batch = await client.vectorStores.fileBatches.uploadAndPoll(
        VECTOR_STORE_ID,
        { files: filesToUpload }
    );

    console.log("🎉 Rebuild complete:", batch.status);
}

rebuildVectorStore().catch(console.error);