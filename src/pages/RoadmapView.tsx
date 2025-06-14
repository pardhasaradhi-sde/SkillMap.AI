
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RoadmapView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!id) {
      navigate('/roadmaps');
      return;
    }

    fetchRoadmap();
  }, [user, id]);

  const fetchRoadmap = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setRoadmap(data);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      toast.error('Failed to load roadmap');
      navigate('/roadmaps');
    } finally {
      setLoading(false);
    }
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <div className="text-white text-xl">Loading your roadmap...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <div className="text-white text-xl">Roadmap not found</div>
            <Button
              onClick={() => navigate('/roadmaps')}
              className="mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Back to Roadmaps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formData = {
    skill: roadmap.skill_name,
    level: roadmap.current_level,
    timeCommitment: roadmap.time_commitment,
    learningStyle: roadmap.learning_style || '',
    goal: roadmap.end_goal || ''
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Simple Header */}
      <div className="pt-20 pb-4 px-6">
        <div className="container mx-auto max-w-6xl">
          <Button
            onClick={() => navigate('/roadmaps')}
            className="bg-slate-800/50 border border-slate-700/50 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Roadmaps
          </Button>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="container mx-auto px-6">
        <RoadmapDisplay 
          formData={formData} 
          roadmapData={roadmap.generated_data}
          onBack={() => navigate('/roadmaps')}
        />
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapView;
