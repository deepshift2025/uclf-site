
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

export async function getChatbotResponse(prompt: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convert history to compatible format for generateContent
    const contents = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `You are the UCLF WhatsApp Assistant, a friendly and professional concierge for the Uganda Christian Lawyers Fraternity.
        Context:
        - Membership: Student (50k), Associate (150k), Full (200k).
        - Legal Aid: For indigent persons (widows, orphans, refugees). Must verify lack of means.
        - Regions: Kampala (HQ), Gulu (North), Kasese (SW), Arua (West Nile).
        - Mission: Proverbs 31:9 - "Speak up and judge fairly."
        Style: Brief, WhatsApp-style responses. Use emojis occasionally. 
        Note: You provide info, not legal advice. For urgent legal help, tell them to visit the 'Legal Aid' page.`,
      }
    });
    return response.text || "I'm here to help! Could you rephrase that?";
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "I'm having a bit of trouble connecting. Please try again in a moment! 🙏";
  }
}
