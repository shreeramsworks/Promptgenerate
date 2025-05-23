
// Removed direct OpenRouter API constants that are now handled by the serverless function.

interface ClientOpenRouterResponse {
  // This should mirror the structure of the successful response from OpenRouter,
  // specifically the part that your serverless function forwards.
  id?: string;
  model?: string;
  choices?: {
    message: {
      role: "user" | "assistant";
      content: string;
    };
    finish_reason?: string;
    index?: number;
  }[];
  error?: string; // For handling errors passed from the serverless function
}

export const generateDetailedPrompt = async (userInput: string, desiredMaxLength: number | null): Promise<string> => {
  try {
    const response = await fetch('/api/generate-prompt', { // Calls the Vercel serverless function
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, desiredMaxLength }),
    });

    const data = await response.json() as ClientOpenRouterResponse;

    if (!response.ok) {
      // Use the error message from the serverless function's response if available
      const errorMessage = data.error || `API request failed with status ${response.status}`;
      console.error("Error from /api/generate-prompt:", errorMessage);
      throw new Error(errorMessage);
    }

    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else if (data.error) {
      // Handle cases where the response might be ok (e.g. 200) but still contain an error field from OpenRouter via serverless fn
      console.error("Error message in successful response from /api/generate-prompt:", data.error);
      throw new Error(data.error);
    } else {
      console.error("Unexpected response structure from /api/generate-prompt:", data);
      throw new Error("Received an empty or malformed response from the AI service.");
    }

  } catch (error) {
    console.error("Error calling /api/generate-prompt:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};