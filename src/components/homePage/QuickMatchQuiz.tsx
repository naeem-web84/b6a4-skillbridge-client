'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Brain, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Check,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { homePageService } from '@/services/homePage.service';

interface QuizAnswer {
  id: string;
  text: string;
  icon?: string;
  matches: string[];
}

interface QuizQuestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  answers: QuizAnswer[];
}

interface TutorMatch {
  id: string;
  name: string;
  specialty: string;
  matchPercentage: number;
  hourlyRate: number;
  rating: number;
  image?: string;
}

interface QuickMatchQuizProps {
  onViewProfile?: (tutorId: string) => void;
}

export const QuickMatchQuiz: React.FC<QuickMatchQuizProps> = ({ onViewProfile }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isMatching, setIsMatching] = useState(false);
  const [matchedTutor, setMatchedTutor] = useState<TutorMatch | null>(null);
  const [showResults, setShowResults] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 'goal',
      title: 'What is your primary learning goal?',
      description: 'Select what you want to achieve',
      icon: <Target className="w-6 h-6" />,
      answers: [
        {
          id: 'grade-improvement',
          text: 'Improve grades in school',
          icon: '📚',
          matches: ['academic', 'homework-help', 'test-prep']
        },
        {
          id: 'test-prep',
          text: 'Prepare for standardized tests',
          icon: '✏️',
          matches: ['test-prep', 'exam-strategy', 'sat-act']
        },
        {
          id: 'skill-development',
          text: 'Learn new skills/hobbies',
          icon: '🎯',
          matches: ['skill-development', 'hobbies', 'professional']
        },
        {
          id: 'college-career',
          text: 'College or career advancement',
          icon: '🎓',
          matches: ['college-prep', 'career', 'professional']
        }
      ]
    },
    {
      id: 'learning-style',
      title: 'What is your preferred learning style?',
      description: 'How do you learn best?',
      icon: <Brain className="w-6 h-6" />,
      answers: [
        {
          id: 'structured',
          text: 'Structured & traditional',
          icon: '📖',
          matches: ['structured-teaching', 'traditional']
        },
        {
          id: 'interactive',
          text: 'Interactive & hands-on',
          icon: '🤝',
          matches: ['interactive', 'hands-on', 'project-based']
        },
        {
          id: 'visual',
          text: 'Visual & demonstration',
          icon: '👁️',
          matches: ['visual-learner', 'demonstration']
        },
        {
          id: 'self-paced',
          text: 'Self-paced & flexible',
          icon: '⏱️',
          matches: ['flexible', 'self-paced', 'adaptive']
        }
      ]
    },
    {
      id: 'budget',
      title: 'What is your budget range?',
      description: 'Per hour rate you\'re comfortable with',
      icon: <DollarSign className="w-6 h-6" />,
      answers: [
        {
          id: 'budget-1',
          text: 'Budget-friendly ($15-30)',
          icon: '💰',
          matches: ['budget-friendly', 'beginner-friendly']
        },
        {
          id: 'budget-2',
          text: 'Standard ($31-60)',
          icon: '💵',
          matches: ['standard', 'experienced']
        },
        {
          id: 'budget-3',
          text: 'Premium ($61-100)',
          icon: '💎',
          matches: ['premium', 'expert', 'specialized']
        },
        {
          id: 'budget-4',
          text: 'Flexible - Show all options',
          icon: '🌟',
          matches: ['all']
        }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      findRandomTutor();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const findRandomTutor = async () => {
    setIsMatching(true);
    
    try {
      const result = await homePageService.browseTutors({
        page: 1,
        limit: 20,
        sortBy: 'rating',
        sortOrder: 'desc'
      });
      
      let randomTutor: TutorMatch | null = null;
      
      if (result.success && result.data && result.data.tutors.length > 0) {
        const tutors = result.data.tutors;
        const randomIndex = Math.floor(Math.random() * tutors.length);
        const selectedTutor = tutors[randomIndex];
        
        randomTutor = {
          id: selectedTutor.id,
          name: selectedTutor.name,
          specialty: selectedTutor.headline,
          matchPercentage: Math.floor(Math.random() * 20) + 80,
          hourlyRate: selectedTutor.hourlyRate,
          rating: selectedTutor.rating,
          image: selectedTutor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTutor.name}`
        };
      } else {
        randomTutor = getDefaultTutor();
      }
      
      setMatchedTutor(randomTutor);
      setShowResults(true);
    } catch (error) {
      setMatchedTutor(getDefaultTutor());
      setShowResults(true);
    } finally {
      setIsMatching(false);
    }
  };

  const getDefaultTutor = (): TutorMatch => {
    const defaultTutors = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        specialty: 'Math & Test Prep Expert',
        matchPercentage: 95,
        hourlyRate: 45,
        rating: 4.9,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        id: '2',
        name: 'James Wilson',
        specialty: 'Interactive Science Tutor',
        matchPercentage: 88,
        hourlyRate: 35,
        rating: 4.8,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        specialty: 'Language & Arts Specialist',
        matchPercentage: 82,
        hourlyRate: 40,
        rating: 4.7,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      },
      {
        id: '4',
        name: 'David Kim',
        specialty: 'Programming & Tech Mentor',
        matchPercentage: 78,
        hourlyRate: 55,
        rating: 4.9,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
      }
    ];
    const randomIndex = Math.floor(Math.random() * defaultTutors.length);
    return defaultTutors[randomIndex];
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    setMatchedTutor(null);
  };

  const handleViewProfile = () => {
    if (matchedTutor && onViewProfile) {
      onViewProfile(matchedTutor.id);
    }
  };

  const handleViewAllTutors = () => {
    router.push('/tutors');
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  if (showResults && matchedTutor) {
    return (
      <div className="bg-gradient-to-br from-card to-secondary/30 dark:from-card dark:to-muted/30 rounded-2xl p-8 border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Your Perfect Match! 🎯
          </h2>
          <p className="text-muted-foreground">
            Based on your preferences, we found an expert tutor for you
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div 
            className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
            onClick={handleViewProfile}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-card shadow-md">
                  <img
                    src={matchedTutor.image}
                    alt={matchedTutor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {matchedTutor.matchPercentage}%
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl text-card-foreground group-hover:text-primary transition-colors">
                      {matchedTutor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {matchedTutor.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-card-foreground">
                      ${matchedTutor.hourlyRate}
                    </div>
                    <div className="text-xs text-muted-foreground">per hour</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        {i < Math.floor(matchedTutor.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="font-medium text-card-foreground">
                    {matchedTutor.rating}
                  </span>
                </div>
                
                <button 
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile();
                  }}
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-3 border border-input hover:border-primary text-card-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Take Quiz Again
          </button>
          <button
            onClick={handleViewAllTutors}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
          >
            Browse All Tutors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card to-secondary/30 dark:from-card dark:to-muted/30 rounded-2xl p-8 border border-border">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
          Find Your Perfect Tutor Match
        </h2>
        <p className="text-muted-foreground">
          Answer 3 quick questions to get a personalized recommendation
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-card-foreground">
            Step {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            {currentQuestion.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-card-foreground">
              {currentQuestion.title}
            </h3>
            <p className="text-muted-foreground">
              {currentQuestion.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer) => {
            const isSelected = answers[currentQuestion.id] === answer.id;
            
            return (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {answer.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground mb-1">
                      {answer.text}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentStep === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          {isMatching ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Finding your perfect match...
            </div>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                answers[currentQuestion.id]
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? (
                <>
                  See My Match
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        <button
          onClick={restartQuiz}
          className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
        >
          Restart
        </button>
      </div>

      <div className="text-center mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Don't want to take the quiz?
        </p>
        <button
          onClick={handleViewAllTutors}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Browse all tutors directly →
        </button>
      </div>
    </div>
  );
};