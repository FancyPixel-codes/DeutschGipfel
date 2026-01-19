
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Lesson, HomeworkFeedback } from "./types";
import { STATIC_LESSON_DATA } from "./constants";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Audio decoding helpers for PCM data returned by the TTS model.
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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
 * Tracking current playback to support stop/pause functionality.
 */
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      // Source might have already stopped
    }
    currentSource = null;
  }
}

/**
 * Static Lesson Generation based on 'Aspekte B2'.
 * No AI generation used for text to ensure curriculum fidelity.
 */
export async function generateLessonContent(chapterId: string, title: string, topic: string): Promise<Lesson> {
  const content = STATIC_LESSON_DATA[chapterId] || {
    readingText: `Platzhaltertext für Kapitel ${chapterId}: ${topic}. In diesem Teil beschäftigen wir uns mit den Inhalten des Aspekte B2 Lehrwerks.`,
    glossary: {},
    vocabulary: [],
    grammarPoint: { title: "Grammatik", explanation: "Wird geladen...", examples: [] },
    listeningScript: "Hören Sie sich den Dialog an.",
    homeworkTasks: []
  };

  return {
    id: chapterId,
    module: parseInt(chapterId.split('.')[0]) <= 3 ? 1 : 2,
    chapter: parseInt(chapterId.split('.')[0]),
    title,
    topic,
    content: content,
    homeworkPrompt: content.homeworkTasks?.find((t: any) => t.type === 'writing')?.instruction || "Schreiben Sie einen kurzen Text."
  };
}

/**
 * Uses Gemini to translate and provide grammar context for new words.
 */
export async function translateWordAndGetGrammar(word: string, context: string): Promise<{ translation: string; grammarNote: string; example: string }> {
  // Use gemini-3-flash-preview for quick translation tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the German word "${word}" to English. Context: "${context}". Provide a translation, a grammar note (level B2), and an example sentence in German.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translation: { type: Type.STRING },
          grammarNote: { type: Type.STRING },
          example: { type: Type.STRING },
        },
        required: ["translation", "grammarNote", "example"],
      },
    },
  });

  return JSON.parse(response.text?.trim() || '{}');
}

/**
 * Uses Gemini to grade homework submissions with specific corrections.
 */
export async function gradeHomework(prompt: string, userText: string): Promise<HomeworkFeedback> {
  // Use gemini-3-pro-preview for complex grading tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Grade this German B2 homework submission.
    Task Prompt: ${prompt}
    User Submission: ${userText}
    
    Provide a score (0-100), a general comment, and specific corrections with explanations and character indices (startIndex, endIndex).`,
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
                endIndex: { type: Type.NUMBER },
              },
              required: ["original", "correction", "explanation", "startIndex", "endIndex"],
            },
          },
        },
        required: ["score", "generalComment", "corrections"],
      },
    },
  });

  return JSON.parse(response.text?.trim() || '{}');
}

/**
 * High-quality Text to Speech using Gemini 2.5 Flash TTS.
 * This provides a natural, "normal" human voice.
 */
export async function playTextToSpeech(text: string, onEnded?: () => void): Promise<void> {
  // Cancel any ongoing audio first
  stopAudio();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          // 'Kore' is a natural sounding German voice.
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    if (onEnded) onEnded();
    return;
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    audioContext,
    24000,
    1,
  );

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  source.onended = () => {
    if (currentSource === source) {
      currentSource = null;
    }
    if (onEnded) onEnded();
  };

  currentSource = source;
  source.start();
}
