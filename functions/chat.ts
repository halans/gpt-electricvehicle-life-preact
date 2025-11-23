import { Message, ROLES } from "../types";

interface Env {
  OPENAI_API_KEY: string;
}

const SYSTEM_MESSAGE = {
  role: "system",
  content: `You are an Australian electric vehicle expert, providing a casual but professional answer to electric vehicle questions and problems. 
    Only use metric units.
    Answer in the most appropriate Markdown format which could be bullet points, headings,
    a Markdown formatted table, or one single paragraph or multiple paragraphs. Don't use emojis.
    If the question does not make sense in regards to Electric Vehicles, ask for clarification. 
    If the question still does not relate to the Electric Vehicles topic, disregard the question.`,
};
const MODEL = "gpt-5-mini";

const parseRequestBody = async (request: Request): Promise<Message[]> => {
  const body = await request.json();

  if (!Array.isArray(body)) throw new Error();

  const messages = body.map((message) => {
    if (
      typeof message !== "object" ||
      !ROLES.includes(message.role) ||
      typeof message.content !== "string"
    ) {
      throw new Error();
    }
    return message;
  });

  return messages;
};

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  // Validate method
  if (request.method !== "POST") {
    return new Response("not found", {
      status: 404,
    });
  }

  // Validate & parse request body
  let messages: Message[];
  try {
    messages = await parseRequestBody(request);
  } catch (e) {
    return new Response("invalid request body", {
      status: 400,
    });
  }

  // Call OpenAI API
  try {
    const response = await fetch("https://gateway.ai.cloudflare.com/v1/514b6d029dbcd2190cb0905a4be59836/ai-revolution-guide/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY?.trim()}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [SYSTEM_MESSAGE, ...messages],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API Error:", text);
      return new Response(JSON.stringify({ error: "Upstream API error", details: text }), { status: 502 });
    }

    const data: any = await response.json();
    const reply = data?.choices?.[0]?.message || { role: "assistant", content: "No response from AI." };
    return new Response(JSON.stringify(reply), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Worker Error:", err);
    return new Response(JSON.stringify({ error: `Worker Error: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
