import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { monuments, quizQuestions, getUserProgress, updateUserProgress, checkAndUnlockAchievements } from '@/lib/monumentData';
import { ArrowLeft, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const monumentId = location.state?.monumentId || monuments[0].id;
  
  const [selectedMonument, setSelectedMonument] = useState(monumentId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const monument = monuments.find(m => m.id === selectedMonument);
  const questions = quizQuestions.filter(q => q.monumentId === selectedMonument);
  const progress = (currentQuestion / questions.length) * 100;

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === questions[index].correctAnswer
      ).length;
      const score = Math.round((correctAnswers / questions.length) * 100);

      // Save score
      const userProgress = getUserProgress();
      userProgress.quizScores[selectedMonument] = score;
      updateUserProgress(userProgress);

      // Check for achievements
      const newAchievements = checkAndUnlockAchievements(userProgress);
      if (newAchievements.length > 0) {
        toast.success('Achievement Unlocked!', {
          description: 'Check your achievements page'
        });
      }

      setShowResult(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl mb-4">Test Your Knowledge</CardTitle>
                <CardDescription className="text-lg">
                  Choose a monument and answer questions to earn achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select a Monument:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {monuments.map((m) => {
                      const userProgress = getUserProgress();
                      const score = userProgress.quizScores[m.id];
                      
                      return (
                        <Card
                          key={m.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedMonument === m.id ? 'ring-2 ring-orange-500' : ''
                          }`}
                          onClick={() => setSelectedMonument(m.id)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-xl">{m.name}</CardTitle>
                              {score !== undefined && (
                                <Badge variant={score === 100 ? 'default' : 'secondary'}>
                                  {score}%
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{m.location}</CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {monument && (
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-lg mb-2">{monument.name}</h4>
                    <p className="text-gray-700 mb-4">{monument.description}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Questions:</strong> {questions.length}
                    </p>
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-2 border-orange-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {score.percentage === 100 ? (
                  <Trophy className="w-20 h-20 text-yellow-500" />
                ) : score.percentage >= 70 ? (
                  <CheckCircle className="w-20 h-20 text-green-500" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-500" />
                )}
              </div>
              <CardTitle className="text-4xl mb-2">Quiz Completed!</CardTitle>
              <CardDescription className="text-xl">
                {monument?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-orange-600 mb-2">
                  {score.percentage}%
                </div>
                <p className="text-lg text-gray-600">
                  {score.correct} out of {score.total} correct
                </p>
              </div>

              {score.percentage === 100 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800 font-semibold">
                    🎉 Perfect Score! You've mastered this monument's history!
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setQuizStarted(false);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setShowResult(false);
                    setSelectedAnswer(null);
                  }}
                >
                  Take Another Quiz
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/achievements')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setQuizStarted(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl">{question.question}</CardTitle>
                <CardDescription className="text-base">
                  Select the correct answer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAnswer === index
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}