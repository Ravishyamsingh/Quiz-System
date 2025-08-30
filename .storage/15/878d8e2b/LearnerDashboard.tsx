import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Trophy, Search, Play, BarChart3, TrendingUp } from 'lucide-react';
import QuizTaker from '@/components/QuizTaker';
import QuizResults from '@/components/QuizResults';
import { quizAPI } from '@/api/quizApi';
import { Quiz, QuizAttempt, QuizResult } from '@/types/quiz';
import { toast } from 'sonner';

export default function LearnerDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allQuizzes, userAttempts] = await Promise.all([
        quizAPI.getAllQuizzes(),
        quizAPI.getUserAttempts()
      ]);
      
      setQuizzes(allQuizzes.filter(q => q.status === 'published'));
      setAttempts(userAttempts);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setActiveTab('take-quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setCurrentResult(result);
    setActiveTab('results');
    loadData(); // Refresh attempts
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentAttempts = attempts
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
    : 0;

  const bestScore = attempts.length > 0
    ? Math.max(...attempts.map(attempt => attempt.score))
    : 0;

  const totalQuizzesTaken = new Set(attempts.map(attempt => attempt.quizId)).size;

  if (selectedQuizId && activeTab === 'take-quiz') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedQuizId(null);
                setActiveTab('browse');
              }}
            >
              ← Back to Quizzes
            </Button>
          </div>
          <QuizTaker quizId={selectedQuizId} onComplete={handleQuizComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Take quizzes and track your learning progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Quizzes
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              My Progress
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
                <CardDescription>Find and take quizzes to test your knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuizzes.map((quiz) => {
                    const userAttempts = attempts.filter(a => a.quizId === quiz.id);
                    const bestAttempt = userAttempts.length > 0
                      ? Math.max(...userAttempts.map(a => a.score))
                      : null;

                    return (
                      <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            {bestAttempt !== null && (
                              <Badge variant={getScoreBadgeVariant(bestAttempt)}>
                                {bestAttempt}%
                              </Badge>
                            )}
                          </div>
                          {quiz.description && (
                            <CardDescription>{quiz.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {quiz.questionCount} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              ~{quiz.estimatedTime} min
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {bestAttempt !== null ? 'Retake Quiz' : 'Start Quiz'}
                          </Button>

                          {userAttempts.length > 0 && (
                            <div className="text-xs text-muted-foreground text-center">
                              Attempted {userAttempts.length} time{userAttempts.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredQuizzes.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search terms' : 'No quizzes are available yet'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuizzesTaken}</div>
                  <p className="text-xs text-muted-foreground">
                    {attempts.length} total attempts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bestScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Personal best
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attempts.filter(a => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(a.completedAt) > weekAgo;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Attempts this week
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Your latest quiz attempts and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttempts.map((attempt) => {
                    const quiz = quizzes.find(q => q.id === attempt.quizId);
                    return (
                      <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{quiz?.title || 'Unknown Quiz'}</h4>
                            <p className="text-sm text-muted-foreground">
                              Completed {formatDate(attempt.completedAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getScoreBadgeVariant(attempt.score)}>
                          {attempt.score}%
                        </Badge>
                      </div>
                    );
                  })}
                  {recentAttempts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No quiz attempts yet. Start taking quizzes to see your progress!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz History</CardTitle>
                <CardDescription>All your quiz attempts and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attempts
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                    .map((attempt) => {
                      const quiz = quizzes.find(q => q.id === attempt.quizId);
                      return (
                        <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{quiz?.title || 'Unknown Quiz'}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(attempt.completedAt)} at{' '}
                                {new Date(attempt.completedAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getScoreBadgeVariant(attempt.score)}>
                              {attempt.score}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  {attempts.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No history yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Take your first quiz to start building your learning history
                      </p>
                      <Button onClick={() => setActiveTab('browse')}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse Quizzes
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {currentResult ? (
              <QuizResults result={currentResult} attempts={attempts} />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recent results</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete a quiz to see detailed results and explanations
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>
                    <Play className="h-4 w-4 mr-2" />
                    Take a Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}