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
    description: 'Visit all 5 monuments',
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

