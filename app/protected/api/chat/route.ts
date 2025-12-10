import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log(process.env.OPENAI_API_KEY);
export async function POST(req: Request) {
    const { newMessages} = await req.json();
    console.log(newMessages)

    const response = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: newMessages
    });

    const reply = response.choices[0]?.message?.content || "No response";

    return Response.json({ reply });
}