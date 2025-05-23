
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  PROMPT_GENERATION_SYSTEM_INSTRUCTION,
  OPENROUTER_API_URL,
  OPENROUTER_MODEL,
  PROMPT_PERFECT_SITE_URL,
  PROMPT_PERFECT_SITE_NAME
} from '../src/constants'; // Adjusted path

interface OpenRouterMessage {
  role: "user" | "assistant";
  content: string;
}

interface OpenRouterRequestBody {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    console.error("OpenRouter API key is not configured in Vercel environment variables.");
    return res.status(500).json({ error: "API key not configured on the server." });
  }

  const { userInput, desiredMaxLength } = req.body;

  if (!userInput || typeof userInput !== 'string') {
    return res.status(400).json({ error: "userInput is required and must be a string." });
  }
  
  let combinedContent = `${PROMPT_GENERATION_SYSTEM_INSTRUCTION}\n\nNow, based on the instructions above, here's my idea for a prompt I need help creating: "${userInput}"`;

  if (desiredMaxLength && Number.isInteger(desiredMaxLength) && desiredMaxLength > 0) {
    combinedContent += `\n\nPlease try to keep the generated prompt around ${desiredMaxLength} characters.`;
  }


  const messages: OpenRouterMessage[] = [
    { role: "user", content: combinedContent }
  ];

  const body: OpenRouterRequestBody = {
    model: OPENROUTER_MODEL,
    messages: messages,
    temperature: 0.7,
  };

  try {
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": PROMPT_PERFECT_SITE_URL,
        "X-Title": PROMPT_PERFECT_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!openRouterResponse.ok) {
      const errorBody = await openRouterResponse.text();
      console.error("OpenRouter API Error on server:", openRouterResponse.status, errorBody);
      // Try to parse the error for a cleaner message
      let detail = errorBody;
      try {
        const parsedError = JSON.parse(errorBody);
        if (parsedError.error && parsedError.error.message) {
          detail = parsedError.error.message;
        }
      } catch (e) { /* ignore parsing error */ }
      return res.status(openRouterResponse.status).json({ error: `OpenRouter API request failed: ${detail}` });
    }

    const data = await openRouterResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error calling OpenRouter API from serverless function:", error);
    const message = error instanceof Error ? error.message : "An unknown server error occurred.";
    return res.status(500).json({ error: `Server error: ${message}` });
  }
}