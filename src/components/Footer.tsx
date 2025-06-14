
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Star, Users, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInputRef.current?.value?.trim();

    if (email) {
      toast({
        title: 'Subscribed!',
        description: "You'll get the best learning tips and updates in your inbox.",
      });
      // Optionally, clear the input
      if (emailInputRef.current) emailInputRef.current.value = '';
    } else {
      toast({
        title: 'Please enter a valid email address.',
        variant: 'destructive',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            Ready to Master Your Next Skill?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already using AI-powered roadmaps to accelerate their growth.
          </p>
          <Button 
            onClick={scrollToTop}
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Generate Your Roadmap Now
          </Button>
        </div>

        <Separator className="mb-12 bg-white/20" />

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                SkillMap.AI
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              AI-powered personalized learning roadmaps that adapt to your goals, 
              schedule, and learning style. Transform scattered tutorials into 
              structured 4-week mastery journeys.
            </p>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>50K+ Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Popular Skills */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Popular Skills</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-purple-400 transition-colors">React Development</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Python Programming</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Machine Learning</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Digital Marketing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <form 
          className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-white/10"
          onSubmit={handleSubscribe}
        >
          <div className="text-center max-w-2xl mx-auto">
            <Mail className="w-8 h-8 mx-auto mb-4 text-purple-400" />
            <h4 className="text-xl font-semibold mb-2 text-white">Stay Updated</h4>
            <p className="text-gray-300 mb-6">
              Get weekly learning tips, new skill roadmaps, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                ref={emailInputRef}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg text-white font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </form>

        {/* Bottom */}
        <div className="text-center text-gray-400">
          <p>
            © 2025 SkillMap.AI. All rights reserved. Built with ❤️ for learners worldwide by Pardhu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
