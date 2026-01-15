
export interface Lesson {
  id: string;
  module: number;
  chapter: number;
  title: string;
  topic: string;
  content: {
    readingText: string;
    glossary: Record<string, string>;
    vocabulary: Array<{ 
      word: string; 
      meaning: string;
      gender: 'der' | 'die' | 'das' | 'plural' | 'none';
      plural?: string;
    }>;
    grammarPoint: {
      title: string;
      explanation: string;
      examples: string[];
    };
    listeningScript: string;
  };
  homeworkPrompt: string;
}

export interface HomeworkSubmission {
  lessonId: string;
  userText: string;
  timestamp: number;
  feedback?: HomeworkFeedback;
}

export interface HomeworkFeedback {
  score: number;
  generalComment: string;
  corrections: Array<{
    original: string;
    correction: string;
    explanation: string;
    startIndex: number;
    endIndex: number;
  }>;
}

export interface CustomWord {
  word: string;
  meaning: string;
  grammarNote?: string;
  addedAt: number;
}

export interface AppState {
  completedLessons: string[];
  homeworkSubmissions: Record<string, HomeworkSubmission>;
  currentLessonId: string | null;
  lessonCache: Record<string, Lesson>;
  customVocabulary: CustomWord[];
}
