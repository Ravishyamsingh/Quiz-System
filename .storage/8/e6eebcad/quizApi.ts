import { db, auth } from '@/lib/firebase';
import { geminiService } from '@/lib/gemini';
import { 
  Quiz, 
  Question, 
  QuizAttempt, 
  QuizWithQuestions, 
  QuizResult, 
  GenerateQuizRequest 
} from '@/types/quiz';

export class QuizAPI {
  // Generate quiz using Gemini AI
  async generateQuiz(request: GenerateQuizRequest): Promise<Question[]> {
    try {
      const response = await geminiService.generateQuiz(
        request.lessonContent,
        request.difficulty,
        request.questionCount || 4
      );

      if (!geminiService.validateQuizResponse(response)) {
        throw new Error('Invalid quiz response format');
      }

      // Convert to our Question format
      const questions: Question[] = response.questions.map((q, index) => ({
        id: `temp_${Date.now()}_${index}`,
        quizId: '', // Will be set when quiz is saved
        questionText: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        order: index + 1,
        createdAt: new Date(),
      }));

      return questions;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      throw error;
    }
  }

  // Save quiz to database
  async saveQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>, questions: Question[]): Promise<string> {
    try {
      // Create quiz document
      const quizDoc = await db.collection('quizzes').add({
        ...quiz,
        createdBy: auth.user?.uid || 'anonymous',
        questionCount: questions.length,
      });

      const quizId = quizDoc.id;

      // Save questions with quiz ID
      for (const question of questions) {
        await db.collection('questions').add({
          ...question,
          id: `${quizId}_q_${question.order}`,
          quizId,
        });
      }

      return quizId;
    } catch (error) {
      console.error('Failed to save quiz:', error);
      throw new Error('Failed to save quiz');
    }
  }

  // Fetch quiz with questions
  async getQuiz(quizId: string): Promise<QuizWithQuestions | null> {
    try {
      const quizDoc = await db.collection('quizzes').doc(quizId).get();
      
      if (!quizDoc.exists) {
        return null;
      }

      const quiz = quizDoc.data() as Quiz;
      
      // Fetch questions for this quiz
      const questionsSnapshot = await db.collection('questions')
        .where('quizId', '==', quizId)
        .get();

      const questions: Question[] = questionsSnapshot.docs
        .map(doc => doc.data() as Question)
        .sort((a, b) => a.order - b.order);

      return {
        ...quiz,
        questions,
      };
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      throw new Error('Failed to fetch quiz');
    }
  }

  // Get all quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const snapshot = await db.collection('quizzes').get();
      return snapshot.docs.map(doc => doc.data() as Quiz);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      return [];
    }
  }

  // Submit quiz answers and get results
  async submitQuiz(quizId: string, answers: Record<string, string>): Promise<QuizResult> {
    try {
      const quiz = await this.getQuiz(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Calculate score
      let correctCount = 0;
      const correctAnswers: Record<string, string> = {};
      const explanations: Record<string, string> = {};

      quiz.questions.forEach(question => {
        correctAnswers[question.id] = question.correctAnswer;
        explanations[question.id] = question.explanation;
        
        if (answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / quiz.questions.length) * 100);

      // Save attempt
      const attempt: Omit<QuizAttempt, 'id'> = {
        quizId,
        userId: auth.user?.uid || 'anonymous',
        answers,
        score,
        completedAt: new Date(),
        timeSpent: 0, // Would be calculated from start time in real implementation
      };

      await db.collection('quiz_attempts').add(attempt);

      return {
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers,
        explanations,
        timeSpent: 0,
      };
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw new Error('Failed to submit quiz');
    }
  }

  // Get user's quiz attempts
  async getUserAttempts(userId?: string): Promise<QuizAttempt[]> {
    try {
      const uid = userId || auth.user?.uid || 'anonymous';
      const snapshot = await db.collection('quiz_attempts')
        .where('userId', '==', uid)
        .get();

      return snapshot.docs.map(doc => doc.data() as QuizAttempt);
    } catch (error) {
      console.error('Failed to fetch user attempts:', error);
      return [];
    }
  }
}

// Export singleton instance
export const quizAPI = new QuizAPI();