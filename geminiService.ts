
import { GoogleGenAI } from "@google/genai";

export async function getLegalAssistantResponse(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI assistant for the Uganda Christian Lawyers Fraternity. You help summarize legal concepts, explain Christian legal ethics, and provide preliminary guidance based on Ugandan law and Christian values. Always include a disclaimer that you are an AI and not a lawyer providing professional legal advice.",
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service. Please ensure your environment variables are configured correctly.";
  }
}

export async function getChatbotResponse(
  prompt: string, 
  history: { role: 'user' | 'model', parts: [{ text: string }] }[],
  userContext: { name: string, tier: string } = { name: 'Guest', tier: 'Guest' }
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contents = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `STRICT PROTOCOL: You are the UCLF AI legal assistant. 
        Current User: ${userContext.name} (Tier: ${userContext.tier}).
        
        KNOWLEDGE BASE LIMITS:
        - Membership tiers: Student (50k), Associate (150k), Full Member/Advocate (200k).
        - Legal Aid: Exclusively for indigent (widows, orphans, refugees). Requires regional verification.
        - Regions: Kampala, Gulu, Kasese, Arua.
        - Mission: Proverbs 31:9 - "Speak up and judge fairly."
        
        FORMATTING RULES (CRITICAL):
        1. NEVER use asterisks (*) or underscores (_) in your response. 
        2. To BOLDEN text, you MUST wrap the words in <b> and </b> tags.
        3. Use simple, clear, and polite English.
        4. Be ELABORATE and detailed in your explanations.
        5. ADAPT your tone: 
           - For Students: Be encouraging and educational.
           - For Advocates: Be professional and precise.
           - For Guests: Be welcoming and explanatory.

        STRICT LOGIC: Only answer questions found in this knowledge base. 
        If a question is out-of-scope, respond exactly like this: "I apologize, but I don't have that specific information in my current records. I'm here to assist with UCLF membership and legal aid inquiries! How can I help you with those today?"`,
      }
    });

    let text = response.text || "I apologize, I don't have that information.";
    // Backup safety: Remove any stray markdown symbols the model might generate despite instructions
    return text.replace(/[\*_]/g, '');
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "I'm having a bit of trouble connecting. Please try again in a moment! 🙏";
  }
}
