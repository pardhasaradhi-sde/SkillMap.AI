
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Zap, Target, Clock, TrendingUp, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RoadmapCard from '@/components/RoadmapCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Roadmaps = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchRoadmaps();
  }, [user]);

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapClick = (roadmapId: string) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  const handleAuthClick = () => {
    // This will be handled by the parent component
  };

  const handleScrollToSection = (sectionId: string) => {
    // This will be handled by the parent component
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <div className="text-white text-xl">Loading your roadmaps...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-full px-6 py-2 mb-6">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-glow">
              My Learning Roadmaps
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your personalized journey to mastery. Track progress, achieve goals, and unlock your potential with AI-guided learning paths.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{roadmaps.length}</div>
                <div className="text-gray-300 text-sm">Active Roadmaps</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.timeline || '4'), 0)}
                </div>
                <div className="text-gray-300 text-sm">Total Weeks</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.time_commitment || '10'), 0)}h
                </div>
                <div className="text-gray-300 text-sm">Weekly Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 pb-16">
        {roadmaps.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-16 shadow-2xl max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-purple-400/30">
                <BookOpen className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Start Your Learning Journey</h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Create your first AI-powered roadmap and transform the way you learn. Get personalized recommendations, structured timelines, and expert guidance.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Personalized learning paths</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Expert-curated resources</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>Goal-oriented milestones</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>Flexible timeline options</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/')}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Roadmap
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps.map((roadmap, index) => (
              <div
                key={roadmap.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoadmapCard
                  roadmap={roadmap}
                  onClick={() => handleRoadmapClick(roadmap.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Roadmaps;
