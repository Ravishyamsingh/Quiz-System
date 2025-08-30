import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, BookOpen, Users, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import QuizGenerator from '@/components/QuizGenerator';
import { quizAPI } from '@/api/quizApi';
import { Quiz } from '@/types/quiz';
import { toast } from 'sonner';

export default function InstructorDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const allQuizzes = await quizAPI.getAllQuizzes();
      setQuizzes(allQuizzes);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSaved = (quizId: string) => {
    toast.success('Quiz saved successfully!');
    loadQuizzes(); // Refresh the quiz list
    setActiveTab('manage'); // Switch to manage tab
  };

  const getStatusBadgeVariant = (status: Quiz['status']) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const mockStats = {
    totalQuizzes: quizzes.length,
    publishedQuizzes: quizzes.filter(q => q.status === 'published').length,
    totalAttempts: quizzes.length * 15, // Mock data
    averageScore: 78, // Mock data
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">Create and manage AI-powered quizzes for your students</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Quiz
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Manage Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockStats.publishedQuizzes} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.publishedQuizzes}</div>
                  <p className="text-xs text-muted-foreground">
                    Active quizzes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalAttempts}</div>
                  <p className="text-xs text-muted-foreground">
                    Student submissions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Class performance
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest quiz activities and student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.slice(0, 5).map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created {formatDate(quiz.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(quiz.status)}>
                          {quiz.status}
                        </Badge>
                        <Badge variant="outline">
                          {quiz.questionCount} questions
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {quizzes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No quizzes created yet. Start by creating your first quiz!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <QuizGenerator onQuizSaved={handleQuizSaved} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Quizzes</CardTitle>
                <CardDescription>Edit, delete, or view your created quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading quizzes...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                <Badge variant={getStatusBadgeVariant(quiz.status)}>
                                  {quiz.status}
                                </Badge>
                              </div>
                              {quiz.description && (
                                <p className="text-muted-foreground">{quiz.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{quiz.questionCount} questions</span>
                                <span>~{quiz.estimatedTime} minutes</span>
                                <span>Created {formatDate(quiz.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {quizzes.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first AI-powered quiz to get started
                        </p>
                        <Button onClick={() => setActiveTab('create')}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Quiz
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}