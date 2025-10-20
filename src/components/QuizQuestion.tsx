import { useEffect, useRef, useState } from "react";
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

  // Monitor fullscreen changes and intercept video fullscreen requests
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

  // Handle custom fullscreen for container
  const handleCustomFullscreen = async () => {
    const desktopContainer = desktopFullscreenContainerRef.current;
    if (!desktopContainer) return;

    try {
      if (desktopContainer.requestFullscreen) {
        await desktopContainer.requestFullscreen();
      } else if ((desktopContainer as any).webkitRequestFullscreen) {
        await (desktopContainer as any).webkitRequestFullscreen();
      } else if ((desktopContainer as any).mozRequestFullScreen) {
        await (desktopContainer as any).mozRequestFullScreen();
      } else if ((desktopContainer as any).msRequestFullscreen) {
        await (desktopContainer as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Failed to request fullscreen:', error);
    }
  };

  // Handle exit fullscreen
  const handleExitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
    }
  };

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
        
        {/* Exit fullscreen button */}
        <button
          onClick={handleExitFullscreen}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md backdrop-blur-sm transition-colors pointer-events-auto z-50"
          title="Exit Fullscreen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        </button>
        
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
    <>
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
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Custom fullscreen button */}
              <button
                onClick={handleCustomFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md backdrop-blur-sm transition-colors z-10"
                title="Fullscreen"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </button>
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
