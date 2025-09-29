interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgress = ({ currentQuestion, totalQuestions }: QuizProgressProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Question {currentQuestion} of {totalQuestions}
        </h2>
      </div>
      <div className="w-full bg-secondary rounded-full h-3">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;