import { GenerateQuizResponse, GeneratedQuestion } from '@/types/quiz';

// Mock Gemini API implementation for MVP
// In production, replace with actual Google Generative AI SDK

export interface GeminiConfig {
  apiKey: string;
  model?: 'gemini-1.5-pro' | 'gemini-1.5-flash';
}

class MockGeminiAPI {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  async generateQuiz(
    lessonContent: string,
    difficulty: string = 'intermediate',
    questionCount: number = 4
  ): Promise<GenerateQuizResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock quiz generation based on content
    const mockQuestions: GeneratedQuestion[] = [
      {
        question: `Based on the lesson content about "${lessonContent.slice(0, 30)}...", what is the main concept?`,
        options: [
          'A) The primary concept discussed in the lesson',
          'B) A secondary supporting idea',
          'C) An unrelated concept',
          'D) A contradictory statement'
        ],
        correct_answer: 'A',
        explanation: 'The main concept is typically introduced early and reinforced throughout the lesson content.'
      },
      {
        question: 'Which of the following best describes the key learning objective?',
        options: [
          'A) To memorize facts without understanding',
          'B) To understand and apply the core principles',
          'C) To ignore practical applications',
          'D) To focus only on theoretical aspects'
        ],
        correct_answer: 'B',
        explanation: 'Effective learning combines understanding of principles with practical application.'
      },
      {
        question: 'What would be the most appropriate next step after learning this material?',
        options: [
          'A) Forget everything immediately',
          'B) Practice applying the concepts',
          'C) Avoid using the knowledge',
          'D) Only teach others without practicing'
        ],
        correct_answer: 'B',
        explanation: 'Practice and application help solidify understanding and build competency.'
      },
      {
        question: 'How does this lesson content relate to real-world applications?',
        options: [
          'A) It has no practical relevance',
          'B) It only applies in academic settings',
          'C) It can be applied to solve practical problems',
          'D) It contradicts real-world evidence'
        ],
        correct_answer: 'C',
        explanation: 'Good educational content bridges theory with practical, real-world applications.'
      }
    ];

    return {
      questions: mockQuestions.slice(0, questionCount)
    };
  }
}

// Gemini API with fallback strategy
export class GeminiService {
  private primaryAPI: MockGeminiAPI;
  private fallbackAPI: MockGeminiAPI;

  constructor(apiKey: string) {
    this.primaryAPI = new MockGeminiAPI({ apiKey, model: 'gemini-1.5-pro' });
    this.fallbackAPI = new MockGeminiAPI({ apiKey, model: 'gemini-1.5-flash' });
  }

  async generateQuiz(
    lessonContent: string,
    difficulty: string = 'intermediate',
    questionCount: number = 4
  ): Promise<GenerateQuizResponse> {
    try {
      // Try primary API first
      console.log('Attempting quiz generation with Gemini 1.5 Pro...');
      return await this.primaryAPI.generateQuiz(lessonContent, difficulty, questionCount);
    } catch (error) {
      console.warn('Primary API failed, falling back to Gemini 1.5 Flash...', error);
      
      try {
        return await this.fallbackAPI.generateQuiz(lessonContent, difficulty, questionCount);
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError);
        throw new Error('Quiz generation service is currently unavailable. Please try again later.');
      }
    }
  }

  validateQuizResponse(response: GenerateQuizResponse | null | undefined): boolean {
    if (!response || !response.questions || !Array.isArray(response.questions)) {
      return false;
    }

    return response.questions.every((q: GeneratedQuestion) => {
      return (
        typeof q.question === 'string' && 
        q.question.length > 0 &&
        Array.isArray(q.options) && 
        q.options.length === 4 &&
        typeof q.correct_answer === 'string' &&
        ['A', 'B', 'C', 'D'].includes(q.correct_answer) &&
        typeof q.explanation === 'string' &&
        q.explanation.length > 0
      );
    });
  }
}

// Export singleton instance
export const geminiService = new GeminiService(process.env.GEMINI_API_KEY || 'mock_api_key');