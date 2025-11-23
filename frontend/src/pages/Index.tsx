import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, TrendingUp, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">EduConnect</h1>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-gradient-hero hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Transform Learning with EduConnect
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive Learning Management System designed for modern education.
              Connect students, teachers, and administrators in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-hero hover:opacity-90 transition-opacity text-lg gap-2"
              >
                Start Learning <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose EduConnect?</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Rich Resources</h4>
                <p className="text-muted-foreground">
                  Access videos, documents, and interactive materials organized by category.
                  Download or view resources anytime, anywhere.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Role-Based Access</h4>
                <p className="text-muted-foreground">
                  Tailored experiences for students, teachers, and administrators.
                  Each role has the tools they need to succeed.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Analytics & Insights</h4>
                <p className="text-muted-foreground">
                  Track engagement with detailed analytics. See views, downloads,
                  and access patterns to improve learning outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and educators already using EduConnect
              to enhance their learning experience.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-hero hover:opacity-90 transition-opacity text-lg gap-2"
            >
              Create Your Account <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 EduConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
