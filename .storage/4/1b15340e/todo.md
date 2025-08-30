# AI-Powered Quiz System MVP Implementation

## Core Files to Create/Modify:

### 1. Configuration & Setup
- `src/lib/firebase.ts` - Firebase configuration and Firestore setup
- `src/lib/gemini.ts` - Google Gemini AI integration with fallback
- `src/types/quiz.ts` - TypeScript interfaces for quiz data models

### 2. API Layer (Client-side functions)
- `src/api/quizApi.ts` - Quiz generation, fetching, and submission functions
- `src/api/geminiApi.ts` - Gemini API calls with Pro/Flash fallback

### 3. React Components
- `src/components/QuizGenerator.tsx` - Interface for instructors to generate quizzes
- `src/components/QuizTaker.tsx` - Interface for learners to take quizzes
- `src/components/QuizResults.tsx` - Display quiz results and explanations

### 4. Pages
- `src/pages/Index.tsx` - Main dashboard (MODIFY existing)
- `src/pages/InstructorDashboard.tsx` - Instructor quiz management
- `src/pages/LearnerDashboard.tsx` - Learner quiz taking interface

## Implementation Priority:
1. Setup Firebase and Gemini configuration
2. Create data types and API functions
3. Build quiz generation component
4. Build quiz taking component
5. Integrate everything in main pages

## Simplified MVP Features:
- Generate 3-5 MCQ questions from lesson text
- Save/edit generated quizzes
- Take quizzes and see immediate results
- Basic user authentication (mock for now)
- Local storage fallback if Firebase not available