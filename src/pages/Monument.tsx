import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreeViewer from '@/components/ThreeViewer';
import ARViewer from '@/components/ARViewer';
import { monuments, toggleFavorite, shareMonument } from '@/lib/monumentData';
import { useMonuments, useUserProgress } from '@/hooks/useData';
import { api } from '@/lib/api';
import { ArrowLeft, Camera, Volume2, BookOpen, Trophy, Heart, Share2, Info, Lightbulb, ArrowRight, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Monument() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAR, setShowAR] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { monuments: monumentsList } = useMonuments();
  const { progress: userProgress, refreshProgress } = useUserProgress();
  const monument = monumentsList.find(m => m.id === id) || monuments.find(m => m.id === id);
  const tourMode = location.state?.tourMode;

  useEffect(() => {
    if (monument && userProgress) {
      setIsFavorite((userProgress.favorites || []).includes(monument.id));
      
      if (!(userProgress.visitedMonuments || []).includes(monument.id)) {
        api.addVisitedMonument(monument.id).then(() => {
          refreshProgress();
        }).catch(console.error);
      }
    }
  }, [monument, userProgress, refreshProgress]);

  if (!monument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Monument not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleARView = () => {
    if (userProgress && !(userProgress.arViewed || []).includes(monument.id)) {
      api.addARViewed(monument.id).then(() => {
        refreshProgress();
        toast.success('Achievement Unlocked!', {
          description: 'AR Pioneer badge earned!'
        });
      }).catch(console.error);
    }
    setShowAR(true);
  };

  const handleNarration = () => {
    if ('speechSynthesis' in window) {
      if (isNarrating) {
        window.speechSynthesis.cancel();
        setIsNarrating(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(monument.history);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsNarrating(false);
        
        if (userProgress && !(userProgress.narrationPlayed || []).includes(monument.id)) {
          api.addNarrationPlayed(monument.id).then(() => {
            refreshProgress();
            toast.success('Achievement Unlocked!', {
              description: 'History Buff badge earned!'
            });
          }).catch(console.error);
        }
      };

      window.speechSynthesis.speak(utterance);
      setIsNarrating(true);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const handleFavoriteToggle = () => {
    const newFavoriteState = toggleFavorite(monument.id);
    setIsFavorite(newFavoriteState);
    toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleShare = (platform: string) => {
    shareMonument(monument, platform);
    toast.success(`Shared on ${platform}!`);
  };

  const monumentsToUse = monumentsList.length > 0 ? monumentsList : monuments;
  const currentIndex = monumentsToUse.findIndex(m => m.id === monument.id);
  const nextMonument = monumentsToUse[(currentIndex + 1) % monumentsToUse.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavoriteToggle}
                className={isFavorite ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                    <Linkedin className="w-4 h-4 mr-2" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {monument.name}
              </h1>
              <p className="text-xl text-muted-foreground">{monument.location}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className="text-lg px-4 py-2 bg-orange-600">
                {monument.yearBuilt}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {monument.category}
              </Badge>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{monument.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="overflow-hidden border-2">
              <CardHeader>
                <CardTitle>3D Model Viewer</CardTitle>
                <CardDescription>
                  Rotate, zoom, and explore the monument in 3D
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full" style={{ height: '500px' }}>
                  <ThreeViewer
                    modelUrl={monument.modelUrl}
                    monumentName={monument.name}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                onClick={handleARView}
              >
                <Camera className="w-5 h-5 mr-2" />
                View in AR
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleNarration}
              >
                <Volume2 className={`w-5 h-5 mr-2 ${isNarrating ? 'animate-pulse' : ''}`} />
                {isNarrating ? 'Stop Audio' : 'Play Audio Guide'}
              </Button>
            </div>

            {/* Detailed Information Tabs */}
            <Card>
              <Tabs defaultValue="history" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="history">
                      <Info className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                    <TabsTrigger value="facts">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Fun Facts
                    </TabsTrigger>
                    <TabsTrigger value="details">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Details
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="history" className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {monument.history}
                    </p>
                  </TabsContent>
                  <TabsContent value="facts" className="space-y-3">
                    {monument.funFacts.map((fact, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-accent/50 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{fact}</p>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Architect</h4>
                        <p>{monument.architect}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Year Built</h4>
                        <p>{monument.yearBuilt}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Era</h4>
                        <p className="capitalize">{monument.era}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Region</h4>
                        <p className="capitalize">{monument.region}</p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-orange-800 dark:text-orange-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/quiz', { state: { monumentId: monument.id } })}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Take Quiz About This Monument
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/achievements')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Your Achievements
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/gallery')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Browse Gallery
                </Button>
              </CardContent>
            </Card>

            {tourMode && (
              <Card className="border-2 border-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🎯</span> Virtual Tour
                  </CardTitle>
                  <CardDescription>
                    Continue your guided tour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                    onClick={() => navigate(`/monument/${nextMonument.id}`, { state: { tourMode: true } })}
                  >
                    Next: {nextMonument.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Explore More</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monumentsToUse
                    .filter(m => m.id !== monument.id)
                    .slice(0, 3)
                    .map(m => (
                      <div
                        key={m.id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => navigate(`/monument/${m.id}`)}
                      >
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{m.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{m.location}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AR Viewer Modal */}
      {showAR && (
        <ARViewer
          monumentName={monument.name}
          modelUrl={monument.modelUrl}
          onClose={() => setShowAR(false)}
        />
      )}
    </div>
  );
}