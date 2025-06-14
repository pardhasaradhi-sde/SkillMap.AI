import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Target, BookOpen, CheckCircle, Star, Link, Download, Share, Bell } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface RoadmapDisplayProps {
  formData: {
    skill: string;
    level: string;
    timeCommitment: string;
    learningStyle: string;
    goal: string;
  };
  roadmapData?: any;
  onBack: () => void;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ formData, roadmapData, onBack }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));

  // Use provided roadmapData or fallback to mock data
  const displayData = roadmapData || {
    title: `${formData.skill} Mastery Roadmap`,
    duration: `4 Weeks`,
    totalHours: formData.timeCommitment,
    motivationalTip: "Stay consistent and practice daily to achieve mastery!",
    summary: "This roadmap will guide you through structured learning to achieve your goals.",
    weeks: [
      {
        week: 1,
        title: "Foundation & Setup",
        description: "Build a solid foundation and set up your development environment",
        difficulty: "Beginner",
        estimatedHours: "8-10 hours",
        goals: [
          "Understand core concepts and terminology",
          "Set up development environment",
          "Complete your first practical exercise"
        ],
        tasks: [
          {
            id: "w1-t1",
            title: "Watch: Introduction to React Fundamentals",
            type: "video",
            duration: "2 hours",
            resource: "YouTube - React Official Tutorial"
          },
          {
            id: "w1-t2",
            title: "Setup: Create React Development Environment",
            type: "practice",
            duration: "1 hour",
            resource: "Follow setup guide"
          }
        ],
        checkpoint: "Create a simple React app with 3 components"
      }
    ]
  };

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const toggleWeek = (weekNumber: number) => {
    const newOpenWeeks = new Set(openWeeks);
    if (newOpenWeeks.has(weekNumber)) {
      newOpenWeeks.delete(weekNumber);
    } else {
      newOpenWeeks.add(weekNumber);
    }
    setOpenWeeks(newOpenWeeks);
  };

  const handleExportToPDF = () => {
    // Create a simple text representation of the roadmap for download
    const roadmapText = `
${displayData.title}
Duration: ${displayData.duration}
Time Commitment: ${displayData.totalHours} hours/week
Level: ${formData.level}

${displayData.weeks.map(week => `
Week ${week.week}: ${week.title}
${week.description}
Difficulty: ${week.difficulty}

Goals:
${week.goals?.map(goal => `• ${goal}`).join('\n') || ''}

Tasks:
${week.tasks?.map(task => `• ${task.title} (${task.duration})`).join('\n') || ''}

Checkpoint: ${week.checkpoint || 'N/A'}
`).join('\n')}
    `;

    const blob = new Blob([roadmapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.skill}-roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Roadmap exported successfully!');
  };

  const handleShareRoadmap = async () => {
    const shareText = `Check out my ${formData.skill} learning roadmap! ${displayData.duration} journey to master ${formData.skill}.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayData.title,
          text: shareText,
          url: window.location.href,
        });
        toast.success('Roadmap shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareText = `Check out my ${formData.skill} learning roadmap! ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Roadmap link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleGetReminders = () => {
    // For now, just show a toast. In a real app, this would set up notifications
    toast.success('Reminders feature coming soon! We\'ll notify you about your learning milestones.');
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'practice': return '💻';
      case 'project': return '🛠️';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const totalTasks = displayData.weeks.reduce((acc, week) => acc + (week.tasks?.length || 0), 0);
  const completedCount = completedTasks.size;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Progress Overview */}
        <div className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  {displayData.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">{displayData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">{displayData.totalHours} hours/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">{formData.level}</span>
                  </div>
                </div>
                {displayData.motivationalTip && (
                  <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                    <p className="text-purple-200 font-medium">
                      💡 {displayData.motivationalTip}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="lg:text-right">
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-gray-300 mb-3 font-medium">Complete</div>
                  <Progress value={progressPercentage} className="w-40 bg-gray-700 h-3" />
                  <div className="text-sm text-gray-400 mt-2">
                    {completedCount} of {totalTasks} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Roadmap */}
        <div className="space-y-8">
          {displayData.weeks.map((week, index) => {
            const weekTasks = week.tasks?.length || 0;
            const weekCompleted = week.tasks?.filter(task => completedTasks.has(task.id)).length || 0;
            const weekProgress = weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0;
            const isOpen = openWeeks.has(week.week);

            return (
              <Card 
                key={week.week} 
                className="bg-slate-800/50 border border-slate-700/50 shadow-2xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300"
              >
                <Collapsible open={isOpen} onOpenChange={() => toggleWeek(week.week)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {week.week}
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-white mb-2">Week {week.week}: {week.title}</CardTitle>
                            <CardDescription className="text-lg text-gray-300">{week.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge className={`${getDifficultyColor(week.difficulty)} border text-sm px-3 py-1`}>
                            {week.difficulty}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-400 mb-1">{Math.round(weekProgress)}%</div>
                            <Progress value={weekProgress} className="w-24 bg-gray-700 h-2" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-6">
                      {/* Week Goals */}
                      {week.goals && week.goals.length > 0 && (
                        <div className="p-6 bg-purple-500/20 border border-purple-400/30 rounded-2xl">
                          <h4 className="font-bold text-lg mb-4 flex items-center gap-3 text-purple-300">
                            <Target className="w-5 h-5 text-purple-400" />
                            Week Goals
                          </h4>
                          <ul className="space-y-3">
                            {week.goals.map((goal, index) => (
                              <li key={index} className="flex items-center gap-3 text-gray-300">
                                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                <span>{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tasks */}
                      {week.tasks && week.tasks.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg flex items-center gap-3 text-purple-300">
                            <BookOpen className="w-5 h-5 text-purple-400" />
                            Learning Tasks
                          </h4>
                          {week.tasks.map((task) => (
                            <div 
                              key={task.id} 
                              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                                completedTasks.has(task.id) 
                                  ? 'bg-emerald-500/20 border-emerald-400/30 shadow-lg' 
                                  : 'bg-slate-700/50 border-slate-600/50 hover:border-purple-400/50 hover:bg-slate-700/70'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <Checkbox
                                  checked={completedTasks.has(task.id)}
                                  onCheckedChange={() => toggleTask(task.id)}
                                  className="mt-1 border-purple-400 data-[state=checked]:bg-purple-500 w-5 h-5"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{getTaskTypeIcon(task.type)}</span>
                                    <h5 className={`font-semibold text-lg ${completedTasks.has(task.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                                      {task.title}
                                    </h5>
                                  </div>
                                  <div className="flex items-center gap-6 text-gray-400">
                                    <span className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      {task.duration}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <Link className="w-4 h-4" />
                                      {task.resource}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Checkpoint */}
                      {week.checkpoint && (
                        <div className="p-6 bg-purple-500/20 border border-purple-400/30 rounded-2xl">
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-3 text-purple-300">
                            <Star className="w-5 h-5 text-purple-400" />
                            Week Checkpoint
                          </h4>
                          <p className="text-purple-200 text-lg">{week.checkpoint}</p>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Export & Share Your Progress</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleExportToPDF}
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Export to PDF
              </Button>
              <Button 
                onClick={handleShareRoadmap}
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Share className="w-5 h-5 mr-2" />
                Share Roadmap
              </Button>
              <Button 
                onClick={handleGetReminders}
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Bell className="w-5 h-5 mr-2" />
                Get Reminders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;
