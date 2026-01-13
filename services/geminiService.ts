
import { GoogleGenAI, Type } from "@google/genai";
import { Tender } from "../types";

export const analyzeTender = async (tender: Tender): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analiza esta oportunidad de licitación y proporciona un resumen, puntuación de ajuste (0-100), pros y contras. RESPONDE SIEMPRE EN ESPAÑOL.
    Título de la Licitación: ${tender.title}
    Emisor: ${tender.issuer}
    Descripción: ${tender.description}
    Valor: ${tender.value}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Un resumen conciso de 2 frases de la oportunidad en español." },
          fitScore: { type: Type.NUMBER, description: "Una puntuación numérica de 0 a 100." },
          pros: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista de aspectos positivos en español para una empresa tecnológica/ingeniería general."
          },
          cons: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista de posibles riesgos o desafíos en español."
          },
        },
        required: ["summary", "fitScore", "pros", "cons"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) {
      throw new Error("La API de Gemini devolvió una respuesta vacía.");
    }
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Error al parsear la respuesta de la IA", e);
    return null;
  }
};
