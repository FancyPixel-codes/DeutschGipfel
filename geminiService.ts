
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Lesson, HomeworkFeedback } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a full B2 German lesson.
 * Optimized with gemini-3-flash-preview for significantly faster response times.
 */
export async function generateLessonContent(chapterId: string, title: string, topic: string): Promise<Lesson> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive B2 German lesson based on the theme "${title}: ${topic}". 
    The lesson must include:
    1. A sophisticated B2-level reading text (approx 400 words).
    2. A glossary: An array of objects where each object has a "german" key (difficult word) and an "english" key (its translation).
    3. 15 key vocabulary terms. IMPORTANT: If the word is a noun, provide it WITHOUT the article (e.g., 'Brauch' instead of 'der Brauch').
       - For each term: provide word, meaning (English), gender (der, die, das, plural, none), plural suffix (e.g., 'e', 'en', 'n', 'er', 's', or '-' for no change), and example (a short, natural German sentence using the word).
    4. A grammar explanation relevant to B2 level.
    5. A listening script.
    6. A homework writing prompt.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          readingText: { type: Type.STRING },
          glossary: { 
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                german: { type: Type.STRING },
                english: { type: Type.STRING }
              },
              required: ["german", "english"]
            }
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
                gender: { type: Type.STRING, enum: ["der", "die", "das", "plural", "none"] },
                plural: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "meaning", "gender", "example"]
            }
          },
          grammarPoint: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              explanation: { type: Type.STRING },
              examples: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "explanation", "examples"]
          },
          listeningScript: { type: Type.STRING },
          homeworkPrompt: { type: Type.STRING }
        },
        required: ["readingText", "glossary", "vocabulary", "grammarPoint", "listeningScript", "homeworkPrompt"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Keine Antwort vom Modell erhalten.");
  const rawData = JSON.parse(text);
  
  const glossaryRecord: Record<string, string> = {};
  if (Array.isArray(rawData.glossary)) {
    rawData.glossary.forEach((item: { german: string; english: string }) => {
      glossaryRecord[item.german.toLowerCase()] = item.english;
    });
  }

  const [chapterNum] = chapterId.split('.');

  return {
    id: chapterId,
    module: 1,
    chapter: parseInt(chapterNum),
    title,
    topic,
    content: {
      ...rawData,
      glossary: glossaryRecord
    },
    homeworkPrompt: rawData.homeworkPrompt
  };
}

export async function translateWordAndGetGrammar(word: string, context: string): Promise<{ translation: string; grammarNote: string; example: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the German word "${word}" to English, provide a very brief B2-level grammar tip, and create one natural German example sentence using the word. 
    Context of the original text: "...${context.slice(0, 100)}..."
    Format as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translation: { type: Type.STRING },
          grammarNote: { type: Type.STRING },
          example: { type: Type.STRING }
        },
        required: ["translation", "grammarNote", "example"]
      }
    }
  });
  
  const text = response.text;
  if (!text) throw new Error("Übersetzung fehlgeschlagen.");
  return JSON.parse(text);
}

export async function gradeHomework(prompt: string, userText: string): Promise<HomeworkFeedback> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a professional German B2 teacher, evaluate the student response for the prompt: "${prompt}".
    Student Text: "${userText}"
    Format feedback as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          generalComment: { type: Type.STRING },
          corrections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                correction: { type: Type.STRING },
                explanation: { type: Type.STRING },
                startIndex: { type: Type.NUMBER },
                endIndex: { type: Type.NUMBER }
              },
              required: ["original", "correction", "explanation", "startIndex", "endIndex"]
            }
          }
        },
        required: ["score", "generalComment", "corrections"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Bewertung konnte nicht generiert werden.");
  return JSON.parse(text);
}

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw PCM audio data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Uses Gemini TTS to read German text aloud.
 */
export async function playTextToSpeech(text: string): Promise<void> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lies diesen B2 Deutsch Text deutlich vor: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    audioContext,
    24000,
    1
  );

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}
