import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { QuizResult, QuizAttempt } from '@/types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  attempts?: QuizAttempt[];
}

export default function QuizResults({ result, attempts = [] }: QuizResultsProps) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return 'Outstanding performance! 🌟';
    if (score >= 80) return 'Excellent work! 🎉';
    if (score >= 70) return 'Good job! 👏';
    if (score >= 60) return 'Nice effort! 👍';
    return 'Keep practicing! 💪';
  };

  const correctCount = Object.keys(result.correctAnswers).filter(qId => 
    result.correctAnswers[qId] === result.correctAnswers[qId] // This would be compared with user answers in real implementation
  ).length;

  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
    : result.score;

  const bestScore = attempts.length > 0 
    ? Math.max(...attempts.map(attempt => attempt.score))
    : result.score;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Score Card */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-blue-500" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <Badge variant={getScoreBadgeVariant(result.score)} className="text-lg px-6 py-2">
              {getPerformanceMessage(result.score)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center justify-center p-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center justify-center p-4">
                <div className="text-center">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {result.totalQuestions - correctCount}
                  </div>
                  <div className="text-sm text-red-700">Incorrect</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="flex items-center justify-center p-4">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(result.timeSpent)}
                  </div>
                  <div className="text-sm text-blue-700">Time Taken</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      {attempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Performance Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{bestScore}%</div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{attempts.length}</div>
                <div className="text-sm text-muted-foreground">Total Attempts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Explanations */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Explanations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.explanations).map(([questionId, explanation], index) => (
            <Card key={questionId} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit">
                  Question {index + 1}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      Correct Answer: {result.correctAnswers[questionId]}
                    </Badge>
                  </div>
                  <div className="text-sm bg-blue-50 p-3 rounded">
                    <strong>Explanation:</strong> {explanation}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Study Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Study Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.score < 60 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">Review Core Concepts</div>
                  <div className="text-sm text-red-700">
                    Consider reviewing the lesson material and retaking the quiz to improve your understanding.
                  </div>
                </div>
              </div>
            )}
            
            {result.score >= 60 && result.score < 80 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Practice More</div>
                  <div className="text-sm text-yellow-700">
                    Good progress! Try additional practice questions to strengthen your knowledge.
                  </div>
                </div>
              </div>
            )}
            
            {result.score >= 80 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Excellent Work!</div>
                  <div className="text-sm text-green-700">
                    You've mastered this topic. Consider moving on to more advanced material.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}