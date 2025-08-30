import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { quizAPI } from '@/api/quizApi';
import { QuizWithQuestions, QuizResult } from '@/types/quiz';
import { toast } from 'sonner';

interface QuizTakerProps {
  quizId: string;
  onComplete?: (result: QuizResult) => void;
}

export default function QuizTaker({ quizId, onComplete }: QuizTakerProps) {
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!result) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, result]);

  const loadQuiz = async () => {
    try {
      const quizData = await quizAPI.getQuiz(quizId);
      if (quizData) {
        setQuiz(quizData);
      } else {
        toast.error('Quiz not found');
      }
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const unansweredQuestions = quiz.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`);
      return;
    }

    setIsSubmitting(true);
    try {
      const quizResult = await quizAPI.submitQuiz(quizId, answers);
      setResult(quizResult);
      onComplete?.(quizResult);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading quiz...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
            <p className="text-muted-foreground">The requested quiz could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Quiz Complete!
            </CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              <Badge variant={getScoreBadgeVariant(result.score)} className="text-lg px-4 py-2">
                {result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </Badge>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {Object.keys(result.correctAnswers).filter(qId => 
                    answers[qId] === result.correctAnswers[qId]
                  ).length} / {result.totalQuestions} Correct
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeElapsed)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Review Answers:</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const correctAnswer = result.correctAnswers[question.id];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline">Question {index + 1}</Badge>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="font-medium">{question.questionText}</p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const optionLetter = String.fromCharCode(65 + optIndex);
                          const isUserAnswer = userAnswer === optionLetter;
                          const isCorrectOption = correctAnswer === optionLetter;

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 p-2 rounded ${
                                isCorrectOption
                                  ? 'bg-green-50 border border-green-200'
                                  : isUserAnswer && !isCorrect
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <Badge 
                                variant={isCorrectOption ? 'default' : isUserAnswer ? 'destructive' : 'outline'}
                              >
                                {optionLetter}
                              </Badge>
                              <span>{option}</span>
                              {isUserAnswer && (
                                <Badge variant="outline" className="ml-auto">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-sm bg-blue-50 p-3 rounded">
                        <strong>Explanation:</strong> {result.explanations[question.id]}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button onClick={handleRetake} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const allAnswered = quiz.questions.every(q => answers[q.id]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Question {currentQuestionIndex + 1}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={optionLetter} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{optionLetter}</Badge>
                      <span>{option}</span>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </div>
          </div>

          {!allAnswered && (
            <div className="text-center text-sm text-muted-foreground">
              {quiz.questions.length - Object.keys(answers).length} questions remaining
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}