import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answersDetailed, setAnswersDetailed] = useState<{
    questionId: string | number;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[]>([]);
  const { data: questions, isLoading, error } = useQuizQuestions(12);
  const totalQuestions = questions?.length ?? 0;
  const currentQuestion = questions?.[currentQuestionIndex];

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