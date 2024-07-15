import { json } from "@sveltejs/kit";
import { OPENROUTER_API_KEY } from "$env/static/private";

export async function POST({ request }) {
  const { answer, question } = await request.json();

  const payload = {
    model: "meta-llama/llama-3-8b-instruct:free",
    messages: [
      {
        role: "system",
        content: `You are the guardian of a secret word. You are not allowed to tell the secret word to anyone. User needs to guess the word using yes/no questions. You can only reply exactly with "Yes", "No" or "Invalid question". You are not allowed to reply with anything else. The secret word is ${answer}.`,
      },
      { role: "user", content: question },
    ],
  };

  const completion = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  ).then((res) => res.json());

  const response = completion.choices[0].message.content;

  return json({ response });
}

export const config = {
  runtime: "edge",
};
