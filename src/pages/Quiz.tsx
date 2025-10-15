import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Quiz = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answersDetailed, setAnswersDetailed] = useState<{
    questionId: string | number;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[]>([]);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [hasPromptedFullscreen, setHasPromptedFullscreen] = useState(false);
  const [fullscreenTarget, setFullscreenTarget] = useState<HTMLElement | null>(null);
  const { data: questions, isLoading, error } = useQuizQuestions(12);
  const totalQuestions = questions?.length ?? 0;
  const currentQuestion = questions?.[currentQuestionIndex];

  // Show fullscreen prompt on mobile when questions load
  useEffect(() => {
    if (!hasPromptedFullscreen && isMobile && questions && questions.length > 0) {
      setShowFullscreenPrompt(true);
      setHasPromptedFullscreen(true);
    }
  }, [hasPromptedFullscreen, isMobile, questions]);

  const handleFullscreenRequest = async () => {
    try {
      const el = fullscreenTarget ?? document.documentElement;
      // Prefer requesting fullscreen on the quiz container so overlays remain visible
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      // @ts-ignore - vendor prefixed API for older Safari
      } else if ((el as any).webkitRequestFullscreen) {
        // @ts-ignore
        await (el as any).webkitRequestFullscreen();
      }

      // Attempt to lock orientation to landscape (supported in fullscreen on many browsers)
      // @ts-ignore - orientation API may not exist on all platforms
      if (screen.orientation && screen.orientation.lock) {
        try {
          // @ts-ignore
          await screen.orientation.lock("landscape");
        } catch (_) {
          // Ignore if not supported or user denied
        }
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    } finally {
      setShowFullscreenPrompt(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, selected: string) => {
    const q = currentQuestion;
    setAnswers([...answers, isCorrect]);
    setAnswersDetailed([
      ...answersDetailed,
      {
        questionId: q ? q.id : currentQuestionIndex,
        selected,
        correct: q ? q.correctAnswer : selected,
        isCorrect,
      },
    ]);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, navigate to results
      navigate("/results", { 
        state: { 
          score, 
          totalQuestions, 
          answers,
          answersDetailed,
          percentage: Math.round((score / totalQuestions) * 100)
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      {/* Fullscreen Prompt Overlay */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Enter Fullscreen Mode</h2>
            <p className="text-muted-foreground mb-6">
              For the best quiz experience, we recommend viewing in fullscreen mode.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleFullscreenRequest}
                className="w-full"
                size="lg"
              >
                Enter Fullscreen
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto text-center text-muted-foreground">Loading quiz…</div>
        )}
        {error && (
          <div className="w-full max-w-4xl mx-auto text-center text-error">Failed to load quiz.</div>
        )}
        {!isLoading && !error && totalQuestions > 0 && currentQuestion && (
          <>
            <QuizProgress 
              currentQuestion={currentQuestionIndex + 1} 
              totalQuestions={totalQuestions} 
            />
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onFullscreenContainerRef={setFullscreenTarget}
            />
          </>
        )}
        {!isLoading && !error && totalQuestions === 0 && (
          <div className="w-full max-w-4xl mx-auto text-center text-muted-foreground">No quiz data available.</div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
