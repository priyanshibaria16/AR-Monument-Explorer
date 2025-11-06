import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { monuments, getUserProgress, toggleFavorite } from '@/lib/monumentData';
import { Map, Trophy, BookOpen, Sparkles, Search, Heart, Play, Clock, Images } from 'lucide-react';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
const DefaultIcon = L.Icon.Default.prototype as L.Icon & { _getIconUrl?: () => void };
delete DefaultIcon._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const userProgress = getUserProgress();

  const filteredMonuments = monuments.filter(monument => {
    const matchesSearch = monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         monument.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || monument.region === selectedRegion;
    const matchesEra = selectedEra === 'all' || monument.era === selectedEra;
    const matchesCategory = selectedCategory === 'all' || monument.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesEra && matchesCategory;
  });

  const handleFavoriteToggle = (monumentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = toggleFavorite(monumentId);
    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const startVirtualTour = () => {
    if (monuments.length > 0) {
      navigate(`/monument/${monuments[0].id}`, { state: { tourMode: true } });
      toast.success('Virtual tour started! Follow the guided experience.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-20 px-6"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              Discover India's Heritage
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Experience magnificent monuments in immersive 3D and Augmented Reality
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 pt-6"
          >
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-lg"
              onClick={() => document.getElementById('monuments')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={startVirtualTour}
            >
              <Play className="w-5 h-5 mr-2" />
              Virtual Tour
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => navigate('/achievements')}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            {[
              { label: 'Monuments', value: monuments.length },
              { label: 'Visited', value: userProgress.visitedMonuments.length },
              { label: 'Achievements', value: userProgress.achievements.length }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Experience History Like Never Before</h2>
            <p className="text-xl text-muted-foreground">Interactive features to enhance your learning journey</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <Map className="w-12 h-12" />,
                title: '3D Models',
                description: 'Explore detailed 3D models with interactive controls'
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: 'AR Experience',
                description: 'Place monuments in your space using AR technology'
              },
              {
                icon: <BookOpen className="w-12 h-12" />,
                title: 'Learn & Quiz',
                description: 'Test your knowledge with interactive quizzes'
              },
              {
                icon: <Clock className="w-12 h-12" />,
                title: 'Timeline',
                description: 'Journey through history on an interactive timeline'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-orange-500 group">
                  <CardHeader>
                    <div className="text-orange-600 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="monuments" className="py-16 px-6 bg-accent/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">Discover Monuments</h2>
            <p className="text-xl text-muted-foreground">Search, filter, and explore India's heritage</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 space-y-4"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search monuments by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEra} onValueChange={setSelectedEra}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Era" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Eras</SelectItem>
                  <SelectItem value="ancient">Ancient</SelectItem>
                  <SelectItem value="medieval">Medieval</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="temple">Temple</SelectItem>
                  <SelectItem value="fort">Fort</SelectItem>
                  <SelectItem value="palace">Palace</SelectItem>
                  <SelectItem value="monument">Monument</SelectItem>
                  <SelectItem value="tomb">Tomb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Monument Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonuments.map((monument, index) => {
              const isFavorite = userProgress.favorites.includes(monument.id);
              
              return (
                <motion.div
                  key={monument.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-2xl transition-all group border-2 hover:border-orange-500"
                    onClick={() => navigate(`/monument/${monument.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={monument.image}
                        alt={monument.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-orange-600">{monument.yearBuilt}</Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleFavoriteToggle(monument.id, e)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                        {monument.name}
                      </CardTitle>
                      <CardDescription>{monument.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {monument.description}
                      </p>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="outline">{monument.category}</Badge>
                        <Badge variant="outline">{monument.era}</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                        Explore in 3D
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredMonuments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-muted-foreground">No monuments found matching your criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-white/90">
            Unlock achievements, test your knowledge, and become a heritage expert
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90"
              onClick={() => navigate('/gallery')}
            >
              <Images className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90"
              onClick={() => navigate('/timeline')}
            >
              <Clock className="w-5 h-5 mr-2" />
              Explore Timeline
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20"
              onClick={() => navigate('/quiz')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Take a Quiz
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}