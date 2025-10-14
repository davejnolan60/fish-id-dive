import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import Header from "@/components/Header";
import resultsBackground from "@/assets/results-background.jpg";

const Results = () => {
  const location = useLocation();
  const { score, totalQuestions, percentage, answersDetailed } = location.state || { 
    score: 0, 
    totalQuestions: 12, 
    percentage: 0,
    answersDetailed: [] as { questionId: string | number; selected: string; correct: string; isCorrect: boolean }[]
  };

  // Derive actual correct/incorrect answers from quiz state
  const correctFish = (answersDetailed || [])
    .filter((a: any) => a.isCorrect)
    .map((a: any) => ({
      name: a.correct,
      selected: a.selected,
    }));

  const incorrectFish = (answersDetailed || [])
    .filter((a: any) => !a.isCorrect)
    .map((a: any) => ({
      name: a.correct,
      selected: a.selected,
    }));

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent fish identification skills!";
    if (percentage >= 60) return "Good job! Keep practicing to improve.";
    if (percentage >= 40) return "Not bad! More practice will help you improve.";
    return "Keep studying! Practice makes perfect.";
  };

  const newFishLearned = Math.floor(score * 0.4); // Rough calculation

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${resultsBackground})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Main Results Card */}
          <div className="flex justify-center mb-12">
            <Card className="w-full max-w-md bg-card/95 backdrop-blur-md shadow-depth">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Congratulations!
                </h1>
                
                {/* Score Pie Chart */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <ChartContainer
                    className="!aspect-square"
                    config={{}}
                  >
                    <PieChart>
                      <Pie
                        data={[{ name: "Correct", value: Math.max(0, Math.min(100, percentage)) }, { name: "Remaining", value: Math.max(0, 100 - Math.max(0, Math.min(100, percentage))) }]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={56}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        stroke="transparent"
                      >
                        <Cell fill={"hsl(var(--primary))"} />
                        <Cell fill={"hsl(var(--muted))"} />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">
                      {percentage}%
                    </span>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-2">
                  {score} of {totalQuestions} answers correct
                </p>
                
                <p className="text-lg font-semibold text-success mb-6">
                  {newFishLearned} new fish memorized!
                </p>
                
                <p className="text-sm text-muted-foreground mb-8">
                  Create an account or log in to save your score, see your
                  personal average, and track the fish species you have
                  discovered. You can review the fish in the quiz by clicking
                  below for more information.
                </p>
                
                <div className="space-y-3">
                  <Button variant="default" size="lg" className="w-full">
                    Create Account
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Log In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Correct Answers */}
            <div className="bg-card/90 backdrop-blur-md rounded-xl p-6 shadow-depth">
              <h2 className="text-xl font-bold text-success mb-4 text-center">
                Correct
              </h2>
              <div className="space-y-4">
                {correctFish.length === 0 && (
                  <div className="text-center text-muted-foreground">No correct answers this time.</div>
                )}
                {correctFish.map((fish, index) => (
                  <div key={index} className="bg-background/50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="w-full h-32 bg-secondary/50 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-muted-foreground">🐟</span>
                      </div>
                      <div className="bg-success text-success-foreground px-3 py-1 rounded text-sm font-medium">
                        {fish.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incorrect Answers */}
            <div className="bg-card/90 backdrop-blur-md rounded-xl p-6 shadow-depth">
              <h2 className="text-xl font-bold text-error mb-4 text-center">
                Incorrect
              </h2>
              <div className="space-y-4">
                {incorrectFish.length === 0 && (
                  <div className="text-center text-muted-foreground">No incorrect answers. Great job!</div>
                )}
                {incorrectFish.map((fish, index) => (
                  <div key={index} className="bg-background/50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="w-full h-32 bg-secondary/50 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-muted-foreground">🐟</span>
                      </div>
                      <div className="bg-error text-error-foreground px-3 py-1 rounded text-sm font-medium">
                        {fish.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Your answer: {fish.selected}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Try Again Button */}
          <div className="text-center mt-12">
            <p className="text-primary-foreground mb-4 font-medium">Try again?</p>
            <Link to="/quiz">
              <Button variant="hero" size="xl" className="px-12">
                Generate Quiz
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;