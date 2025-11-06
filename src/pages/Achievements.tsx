import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { achievements, monuments } from '@/lib/monumentData';
import { useAchievements, useMonuments, useUserProgress } from '@/hooks/useData';
import { ArrowLeft, Trophy, Lock } from 'lucide-react';

export default function Achievements() {
  const navigate = useNavigate();
  const { achievements: achievementsList, loading: achievementsLoading } = useAchievements();
  const { monuments: monumentsList, loading: monumentsLoading } = useMonuments();
  const { progress: userProgress, loading: progressLoading } = useUserProgress();
  
  const achievementsToUse = achievementsList.length > 0 ? achievementsList : achievements;
  const monumentsToUse = monumentsList.length > 0 ? monumentsList : monuments;

  if (achievementsLoading || monumentsLoading || progressLoading || !userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const unlockedAchievements = achievementsToUse.filter(a => 
    (userProgress.achievements || []).includes(a.id)
  );

  const progressPercentage = (unlockedAchievements.length / achievementsToUse.length) * 100;

  const getAchievementStatus = (achievement: typeof achievementsToUse[0]) => {
    const isUnlocked = (userProgress.achievements || []).includes(achievement.id);
    
    if (isUnlocked) return { unlocked: true, progress: 100 };

    // Calculate progress for each achievement
    switch (achievement.requirement) {
      case 'view_1_monument': {
        return {
          unlocked: false,
          progress: Math.min(((userProgress.visitedMonuments || []).length / 1) * 100, 100)
        };
      }
      case 'ar_1_monument': {
        return {
          unlocked: false,
          progress: Math.min(((userProgress.arViewed || []).length / 1) * 100, 100)
        };
      }
      case 'view_all_monuments': {
        return {
          unlocked: false,
          progress: ((userProgress.visitedMonuments || []).length / monumentsToUse.length) * 100
        };
      }
      case 'narration_3_monuments': {
        return {
          unlocked: false,
          progress: Math.min(((userProgress.narrationPlayed || []).length / 3) * 100, 100)
        };
      }
      case 'quiz_perfect_score': {
        const hasAnyPerfect = Object.values(userProgress.quizScores || {}).some((score) => score === 100);
        return {
          unlocked: false,
          progress: hasAnyPerfect ? 100 : 0
        };
      }
      case 'all_quizzes_perfect': {
        const completedQuizzes = Object.keys(userProgress.quizScores || {}).length;
        const perfectQuizzes = Object.values(userProgress.quizScores || {}).filter((score) => score === 100).length;
        return {
          unlocked: false,
          progress: completedQuizzes > 0 ? (perfectQuizzes / monumentsToUse.length) * 100 : 0
        };
      }
      default:
        return { unlocked: false, progress: 0 };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-24 h-24 text-orange-600" />
              {unlockedAchievements.length === achievementsToUse.length && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2"
                >
                  <span className="text-2xl">👑</span>
                </motion.div>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Achievements
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Track your progress and unlock all badges
          </p>
          
          {/* Overall Progress */}
          <Card className="max-w-2xl mx-auto border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl">Overall Progress</CardTitle>
              <CardDescription>
                {unlockedAchievements.length} of {achievementsToUse.length} achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-4" />
                <p className="text-center text-lg font-semibold text-orange-600">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monuments Visited</CardDescription>
              <CardTitle className="text-3xl">{(userProgress.visitedMonuments || []).length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AR Experiences</CardDescription>
              <CardTitle className="text-3xl">{(userProgress.arViewed || []).length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Narrations Played</CardDescription>
              <CardTitle className="text-3xl">{(userProgress.narrationPlayed || []).length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quizzes Completed</CardDescription>
              <CardTitle className="text-3xl">{Object.keys(userProgress.quizScores || {}).length}</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">All Achievements</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementsToUse.map((achievement, index) => {
              const status = getAchievementStatus(achievement);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden transition-all ${
                    status.unlocked 
                      ? 'border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-yellow-50' 
                      : 'border-2 border-gray-200 bg-gray-50'
                  }`}>
                    {status.unlocked && (
                      <div className="absolute top-0 right-0 bg-orange-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                        UNLOCKED
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`text-5xl ${status.unlocked ? '' : 'grayscale opacity-40'}`}>
                          {achievement.icon}
                        </div>
                        {!status.unlocked && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <CardTitle className={status.unlocked ? 'text-orange-800' : 'text-gray-500'}>
                        {achievement.name}
                      </CardTitle>
                      <CardDescription className={status.unlocked ? 'text-gray-700' : 'text-gray-400'}>
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    
                    {!status.unlocked && (
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{Math.round(status.progress)}%</span>
                          </div>
                          <Progress value={status.progress} className="h-2" />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-2xl">Keep Exploring!</CardTitle>
              <CardDescription className="text-base">
                Visit more monuments and complete quizzes to unlock all achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Explore Monuments
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/quiz')}
              >
                Take a Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}