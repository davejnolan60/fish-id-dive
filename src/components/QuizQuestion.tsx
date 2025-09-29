import { useState } from "react";
import { Button } from "@/components/ui/button";
import quizFish from "@/assets/quiz-fish-1.jpg";

interface QuizQuestionProps {
  question: {
    id: number;
    image: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const QuizQuestion = ({ question, onAnswer, onNext }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getButtonVariant = (option: string) => {
    if (!showResult) return "quiz";
    if (option === question.correctAnswer) return "correct";
    if (option === selectedAnswer && option !== question.correctAnswer) return "incorrect";
    return "quiz";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="mb-8">
          <img 
            src={quizFish} 
            alt="Fish to identify" 
            className="w-full h-96 object-cover rounded-xl shadow-depth"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((option) => (
            <Button
              key={option}
              variant={getButtonVariant(option)}
              size="quiz"
              onClick={() => handleAnswerClick(option)}
              disabled={showResult}
              className="w-full"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative">
        <div className="relative h-screen -mx-4 -mt-4">
          <img 
            src={quizFish} 
            alt="Fish to identify" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-3 w-48">
            {question.options.map((option) => (
              <Button
                key={option}
                variant={getButtonVariant(option)}
                size="quiz"
                onClick={() => handleAnswerClick(option)}
                disabled={showResult}
                className="w-full shadow-lg"
              >
                {option}
              </Button>
            ))}
            
            {showResult && (
              <Button
                variant="default"
                size="quiz"
                onClick={onNext}
                className="w-full mt-4 shadow-lg"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Next Button */}
      {showResult && (
        <div className="hidden md:flex justify-center">
          <Button
            variant="hero"
            size="xl"
            onClick={onNext}
            className="px-12"
          >
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;