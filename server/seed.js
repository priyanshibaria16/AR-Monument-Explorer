import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Monument from './models/Monument.js';
import QuizQuestion from './models/QuizQuestion.js';
import Achievement from './models/Achievement.js';

dotenv.config();

const monumentsData = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    coordinates: [27.1751, 78.0421],
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna',
    history: 'The Taj Mahal was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal. It took 22 years to complete and is considered the finest example of Mughal architecture.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e5e.glb',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    yearBuilt: '1632-1653',
    architect: 'Ustad Ahmad Lahauri',
    category: 'tomb',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'The Taj Mahal changes color depending on the time of day',
      'It took 20,000 workers to build the monument',
      'The four minarets are designed to lean outward to protect the main tomb in case of earthquake'
    ]
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    location: 'Delhi',
    coordinates: [28.6562, 77.2410],
    description: 'A historic fort in Old Delhi that served as the main residence of the Mughal emperors',
    history: 'The Red Fort was constructed in 1639 by the fifth Mughal Emperor Shah Jahan as the palace of his fortified capital Shahjahanabad. It served as the residence of the Mughal emperors for nearly 200 years.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e5f.glb',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    yearBuilt: '1639-1648',
    architect: 'Ustad Ahmad Lahauri',
    category: 'fort',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'The fort covers an area of 254 acres',
      'Every year on Independence Day, the Prime Minister hoists the national flag here',
      'The walls are made of red sandstone, giving it its name'
    ]
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    location: 'Mumbai, Maharashtra',
    coordinates: [18.9220, 72.8347],
    description: 'An arch-monument built in the 20th century in Mumbai',
    history: 'The Gateway of India was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder on their visit to India in 1911. Built in Indo-Saracenic style, it was completed in 1924.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e60.glb',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445',
    yearBuilt: '1911-1924',
    architect: 'George Wittet',
    category: 'monument',
    era: 'modern',
    region: 'west',
    funFacts: [
      'It was the first structure visitors arriving by boat would see',
      'The foundation stone was laid in 1911 but construction only began in 1915',
      'It is 26 meters high'
    ]
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    location: 'Delhi',
    coordinates: [28.5245, 77.1855],
    description: 'A minaret and victory tower that forms part of the Qutb complex',
    history: 'Qutub Minar is a 73-metre tall tapering tower built in 1193 by Qutb-ud-din Aibak. It is made of red sandstone and marble, and is the tallest brick minaret in the world.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e61.glb',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce',
    yearBuilt: '1193',
    architect: 'Qutb-ud-din Aibak',
    category: 'monument',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'It has 379 steps leading to the top',
      'The tower has a 14.3-meter base diameter which reduces to 2.7 meters at the top',
      'It is a UNESCO World Heritage Site'
    ]
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    location: 'Jaipur, Rajasthan',
    coordinates: [26.9239, 75.8267],
    description: 'A palace constructed of red and pink sandstone with a unique honeycomb structure',
    history: 'Built in 1799 by Maharaja Sawai Pratap Singh, the Hawa Mahal or "Palace of Winds" was designed to allow royal ladies to observe street festivals while remaining unseen from the outside.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e62.glb',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    yearBuilt: '1799',
    architect: 'Lal Chand Ustad',
    category: 'palace',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'It has 953 small windows called jharokhas',
      'The structure is only 5 stories high but appears taller',
      'It was built without any foundation'
    ]
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    location: 'Madurai, Tamil Nadu',
    coordinates: [9.9193, 78.1198],
    description: 'A historic Hindu temple dedicated to Goddess Meenakshi and Lord Sundareswarar',
    history: 'The Meenakshi Temple is one of the most famous temples in South India. It was built in the 16th century by the Nayak dynasty. The temple complex covers 14 acres and has 14 gopurams (towers), with the tallest being 170 feet high.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e63.glb',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    yearBuilt: '16th Century',
    architect: 'Nayak Dynasty',
    category: 'temple',
    era: 'medieval',
    region: 'south',
    funFacts: [
      'The temple has 14 gopurams (gateway towers)',
      'It attracts over 15,000 visitors daily',
      'The temple has 33,000 sculptures throughout its complex'
    ]
  },
  {
    id: 'charminar',
    name: 'Charminar',
    location: 'Hyderabad, Telangana',
    coordinates: [17.3616, 78.4747],
    description: 'A mosque and monument built in 1591, iconic symbol of Hyderabad',
    history: 'Charminar was constructed in 1591 by Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty. It was built to commemorate the end of a deadly plague. The monument has four minarets and is built in Indo-Islamic architectural style.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e64.glb',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    yearBuilt: '1591',
    architect: 'Muhammad Quli Qutb Shah',
    category: 'monument',
    era: 'medieval',
    region: 'south',
    funFacts: [
      'Charminar means "Four Minarets" in Urdu',
      'It has a mosque on its top floor',
      'The monument is a UNESCO World Heritage Site candidate'
    ]
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    location: 'Amritsar, Punjab',
    coordinates: [31.6199, 74.8765],
    description: 'The holiest Gurdwara of Sikhism, covered in gold leaf',
    history: 'The Golden Temple was built in 1589 by Guru Arjan Dev, the fifth Sikh Guru. The temple was rebuilt in 1764 after being destroyed, and Maharaja Ranjit Singh covered the upper floors with gold leaf in 1830. It represents the Sikh belief in equality and openness.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e65.glb',
    image: 'https://images.unsplash.com/photo-1555993536-1e0d0c4b4c5c',
    yearBuilt: '1589',
    architect: 'Guru Arjan Dev',
    category: 'temple',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'The temple is open to people of all faiths',
      'It serves free meals to over 100,000 people daily',
      'The gold covering was added in 1830 by Maharaja Ranjit Singh'
    ]
  },
  {
    id: 'victoria-memorial',
    name: 'Victoria Memorial',
    location: 'Kolkata, West Bengal',
    coordinates: [22.5448, 88.3426],
    description: 'A large marble building dedicated to Queen Victoria',
    history: 'The Victoria Memorial was built between 1906 and 1921 to commemorate Queen Victoria. It was designed by Sir William Emerson in Indo-Saracenic revivalist style. The memorial is now a museum and tourist attraction.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e66.glb',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    yearBuilt: '1906-1921',
    architect: 'Sir William Emerson',
    category: 'monument',
    era: 'modern',
    region: 'east',
    funFacts: [
      'The memorial is made of white Makrana marble',
      'It houses a museum with over 28,000 artifacts',
      'The memorial covers 64 acres of gardens'
    ]
  },
  {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    location: 'Mysore, Karnataka',
    coordinates: [12.3052, 76.6552],
    description: 'The official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore',
    history: 'The current Mysore Palace was built between 1897 and 1912 after the previous palace was destroyed by fire. It was designed by British architect Henry Irwin in Indo-Saracenic style. The palace is illuminated with 97,000 light bulbs on Sundays and during festivals.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e67.glb',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    yearBuilt: '1897-1912',
    architect: 'Henry Irwin',
    category: 'palace',
    era: 'modern',
    region: 'south',
    funFacts: [
      'The palace is illuminated with 97,000 light bulbs on special occasions',
      'It has over 100 rooms and halls',
      'The palace receives over 6 million visitors annually'
    ]
  },
  {
    id: 'sun-temple',
    name: 'Konark Sun Temple',
    location: 'Konark, Odisha',
    coordinates: [19.8876, 86.0945],
    description: 'A 13th-century Sun Temple dedicated to the Sun God Surya',
    history: 'The Konark Sun Temple was built in 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty. The temple is designed in the shape of a gigantic chariot with 24 wheels pulled by 7 horses. It is a UNESCO World Heritage Site.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e68.glb',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce',
    yearBuilt: '1250 CE',
    architect: 'King Narasimhadeva I',
    category: 'temple',
    era: 'medieval',
    region: 'east',
    funFacts: [
      'The temple is designed as a chariot with 24 wheels',
      'It is a UNESCO World Heritage Site',
      'The temple was partially buried in sand for centuries'
    ]
  },
  {
    id: 'ellora-caves',
    name: 'Ellora Caves',
    location: 'Aurangabad, Maharashtra',
    coordinates: [20.0263, 75.1790],
    description: 'A series of 34 rock-cut cave temples and monasteries',
    history: 'The Ellora Caves were carved between 600 and 1000 CE. They represent Hindu, Buddhist, and Jain religious traditions. The Kailasa Temple, carved from a single rock, is one of the largest monolithic structures in the world.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e69.glb',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    yearBuilt: '600-1000 CE',
    architect: 'Various Dynasties',
    category: 'temple',
    era: 'ancient',
    region: 'west',
    funFacts: [
      'The caves contain 34 monasteries and temples',
      'Kailasa Temple is carved from a single rock',
      'It is a UNESCO World Heritage Site'
    ]
  },
  {
    id: 'amer-fort',
    name: 'Amer Fort',
    location: 'Jaipur, Rajasthan',
    coordinates: [26.9855, 75.8513],
    description: 'A magnificent fort palace known for its artistic Hindu style elements',
    history: 'Amer Fort was built in 1592 by Raja Man Singh I. The fort is known for its blend of Hindu and Mughal architecture. It features massive gates, palaces, and temples. The fort is built with red sandstone and marble.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e70.glb',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    yearBuilt: '1592',
    architect: 'Raja Man Singh I',
    category: 'fort',
    era: 'medieval',
    region: 'north',
    funFacts: [
      'The fort has an underground tunnel connecting to Jaigarh Fort',
      'It features the Sheesh Mahal (Palace of Mirrors)',
      'The fort is situated on a hilltop overlooking Maota Lake'
    ]
  },
  {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    location: 'New Delhi',
    coordinates: [28.5535, 77.2588],
    description: 'A Bahá\'í House of Worship shaped like a lotus flower',
    history: 'The Lotus Temple was completed in 1986 and designed by Iranian architect Fariborz Sahba. It is made of white marble and shaped like a lotus flower with 27 petals. The temple is open to people of all faiths.',
    modelUrl: 'https://models.readyplayer.me/64f1a5b5c9c5e3001f5e5e71.glb',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce',
    yearBuilt: '1986',
    architect: 'Fariborz Sahba',
    category: 'temple',
    era: 'modern',
    region: 'north',
    funFacts: [
      'The temple is shaped like a lotus with 27 petals',
      'It is made entirely of white marble',
      'The temple is open to people of all faiths'
    ]
  }
];

const quizQuestionsData = [
  {
    id: 'q1',
    monumentId: 'taj-mahal',
    question: 'Who commissioned the construction of the Taj Mahal?',
    options: ['Akbar', 'Shah Jahan', 'Aurangzeb', 'Jahangir'],
    correctAnswer: 1
  },
  {
    id: 'q2',
    monumentId: 'taj-mahal',
    question: 'How many years did it take to complete the Taj Mahal?',
    options: ['15 years', '20 years', '22 years', '25 years'],
    correctAnswer: 2
  },
  {
    id: 'q3',
    monumentId: 'taj-mahal',
    question: 'What material is the Taj Mahal primarily made of?',
    options: ['Red Sandstone', 'White Marble', 'Granite', 'Limestone'],
    correctAnswer: 1
  },
  {
    id: 'q4',
    monumentId: 'red-fort',
    question: 'In which year was the Red Fort constructed?',
    options: ['1639', '1650', '1700', '1800'],
    correctAnswer: 0
  },
  {
    id: 'q5',
    monumentId: 'red-fort',
    question: 'What was the original name of the city where Red Fort is located?',
    options: ['Delhi', 'Shahjahanabad', 'Indraprastha', 'Purana Qila'],
    correctAnswer: 1
  },
  {
    id: 'q6',
    monumentId: 'gateway-of-india',
    question: 'The Gateway of India was built to commemorate the visit of which British monarch?',
    options: ['Queen Victoria', 'King George V', 'King Edward VII', 'Queen Elizabeth I'],
    correctAnswer: 1
  },
  {
    id: 'q7',
    monumentId: 'gateway-of-india',
    question: 'What architectural style is the Gateway of India built in?',
    options: ['Gothic', 'Indo-Saracenic', 'Baroque', 'Neoclassical'],
    correctAnswer: 1
  },
  {
    id: 'q8',
    monumentId: 'qutub-minar',
    question: 'What is the height of Qutub Minar?',
    options: ['63 metres', '73 metres', '83 metres', '93 metres'],
    correctAnswer: 1
  },
  {
    id: 'q9',
    monumentId: 'hawa-mahal',
    question: 'What does "Hawa Mahal" translate to in English?',
    options: ['Wind Palace', 'Palace of Winds', 'Air Castle', 'Breeze Fort'],
    correctAnswer: 1
  },
  {
    id: 'q10',
    monumentId: 'hawa-mahal',
    question: 'How many windows does Hawa Mahal have?',
    options: ['753', '853', '953', '1053'],
    correctAnswer: 2
  },
  {
    id: 'q11',
    monumentId: 'meenakshi-temple',
    question: 'How many gopurams (towers) does Meenakshi Temple have?',
    options: ['10', '12', '14', '16'],
    correctAnswer: 2
  },
  {
    id: 'q12',
    monumentId: 'charminar',
    question: 'What does "Charminar" mean in Urdu?',
    options: ['Four Towers', 'Four Minarets', 'Four Gates', 'Four Pillars'],
    correctAnswer: 1
  },
  {
    id: 'q13',
    monumentId: 'golden-temple',
    question: 'How many people does the Golden Temple serve free meals to daily?',
    options: ['50,000', '75,000', '100,000', '125,000'],
    correctAnswer: 2
  },
  {
    id: 'q14',
    monumentId: 'mysore-palace',
    question: 'How many light bulbs illuminate Mysore Palace on special occasions?',
    options: ['87,000', '92,000', '97,000', '102,000'],
    correctAnswer: 2
  },
  {
    id: 'q15',
    monumentId: 'sun-temple',
    question: 'How many wheels does the Konark Sun Temple chariot have?',
    options: ['12', '18', '24', '30'],
    correctAnswer: 2
  },
  {
    id: 'q16',
    monumentId: 'ellora-caves',
    question: 'How many caves are in the Ellora Caves complex?',
    options: ['30', '32', '34', '36'],
    correctAnswer: 2
  },
  {
    id: 'q17',
    monumentId: 'lotus-temple',
    question: 'How many petals does the Lotus Temple have?',
    options: ['24', '27', '30', '33'],
    correctAnswer: 1
  }
];

const achievementsData = [
  {
    id: 'first-monument',
    name: 'Explorer Beginner',
    description: 'View your first monument in 3D',
    icon: '🏛️',
    requirement: 'view_1_monument'
  },
  {
    id: 'ar-pioneer',
    name: 'AR Pioneer',
    description: 'Experience your first monument in AR',
    icon: '📱',
    requirement: 'ar_1_monument'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Complete a quiz with 100% score',
    icon: '🎓',
    requirement: 'quiz_perfect_score'
  },
  {
    id: 'monument-collector',
    name: 'Monument Collector',
    description: 'Visit all 15 monuments',
    icon: '🗺️',
    requirement: 'view_all_monuments'
  },
  {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Listen to narration for 3 monuments',
    icon: '🎧',
    requirement: 'narration_3_monuments'
  },
  {
    id: 'perfect-scholar',
    name: 'Perfect Scholar',
    description: 'Complete all quizzes with perfect scores',
    icon: '⭐',
    requirement: 'all_quizzes_perfect'
  },
  {
    id: 'social-sharer',
    name: 'Social Butterfly',
    description: 'Share a monument on social media',
    icon: '🦋',
    requirement: 'share_monument'
  },
  {
    id: 'tour-guide',
    name: 'Tour Guide',
    description: 'Complete the virtual tour',
    icon: '🎯',
    requirement: 'complete_tour'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/explorer');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Monument.deleteMany({});
    await QuizQuestion.deleteMany({});
    await Achievement.deleteMany({});

    // Insert monuments
    await Monument.insertMany(monumentsData);
    console.log('Monuments seeded');

    // Insert quiz questions
    await QuizQuestion.insertMany(quizQuestionsData);
    console.log('Quiz questions seeded');

    // Insert achievements
    await Achievement.insertMany(achievementsData);
    console.log('Achievements seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

