import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import { quizQuestions } from "@/data/quizData";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers([...answers, isCorrect]);
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
          percentage: Math.round((score / totalQuestions) * 100)
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <QuizProgress 
          currentQuestion={currentQuestionIndex + 1} 
          totalQuestions={totalQuestions} 
        />
        
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </main>
    </div>
  );
};

export default Quiz;