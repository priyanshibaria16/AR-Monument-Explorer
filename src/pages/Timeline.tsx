import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { monuments } from '@/lib/monumentData';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

export default function Timeline() {
  const navigate = useNavigate();
  const [selectedEra, setSelectedEra] = useState<string>('all');

  const eras = ['all', 'ancient', 'medieval', 'modern'];

  // Sort monuments by year
  const sortedMonuments = [...monuments].sort((a, b) => {
    const yearA = parseInt(a.yearBuilt.split('-')[0]);
    const yearB = parseInt(b.yearBuilt.split('-')[0]);
    return yearA - yearB;
  });

  const filteredMonuments = selectedEra === 'all'
    ? sortedMonuments
    : sortedMonuments.filter(m => m.era === selectedEra);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Clock className="w-16 h-16 mx-auto mb-4 text-orange-600" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Historical Timeline
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Journey through time and explore monuments across different eras
          </p>
        </motion.div>

        {/* Era Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {eras.map((era) => (
            <Button
              key={era}
              variant={selectedEra === era ? 'default' : 'outline'}
              onClick={() => setSelectedEra(era)}
              className={selectedEra === era ? 'bg-gradient-to-r from-orange-600 to-red-600' : ''}
            >
              {era.charAt(0).toUpperCase() + era.slice(1)} Era
            </Button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-600 via-red-600 to-pink-600 hidden md:block" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {filteredMonuments.map((monument, index) => (
              <motion.div
                key={monument.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <Card className="hover:shadow-xl transition-shadow border-2 hover:border-orange-500">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={monument.image}
                        alt={monument.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-orange-600">
                        {monument.era}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold text-orange-600">{monument.yearBuilt}</span>
                      </div>
                      <CardTitle className="text-2xl">{monument.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {monument.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {monument.history}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Architect: {monument.architect}</span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        onClick={() => navigate(`/monument/${monument.id}`)}
                      >
                        Explore in 3D
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:block relative">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-red-600 border-4 border-background shadow-lg" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white animate-pulse" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {filteredMonuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-muted-foreground">No monuments found for this era</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}