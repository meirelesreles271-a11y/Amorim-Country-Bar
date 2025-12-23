
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDetails = async (productName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gerar uma descrição curta e apetitosa para um produto de bar chamado "${productName}" no tema country.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          suggestedPrice: { type: Type.NUMBER }
        },
        required: ["description", "suggestedPrice"]
      }
    }
  });
  
  // Use .text property directly. Do not call as a function.
  try {
    const text = response.text || '';
    return JSON.parse(text);
  } catch (e) {
    return { description: response.text || '', suggestedPrice: 15.0 };
  }
};

export const generateProductImage = async (productName: string): Promise<string | null> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A high quality, rustic, professional food photography of ${productName} served at a country bar, wooden table background, warm lighting.` },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Iterate through all parts to find the image part, as it might not be the first one.
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
