import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface QuizQuestionProps {
  question: {
    id: string | number;
    videoUrl: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (isCorrect: boolean, selected: string) => void;
  onNext: () => void;
}

const QuizQuestion = ({ question, onAnswer, onNext }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Reset selection when the question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [question?.id]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === question.correctAnswer;
    onAnswer(isCorrect, answer);
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
          <AspectRatio ratio={16 / 9} className="rounded-xl shadow-depth overflow-hidden bg-black">
            <video
              controls
              autoPlay
              loop
              muted
              playsInline
              src={question.videoUrl}
              className="w-full h-full object-contain"
            />
          </AspectRatio>
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

      {/* Mobile Layout - Fullscreen Video with Right Side Buttons */}
      <div className="md:hidden relative">
        <div className="fixed inset-0 -z-10">
          <video 
            controls
            autoPlay
            loop
            muted
            playsInline
            src={question.videoUrl}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />
        </div>
        
        {/* Answer buttons positioned on the right side */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-3 w-36 z-10">
          {question.options.map((option) => (
            <Button
              key={option}
              variant={getButtonVariant(option)}
              size="quiz"
              onClick={() => handleAnswerClick(option)}
              disabled={showResult}
              className="w-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white/95 text-black border border-white/20"
            >
              {option}
            </Button>
          ))}
          
          {showResult && (
            <Button
              variant="default"
              size="quiz"
              onClick={onNext}
              className="w-full mt-4 shadow-lg backdrop-blur-sm bg-primary/90 hover:bg-primary text-white"
            >
              Next
            </Button>
          )}
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