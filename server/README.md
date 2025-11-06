# Explorer Backend Server

Node.js backend server with Express and MongoDB for the Explorer application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/explorer
NODE_ENV=development
```

3. Seed the database:
```bash
node seed.js
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Monuments
- `GET /api/monuments` - Get all monuments
- `GET /api/monuments/:id` - Get monument by ID

### Quiz
- `GET /api/quiz` - Get all quiz questions
- `GET /api/quiz/monument/:monumentId` - Get quiz questions for a monument

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get achievement by ID

### User Progress
- `GET /api/progress/:userId?` - Get user progress
- `PUT /api/progress/:userId?` - Update user progress
- `POST /api/progress/visited/:userId?` - Add visited monument
- `POST /api/progress/ar/:userId?` - Add AR viewed
- `POST /api/progress/narration/:userId?` - Add narration played
- `POST /api/progress/quiz/:userId?` - Update quiz score
- `POST /api/progress/favorite/:userId?` - Toggle favorite
- `POST /api/progress/achievement/:userId?` - Add achievement

