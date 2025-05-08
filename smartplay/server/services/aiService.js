const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const geminiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,          // Use the Gemini API key
  baseURL: "https://generativelanguage.googleapis.com/v1beta", // Gemini base URL from docs [2]
});

/**
 * Generates an answer based on a transcript and a user question using OpenAI.
 * @param {string} transcriptText - The full text of the video transcript.
 * @param {string} userQuestion - The question asked by the user.
 * @returns {Promise<string|null>} - The AI's answer or null if an error occurs.
 */
const getAnswerFromAI = async (transcriptText, userQuestion) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Gemini API key not configured.");
    return "AI service (Gemini) is not configured."; 
}

  // Basic check for empty inputs
  if (!transcriptText?.trim() || !userQuestion?.trim()) {
      console.warn("AI Service called with empty transcript or question.");
      return "Missing transcript or question.";
  }

  // Limit transcript length to avoid exceeding token limits (adjust as needed)
  const maxTranscriptLength = 15000; // Approx character limit (adjust based on model context window)
  const truncatedTranscript = transcriptText.length > maxTranscriptLength 
      ? transcriptText.substring(0, maxTranscriptLength) + "..." 
      : transcriptText;


  const systemPrompt = `You are an AI assistant for the SmartPlay application. 
Your task is to answer questions based *only* on the provided video transcript text. 
Be concise and directly answer the question using information found in the transcript. 
Do not add any information that is not present in the text. 
Do not preface your answer with phrases like "Based on the transcript...".
If the answer cannot be found in the transcript, respond with "The answer is not available in the provided transcript."`;

  const userPrompt = `Transcript:\n\"\"\"\n${truncatedTranscript}\n\"\"\"\n\nQuestion: ${userQuestion}`;

  try {
    console.log("Sending request to OpenAI Chat Completion API...");
    const completion = await geminiClient.chat.completions.create({
      // Use a Gemini model compatible with the API [2] (e.g., gemini-1.5-flash is recent and efficient)
      model: "models/gemini-1.5-flash-latest", // Standard Gemini model naming convention for REST/SDK usually includes 'models/' prefix
      // If the above fails, try the format from the compatibility example: model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more factual answers
      max_tokens: 150, // Limit response length
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    console.log("Received answer from OpenAI.");
    return answer || "AI did not return a valid answer.";

  } catch (error) {
    console.error("Error calling Google Gemini API:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    

    // Provide a more user-friendly error message
    let errorMessage = "An error occurred while communicating with the AI service.";
    if (error.response && error.response.status === 429) {
        errorMessage = "AI service is currently busy. Please try again later.";
    } else if (error.message.includes('authentication')) {
        errorMessage = "AI service authentication failed. Check API key.";
    }
    return errorMessage;
  }
};

module.exports = {
  getAnswerFromAI,
};
