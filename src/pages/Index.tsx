import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toggleFavorite } from '@/lib/monumentData';
import { useMonuments, useUserProgress } from '@/hooks/useData';
import { MapPin, Trophy, BookOpen, Sparkles, Search, Heart, Play, Clock, Images, Star, ArrowRight, Compass, Calendar, CheckCircle, ArrowUp, Twitter, Instagram, Github } from 'lucide-react';
import { isMetaMaskInstalled } from '@/lib/web3';
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

const MotionCard = motion(Card);

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  const { monuments, loading: monumentsLoading } = useMonuments();
  const { progress: userProgress, loading: progressLoading } = useUserProgress();

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMonuments = monuments.filter(monument => {
    const matchesSearch = searchQuery === '' || 
      monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monument.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || monument.region === selectedRegion;
    const matchesEra = selectedEra === 'all' || monument.era === selectedEra;
    const matchesCategory = selectedCategory === 'all' || monument.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'visited' && userProgress?.visitedMonuments?.includes(monument.id)) ||
      (activeTab === 'favorites' && userProgress?.favoriteMonuments?.includes(monument.id));
      
    return matchesSearch && matchesRegion && matchesEra && matchesCategory && matchesTab;
  });

  // Get unique values for filters
  const regions = monuments.length > 0 ? [...new Set(monuments.map(m => m.region))] : [];
  const eras = monuments.length > 0 ? [...new Set(monuments.map(m => m.era))] : [];
  const categories = monuments.length > 0 ? [...new Set(monuments.map(m => m.category))] : [];

  // Get random monuments for featured section
  const featuredMonuments = monuments.length > 0 
    ? [...monuments].sort(() => 0.5 - Math.random()).slice(0, 3)
    : [];

  const handleFavoriteToggle = async (monumentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Check if MetaMask is installed before proceeding
      if (!isMetaMaskInstalled()) {
        toast.error('Please install MetaMask to save favorites');
        window.open('https://metamask.io/download.html', '_blank');
        return;
      }
      
      const isFavorite = await toggleFavorite(monumentId);
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error('Failed to update favorite');
    }
  };

  // Loading skeleton
  if (monumentsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Discover the World's Greatest Monuments
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Explore historical landmarks, learn their stories, and experience them in augmented reality
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="gap-2 group"
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Exploring
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Compass className="h-4 w-4" />
                Take a Tour
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div id="explore" className={`sticky top-0 z-20 bg-background/80 backdrop-blur-sm transition-shadow ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search monuments by name or location..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="min-w-[150px]">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedEra} onValueChange={setSelectedEra}>
                <SelectTrigger className="min-w-[150px]">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Eras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Eras</SelectItem>
                  {eras.map(era => (
                    <SelectItem key={era} value={era}>
                      {era}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="min-w-[150px]">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>All Monuments</span>
              </TabsTrigger>
              <TabsTrigger value="visited" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Visited</span>
                {userProgress?.visitedMonuments?.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {userProgress.visitedMonuments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
                {userProgress?.favoriteMonuments?.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {userProgress.favoriteMonuments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Featured Section */}
      {activeTab === 'all' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Featured Monuments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredMonuments.map((monument) => (
              <MotionCard 
                key={`featured-${monument.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
                onClick={() => navigate(`/monument/${monument.id}`)}
              >
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={monument.imageUrl || '/images/placeholder-monument.jpg'} 
                    alt={monument.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-md">{monument.name}</h3>
                        <p className="text-sm text-white/90 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {monument.location}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-background/80 backdrop-blur-sm hover:bg-background text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(monument.id, e);
                        }}
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            userProgress?.favoriteMonuments?.includes(monument.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-foreground/50 hover:text-red-500'
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      )}

      {/* Main Monuments Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {activeTab === 'all' 
              ? 'All Monuments' 
              : activeTab === 'visited' 
                ? 'Your Visited Monuments'
                : 'Your Favorites'}
            {filteredMonuments.length > 0 && (
              <span className="text-muted-foreground text-base font-normal ml-2">
                ({filteredMonuments.length} {filteredMonuments.length === 1 ? 'result' : 'results'})
              </span>
            )}
          </h2>
        </div>
        
        {filteredMonuments.length === 0 ? (
          <div className="text-center py-12">
            <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No monuments found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedRegion !== 'all' || selectedEra !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : activeTab === 'visited'
                  ? 'Monuments you visit will appear here'
                  : activeTab === 'favorites'
                    ? 'Your favorite monuments will appear here'
                    : 'No monuments available at the moment'}
            </p>
            {(searchQuery || selectedRegion !== 'all' || selectedEra !== 'all' || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedEra('all');
                  setSelectedCategory('all');
                  setActiveTab('all');
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMonuments.map((monument, index) => (
                <MotionCard
                  key={`${monument.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group cursor-pointer overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(`/monument/${monument.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={monument.imageUrl || '/images/placeholder-monument.jpg'} 
                      alt={monument.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-monument.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(monument.id, e);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 transition-colors ${
                            userProgress?.favoriteMonuments?.includes(monument.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-foreground/50 hover:text-red-500'
                          }`} 
                        />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-2">
                      <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                        {monument.region}
                      </Badge>
                      {userProgress?.visitedMonuments?.includes(monument.id) && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          Visited
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{monument.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {monument.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{monument.rating || '4.8'}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {monument.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {monument.era}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {monument.category}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/monument/${monument.id}`);
                      }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </CardFooter>
                </MotionCard>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Explore Monuments on the Map</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover historical landmarks across different regions and plan your next visit
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl border">
            <MapContainer 
              center={[20.5937, 78.9629]} 
              zoom={5} 
              style={{ height: '500px', width: '100%' }}
              zoomControl={false}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {monuments
                .filter(monument => 
                  monument.coordinates && 
                  !isNaN(monument.coordinates.lat) && 
                  !isNaN(monument.coordinates.lng) &&
                  Math.abs(monument.coordinates.lat) <= 90 &&
                  Math.abs(monument.coordinates.lng) <= 180
                )
                .map(monument => {
                const isVisited = userProgress?.visitedMonuments?.includes(monument.id);
                const isFavorite = userProgress?.favoriteMonuments?.includes(monument.id);
                
                return (
                  <Marker 
                    key={`marker-${monument.id}`} 
                    position={[monument.coordinates.lat, monument.coordinates.lng]}
                    icon={L.divIcon({
                      html: `
                        <div class="relative group">
                          <div class="w-8 h-8 bg-primary/90 text-white rounded-full flex items-center justify-center 
                            shadow-lg border-2 border-white transform transition-all duration-300
                            ${isVisited ? 'border-green-400' : 'border-white'} 
                            ${isFavorite ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
                            group-hover:scale-110">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/90 transform rotate-45"></div>
                        </div>
                      `,
                      className: 'border-0 bg-transparent',
                      iconSize: [32, 32],
                      iconAnchor: [16, 32],
                      popupAnchor: [0, -32]
                    })}
                  >
                    <Popup className="rounded-lg shadow-xl overflow-hidden">
                      <div className="w-64">
                        <div className="relative h-32 bg-muted overflow-hidden">
                          <img 
                            src={monument.imageUrl || '/images/placeholder-monument.jpg'} 
                            alt={monument.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-monument.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                              {monument.region}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm">{monument.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{monument.location}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs font-medium">{monument.rating || '4.8'}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="xs"
                              onClick={() => {
                                // Close the popup
                                document.querySelector('.leaflet-popup-close-button')?.dispatchEvent(new MouseEvent('click'));
                                navigate(`/monument/${monument.id}`);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
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
      </div>

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