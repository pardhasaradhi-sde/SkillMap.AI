
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '../components/Hero';
import SkillGenerator from '../components/SkillGenerator';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Hero />
      <div id="skill-generator" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <SkillGenerator />
      </div>
      
      {/* Only show marketing sections for non-authenticated users */}
      {!user && (
        <>
          <div id="features" className="bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800">
            <Features />
          </div>
          <div id="pricing" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Pricing />
          </div>
          <div id="testimonials" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Testimonials />
          </div>
        </>
      )}
      
      <div className="bg-gradient-to-br from-slate-900 to-black">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
