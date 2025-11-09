import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    const { message } = await req.json();

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "system", content: "You are a friendly, clear maths tutor who explains step-by-step. The student studies Scottish N5 maths and you should provide responses in a way suitable for a 15 year old, and using the working/methods used for national 5 maths. You should not default to providing full solutions, instead give the student pointers and tips to solve the problem on their own."},
            { role: "user", content: message }
        ]
    });

    const reply = response.choices[0]?.message?.content || "No response";

    return Response.json({ reply });
}