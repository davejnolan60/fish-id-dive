import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-underwater.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/*<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />*/}
        
        <div className="relative container mx-auto px-20">
          <div className="max-w-md">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 shadow-depth">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Welcome to SpearID
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Memorize your target fish before you get in the water
                by using our educational quiz and studying our
                database of over 300 species
              </p>
              
              <div className="flex justify-center">
                <Link to="/quiz">
                  <Button variant="hero" size="xl" className="px-12">
                    Generate Quiz
                  </Button>
                </Link>
              </div>
                
                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <Button variant="outline" size="lg" className="flex-1">
                    Create Account
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    Log In
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
};

export default Index;
