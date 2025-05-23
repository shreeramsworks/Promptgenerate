
import {
  PROMPT_GENERATION_SYSTEM_INSTRUCTION,
  OPENROUTER_API_URL,
  OPENROUTER_MODEL,
  PROMPT_PERFECT_SITE_URL,
  PROMPT_PERFECT_SITE_NAME,
  OPENROUTER_API_KEY_VALUE // Import the key from constants
} from '../constants';

// Use the API key directly from constants.ts
const openRouterApiKey = OPENROUTER_API_KEY_VALUE;

interface OpenRouterMessage {
  role: "user" | "assistant"; // Removed "system" as it's not supported by the model this way
  content: string;
}

interface OpenRouterChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    message: OpenRouterMessage;
    finish_reason: string;
    index: number;
  }[];
}

export const generateDetailedPrompt = async (userInput: string): Promise<string> => {
  if (!openRouterApiKey) {
    console.error("OpenRouter API key is missing in constants.ts.");
    throw new Error(
      "OpenRouter API key is not configured. This is an internal application error. Please contact support."
    );
  }

  // Combine system instruction and user input into a single user message
  const combinedContent = `${PROMPT_GENERATION_SYSTEM_INSTRUCTION}\n\nNow, based on the instructions above, here's my idea for a prompt I need help creating: "${userInput}"`;

  const messages: OpenRouterMessage[] = [
    { role: "user", content: combinedContent }
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": PROMPT_PERFECT_SITE_URL,
        "X-Title": PROMPT_PERFECT_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: messages,
        temperature: 0.7,
        // max_tokens: 1500, // Consider re-adding if truncation occurs
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error:", response.status, errorBody);
      if (response.status === 401) {
        throw new Error("OpenRouter API key is invalid or unauthorized. Please check the API key configured in the application.");
      }
      if (response.status === 402) {
        throw new Error("OpenRouter: Insufficient credits or payment required. Please check your OpenRouter account.");
      }
      // Provide more specific error info if available from the body
      let detail = errorBody;
      try {
        const parsedError = JSON.parse(errorBody);
        if (parsedError.error && parsedError.error.message) {
          detail = parsedError.error.message;
        }
      } catch (e) { /* ignore parsing error, use raw body */ }
      throw new Error(`OpenRouter API request failed with status ${response.status}: ${detail}`);
    }

    const data = await response.json() as OpenRouterChatCompletionResponse;

    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("Unexpected response structure from OpenRouter:", data);
      throw new Error("Received an empty or malformed response from the AI.");
    }

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    if (error instanceof Error) {
      const sanitizedErrorMessage = error.message.replace(openRouterApiKey, '[API_KEY_REDACTED]');
      throw new Error(`Failed to generate prompt with OpenRouter: ${sanitizedErrorMessage}`);
    }
    throw new Error("An unknown error occurred while communicating with the OpenRouter API.");
  }
};
