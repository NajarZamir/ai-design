import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const imageModel = 'gemini-2.5-flash-image';

export const generateScene = async (prompt: string, imageBase64: string, mimeType: string, shouldModifyItem: boolean): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const modificationInstruction = shouldModifyItem
      ? "Realistically adjust the product's lighting, shadows, and reflections to seamlessly blend it with the scene."
      : "Do NOT modify the product itself; only add realistic shadows underneath and around it to ground it in the scene.";

    const textPart = {
      text: `You are an expert AI assistant specializing in photorealistic product staging.
Your task is to take the provided product image and place it into a new scene based on the user's description.

**User's Request:**
- **Product:** An image of a product is provided.
- **Scene Description:** "${prompt}"

**Your Instructions:**
1.  Isolate the product from its original background.
2.  Generate a photorealistic background scene based on the user's scene description.
3.  Create the final, photorealistic composite image. ${modificationInstruction}
4.  Your output must be a SINGLE image part containing the final composite image. Do not output any other text or images.`,
    };
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: imageModel,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    // More robust parsing to find the first image in the response
    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data && typeof part.inlineData.data === 'string') {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("The AI model did not return a valid image.");

  } catch (error) {
    console.error("Error generating scene with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI image generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI image generation.");
  }
};