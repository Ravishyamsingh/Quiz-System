import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Save, Edit } from 'lucide-react';
import { quizAPI } from '@/api/quizApi';
import { Question } from '@/types/quiz';
import { toast } from 'sonner';

interface QuizGeneratorProps {
  onQuizSaved?: (quizId: string) => void;
}

export default function QuizGenerator({ onQuizSaved }: QuizGeneratorProps) {
  const [lessonContent, setLessonContent] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState(4);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!lessonContent.trim()) {
      toast.error('Please enter lesson content');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await quizAPI.generateQuiz({
        lessonContent,
        difficulty,
        questionCount,
      });
      
      setGeneratedQuestions(questions);
      
      // Auto-generate title if not provided
      if (!quizTitle) {
        const contentPreview = lessonContent.slice(0, 50);
        setQuizTitle(`Quiz: ${contentPreview}${lessonContent.length > 50 ? '...' : ''}`);
      }
      
      toast.success('Quiz generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (generatedQuestions.length === 0) {
      toast.error('Please generate questions first');
      return;
    }

    setIsSaving(true);
    try {
      const quizId = await quizAPI.saveQuiz(
        {
          title: quizTitle,
          description: quizDescription,
          status: 'published',
          estimatedTime: Math.ceil(generatedQuestions.length * 1.5), // 1.5 min per question
        },
        generatedQuestions
      );
      
      toast.success('Quiz saved successfully!');
      onQuizSaved?.(quizId);
      
      // Reset form
      setLessonContent('');
      setQuizTitle('');
      setQuizDescription('');
      setGeneratedQuestions([]);
    } catch (error) {
      toast.error('Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuestion = (questionId: string, field: string, value: string) => {
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map((opt, idx) => 
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    );
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as 'beginner' | 'intermediate' | 'advanced');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Quiz Generator
          </CardTitle>
          <CardDescription>
            Generate multiple-choice questions from your lesson content using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-content">Lesson Content</Label>
            <Textarea
              id="lesson-content"
              placeholder="Paste your lesson content here (minimum 50 characters)..."
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="text-sm text-muted-foreground">
              {lessonContent.length}/5000 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-count">Number of Questions</Label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="4">4 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || lessonContent.length < 50}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Quiz</CardTitle>
            <CardDescription>
              Review and edit your questions before saving
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  placeholder="Enter quiz title..."
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description (Optional)</Label>
                <Input
                  id="quiz-description"
                  placeholder="Brief description..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">Question {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(
                          editingQuestion === question.id ? null : question.id
                        )}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {editingQuestion === question.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={question.questionText}
                          onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <Badge variant={question.correctAnswer === String.fromCharCode(65 + optIndex) ? "default" : "outline"}>
                                {String.fromCharCode(65 + optIndex)}
                              </Badge>
                              <Input
                                value={option}
                                onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                          placeholder="Explanation for correct answer..."
                          className="min-h-[60px]"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-medium">{question.questionText}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 p-2 rounded ${
                                question.correctAnswer === String.fromCharCode(65 + optIndex)
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <Badge variant={question.correctAnswer === String.fromCharCode(65 + optIndex) ? "default" : "outline"}>
                                {String.fromCharCode(65 + optIndex)}
                              </Badge>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleSaveQuiz} 
              disabled={isSaving || !quizTitle.trim()}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Quiz...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}