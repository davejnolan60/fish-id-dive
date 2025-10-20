import { useEffect, useRef, useState, Fragment } from "react";
import { createPortal } from "react-dom";
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
  // Parent can capture the fullscreen container for mobile
  onFullscreenContainerRef?: (el: HTMLElement | null) => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
}

const QuizQuestion = ({ question, onAnswer, onNext, onFullscreenContainerRef, onVideoRef }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mobileFullscreenContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopFullscreenContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  // Reset selection when the question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [question?.id]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Expose the appropriate fullscreen container (desktop or mobile) to parent
  useEffect(() => {
    if (!onFullscreenContainerRef) return;

    const updateFullscreenTarget = () => {
      const prefersDesktop = window.innerWidth >= 768;
      const target = prefersDesktop
        ? desktopFullscreenContainerRef.current
        : mobileFullscreenContainerRef.current;
      onFullscreenContainerRef(target);
    };

    updateFullscreenTarget();
    window.addEventListener("resize", updateFullscreenTarget);

    return () => {
      window.removeEventListener("resize", updateFullscreenTarget);
      onFullscreenContainerRef(null);
    };
  }, [onFullscreenContainerRef, question?.id]);

  // Provide the active video element to parent so it can request fullscreen directly
  useEffect(() => {
    if (!onVideoRef) return;

    const updateVideoRef = () => {
      const prefersDesktop = window.innerWidth >= 768;
      const target = prefersDesktop ? desktopVideoRef.current : mobileVideoRef.current;
      onVideoRef(target);
    };

    updateVideoRef();
    window.addEventListener("resize", updateVideoRef);

    return () => {
      window.removeEventListener("resize", updateVideoRef);
      onVideoRef(null);
    };
  }, [onVideoRef, question?.id]);

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

  // Fullscreen overlay buttons component
  const FullscreenOverlayButtons = () => {
    if (!isFullscreen) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Gradient overlay for better button visibility */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
        
        {/* Answer buttons positioned on the right side */}
        <div className="absolute inset-0 flex items-center justify-end p-8">
          <div className="flex w-72 flex-col space-y-4 pointer-events-auto">
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
                variant="hero"
                size="xl"
                onClick={onNext}
                className="w-full mt-2"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="mb-8">
          <AspectRatio ratio={16 / 9} className="rounded-xl shadow-depth overflow-hidden bg-black">
            <div className="relative w-full h-full" ref={desktopFullscreenContainerRef}>
              <video
                ref={desktopVideoRef}
                controls
                autoPlay
                loop
                muted
                playsInline
                src={question.videoUrl}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-end p-8 pointer-events-none">
                <div className="flex w-72 flex-col space-y-4 pointer-events-auto">
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
                      variant="hero"
                      size="xl"
                      onClick={onNext}
                      className="w-full mt-2"
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </AspectRatio>
        </div>
      </div>

      {/* Mobile Layout - Fullscreen Container with Video and Right Side Buttons */}
      <div className="md:hidden relative" ref={mobileFullscreenContainerRef}>
        <div className="fixed inset-0 -z-10">
          <video 
            ref={mobileVideoRef}
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

    </div>
    {/* Render fullscreen overlay buttons using portal */}
    {createPortal(<FullscreenOverlayButtons />, document.body)}
    </>
  );
};

export default QuizQuestion;
