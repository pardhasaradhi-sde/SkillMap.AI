
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, User, LogOut, Map } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavbarProps {
  onAuthClick: () => void;
  onScrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick, onScrollToSection }) => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SkillMap.AI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Show roadmaps button only for authenticated users */}
            {user && (
              <Link to="/roadmaps">
                <Button 
                  variant="outline" 
                  className="border-purple-400/50 text-purple-200 hover:bg-purple-500/20 hover:text-white hover:border-purple-300 font-medium bg-black/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Map className="w-4 h-4 mr-2" />
                  My Roadmaps
                </Button>
              </Link>
            )}
            
            {/* Only show navigation links for non-authenticated users */}
            {!user && (
              <>
                <button 
                  onClick={() => onScrollToSection('features')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Features
                </button>
                <button 
                  onClick={() => onScrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => onScrollToSection('pricing')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Pricing
                </button>
              </>
            )}
            
            {!loading && (
              <>
                {user ? (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="p-2 text-white hover:bg-white/20 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-slate-900/95 backdrop-blur-xl border-white/20">
                      <SheetHeader>
                        <SheetTitle className="text-white">Account</SheetTitle>
                        <SheetDescription className="text-gray-300">
                          Manage your SkillMap.AI account
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{user.user_metadata?.full_name || 'User'}</p>
                            <p className="text-gray-300 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleSignOut}
                          variant="outline"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={onAuthClick}
                      className="border-white/40 text-white hover:bg-white/20 hover:text-white font-medium bg-black/20 backdrop-blur-sm"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={onAuthClick}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
