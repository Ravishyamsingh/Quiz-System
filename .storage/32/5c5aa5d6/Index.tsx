import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Users, Brain, ArrowRight, CheckCircle } from 'lucide-react';
import InstructorDashboard from './InstructorDashboard';
import LearnerDashboard from './LearnerDashboard';

export default function Index() {
  const [userRole, setUserRole] = useState<'instructor' | 'learner' | null>(null);

  if (userRole === 'instructor') {
    return <InstructorDashboard />;
  }

  if (userRole === 'learner') {
    return <LearnerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Quiz System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate intelligent multiple-choice quizzes from any lesson content using advanced AI. 
              Perfect for educators and learners seeking efficient, personalized assessment tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setUserRole('instructor')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              I'm an Instructor
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg border-2"
              onClick={() => setUserRole('learner')}
            >
              <Users className="h-5 w-5 mr-2" />
              I'm a Student
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform makes creating and taking quizzes effortless, 
            intelligent, and engaging for both instructors and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">AI Quiz Generation</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <CardDescription className="text-base leading-relaxed">
                Transform any lesson content into intelligent multiple-choice questions 
                using Google Gemini AI with automatic fallback support.
              </CardDescription>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  3-5 questions per generation
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Automatic explanations
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Customizable difficulty
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Smart Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <CardDescription className="text-base leading-relaxed">
                Interactive quiz-taking experience with instant scoring, 
                detailed explanations, and comprehensive performance analytics.
              </CardDescription>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Instant feedback
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Progress tracking
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Retake capability
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Learning Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <CardDescription className="text-base leading-relaxed">
                Comprehensive dashboards for both instructors and students 
                with detailed performance metrics and learning insights.
              </CardDescription>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Performance metrics
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Quiz management
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Learning history
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our intuitive, AI-powered quiz creation and assessment system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Instructors */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                For Instructors
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Input Lesson Content</h4>
                    <p className="text-gray-600">Paste your lesson text or topic description into our AI generator.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Generates Questions</h4>
                    <p className="text-gray-600">Our AI creates 3-5 multiple-choice questions with explanations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review & Publish</h4>
                    <p className="text-gray-600">Edit questions if needed and publish for your students.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Students */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-3 text-purple-600" />
                For Students
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Available Quizzes</h4>
                    <p className="text-gray-600">Find quizzes created by your instructors or explore topics of interest.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Take Interactive Quizzes</h4>
                    <p className="text-gray-600">Answer questions with an intuitive, timed interface.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Instant Results</h4>
                    <p className="text-gray-600">Receive immediate feedback with detailed explanations and progress tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of educators and students already using our AI-powered quiz platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setUserRole('instructor')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Creating Quizzes
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg border-2"
              onClick={() => setUserRole('learner')}
            >
              <Users className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}