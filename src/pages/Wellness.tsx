import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { StorageManager, User, MoodEntry, JournalEntry, Habit, MoodLevel } from '@/lib/storage'
import { 
  Heart, 
  BookOpen, 
  Target, 
  Brain, 
  TrendingUp, 
  Calendar,
  Plus,
  Check,
  Flame,
  Mic,
  MicOff,
  Play,
  Pause,
  Wind
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WellnessProps {
  user: User
}

interface HabitCompletion {
  id: string
  habitId: string
  userId: string
  completedValue: number
  completionDate: string
  notes: string
  createdAt: string
}

const moodEmojis = [
  { level: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  { level: 2, emoji: '😔', label: 'Sad', color: 'text-red-400' },
  { level: 3, emoji: '😐', label: 'Low', color: 'text-orange-400' },
  { level: 4, emoji: '😕', label: 'Down', color: 'text-orange-300' },
  { level: 5, emoji: '😶', label: 'Neutral', color: 'text-gray-400' },
  { level: 6, emoji: '🙂', label: 'Okay', color: 'text-yellow-400' },
  { level: 7, emoji: '😊', label: 'Good', color: 'text-yellow-500' },
  { level: 8, emoji: '😄', label: 'Happy', color: 'text-green-400' },
  { level: 9, emoji: '😁', label: 'Very Happy', color: 'text-green-500' },
  { level: 10, emoji: '🤩', label: 'Excellent', color: 'text-green-600' }
]

const journalPrompts = [
  "What am I grateful for today?",
  "What challenged me today and how did I handle it?",
  "What made me smile today?",
  "What would I like to improve tomorrow?",
  "How am I feeling right now and why?",
  "What positive affirmation do I need to hear today?",
  "What small win can I celebrate today?",
  "What lesson did I learn today?"
]

const mindfulnessExercises = [
  {
    id: 'breathing',
    name: '4-7-8 Breathing',
    description: 'Calm your nervous system with this breathing technique',
    duration: 120,
    instructions: 'Inhale for 4, hold for 7, exhale for 8'
  },
  {
    id: 'body_scan',
    name: 'Body Scan Meditation',
    description: 'Progressive relaxation from head to toe',
    duration: 300,
    instructions: 'Focus on each part of your body, releasing tension'
  },
  {
    id: 'gratitude',
    name: 'Gratitude Practice',
    description: 'Reflect on three things you\'re grateful for',
    duration: 180,
    instructions: 'Think deeply about why you\'re grateful for each item'
  },
  {
    id: 'visualization',
    name: 'Peaceful Place Visualization',
    description: 'Imagine yourself in a calm, safe place',
    duration: 240,
    instructions: 'Use all your senses to create a vivid mental image'
  }
]

const Wellness = ({ user }: WellnessProps) => {
  const [activeTab, setActiveTab] = useState('mood')
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)
  const [moodNotes, setMoodNotes] = useState('')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [exerciseTimer, setExerciseTimer] = useState(0)
  const [isExerciseRunning, setIsExerciseRunning] = useState(false)

  useEffect(() => {
    loadWellnessData()
  }, [user.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isExerciseRunning && activeExercise) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isExerciseRunning, activeExercise])

  const loadWellnessData = () => {
    const moods = StorageManager.getUserMoodEntries(user.id, 30)
    const journals = StorageManager.getUserJournalEntries(user.id)
    const userHabits = StorageManager.getUserHabits(user.id)
    
    setMoodEntries(moods)
    setJournalEntries(journals)
    setHabits(userHabits)
  }

  const handleMoodSubmit = () => {
    if (!selectedMood) return

    const moodEntry = StorageManager.addMoodEntry({
      userId: user.id,
      moodLevel: selectedMood,
      moodTags: [],
      energyLevel: 5,
      anxietyLevel: 3,
      notes: moodNotes,
      triggers: [],
      copingStrategies: []
    })

    setMoodEntries([moodEntry, ...moodEntries])
    setSelectedMood(null)
    setMoodNotes('')
  }

  const handleJournalSubmit = () => {
    if (!journalContent.trim()) return

    const journalEntry = StorageManager.addJournalEntry({
      userId: user.id,
      title: journalTitle || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: journalContent,
      contentType: 'text',
      isPrivate: true,
      shareWithCircles: []
    })

    setJournalEntries([journalEntry, ...journalEntries])
    setJournalTitle('')
    setJournalContent('')
    setSelectedPrompt('')
  }

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return

    const habit = StorageManager.addHabit({
      userId: user.id,
      name: newHabitName,
      description: '',
      category: 'selfcare',
      frequencyType: 'daily',
      frequencyValue: 1,
      targetValue: 1,
      unit: 'times',
      currentStreak: 0,
      longestStreak: 0,
      isActive: true
    })

    setHabits([...habits, habit])
    setNewHabitName('')
  }

  const handleCompleteHabit = (habitId: string) => {
    StorageManager.completeHabit(habitId, user.id, 1, '')
    loadWellnessData()
  }

  const startExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId)
    setExerciseTimer(0)
    setIsExerciseRunning(true)
  }

  const pauseExercise = () => {
    setIsExerciseRunning(!isExerciseRunning)
  }

  const stopExercise = () => {
    setActiveExercise(null)
    setExerciseTimer(0)
    setIsExerciseRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMoodChartData = () => {
    return moodEntries
      .slice(0, 7)
      .reverse()
      .map(entry => ({
        date: new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.moodLevel,
        fullDate: entry.createdAt
      }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-poppins font-bold text-nature-forest">
            Wellness Toolkit 🌿
          </h1>
          <p className="text-gray-600 font-nunito">
            <span className="font-dancing text-xl text-nature-sage">
              "Take care of your mind, body, and spirit"
            </span>
          </p>
        </motion.div>
      </div>

      {/* Wellness Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-nature-mint/20">
          <TabsTrigger value="mood" className="font-nunito data-[state=active]:bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Mood
          </TabsTrigger>
          <TabsTrigger value="journal" className="font-nunito data-[state=active]:bg-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="habits" className="font-nunito data-[state=active]:bg-white">
            <Target className="w-4 h-4 mr-2" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="mindfulness" className="font-nunito data-[state=active]:bg-white">
            <Brain className="w-4 h-4 mr-2" />
            Mindfulness
          </TabsTrigger>
        </TabsList>

        {/* Mood Tracker */}
        <TabsContent value="mood" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Input */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">How are you feeling?</CardTitle>
                <CardDescription className="font-nunito">
                  Select your current mood level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-5 gap-3">
                  {moodEmojis.map((mood) => (
                    <motion.button
                      key={mood.level}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood.level as MoodLevel)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedMood === mood.level
                          ? 'border-nature-sage bg-nature-mint/20'
                          : 'border-gray-200 hover:border-nature-mint/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs font-nunito text-gray-600">{mood.level}</div>
                    </motion.button>
                  ))}
                </div>

                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="text-center p-4 bg-nature-mint/10 rounded-lg">
                      <div className="text-4xl mb-2">
                        {moodEmojis.find(m => m.level === selectedMood)?.emoji}
                      </div>
                      <p className="font-nunito text-nature-forest">
                        {moodEmojis.find(m => m.level === selectedMood)?.label}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood-notes" className="font-nunito text-nature-forest">
                        What's on your mind? (optional)
                      </Label>
                      <Textarea
                        id="mood-notes"
                        placeholder="Share what's contributing to this mood..."
                        value={moodNotes}
                        onChange={(e) => setMoodNotes(e.target.value)}
                        className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                      />
                    </div>

                    <Button
                      onClick={handleMoodSubmit}
                      className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Log Mood
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Mood Chart */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Mood Trends</span>
                </CardTitle>
                <CardDescription className="font-nunito">
                  Your mood patterns over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moodEntries.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={getMoodChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A7F3D0" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <YAxis 
                        domain={[1, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #A7F3D0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500 font-nunito">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Start tracking your mood to see patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Mood Entries */}
          {moodEntries.length > 0 && (
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-nature-mint/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {moodEmojis.find(m => m.level === entry.moodLevel)?.emoji}
                        </div>
                        <div>
                          <p className="font-nunito font-medium text-nature-forest">
                            {moodEmojis.find(m => m.level === entry.moodLevel)?.label}
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 font-nunito">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 font-nunito">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Journal */}
        <TabsContent value="journal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journal Editor */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">Daily Reflection</CardTitle>
                <CardDescription className="font-nunito">
                  Write your thoughts and feelings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Journal Prompts */}
                <div className="space-y-2">
                  <Label className="font-nunito text-nature-forest">Need inspiration?</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {journalPrompts.slice(0, 3).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPrompt(prompt)}
                        className="text-left p-2 text-sm bg-nature-mint/10 hover:bg-nature-mint/20 rounded-lg transition-colors font-nunito text-nature-forest"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal-title" className="font-nunito text-nature-forest">
                    Title (optional)
                  </Label>
                  <Input
                    id="journal-title"
                    placeholder="Give your entry a title..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal-content" className="font-nunito text-nature-forest">
                    Your thoughts
                  </Label>
                  <Textarea
                    id="journal-content"
                    placeholder={selectedPrompt || "What's on your mind today?"}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    rows={8}
                    className="border-nature-mint/30 focus:border-nature-sage font-nunito resize-none"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleJournalSubmit}
                    disabled={!journalContent.trim()}
                    className="flex-1 bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsRecording(!isRecording)}
                    className="border-nature-mint/30 hover:bg-nature-mint/10"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {journalEntries.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {journalEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="p-4 bg-nature-mint/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-nunito font-semibold text-nature-forest">
                            {entry.title}
                          </h4>
                          <span className="text-xs text-gray-500 font-nunito">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-nunito line-clamp-3">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 font-nunito">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Start journaling to track your thoughts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Habits */}
        <TabsContent value="habits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Habit */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">Build New Habit</CardTitle>
                <CardDescription className="font-nunito">
                  Create healthy routines for your wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="habit-name" className="font-nunito text-nature-forest">
                    Habit Name
                  </Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Morning meditation, Drink water, Exercise..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                  />
                </div>

                <Button
                  onClick={handleAddHabit}
                  disabled={!newHabitName.trim()}
                  className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>

                {/* Habit Suggestions */}
                <div className="space-y-2">
                  <Label className="font-nunito text-nature-forest">Suggestions:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      '5-minute meditation',
                      'Drink 8 glasses of water',
                      'Write 3 gratitudes',
                      'Take a 10-minute walk',
                      'Read for 15 minutes'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setNewHabitName(suggestion)}
                        className="text-left p-2 text-sm bg-nature-mint/10 hover:bg-nature-mint/20 rounded-lg transition-colors font-nunito text-nature-forest"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Habits */}
            <Card className="border-nature-mint/30">
              <CardHeader>
                <CardTitle className="font-poppins text-nature-forest">Today's Habits</CardTitle>
                <CardDescription className="font-nunito">
                  Keep your streak going!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {habits.length > 0 ? (
                  <div className="space-y-3">
                    {habits.map((habit) => {
                      const today = new Date().toISOString().split('T')[0]
                      const completions = StorageManager.get<HabitCompletion[]>('habit_completions') || []
                      const isCompletedToday = completions.some(
                        c => c.habitId === habit.id && c.completionDate === today
                      )

                      return (
                        <div key={habit.id} className="flex items-center justify-between p-4 bg-nature-mint/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => !isCompletedToday && handleCompleteHabit(habit.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isCompletedToday
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-nature-mint hover:border-nature-sage'
                              }`}
                            >
                              {isCompletedToday && <Check className="w-4 h-4" />}
                            </button>
                            <div>
                              <h4 className="font-nunito font-semibold text-nature-forest">
                                {habit.name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-gray-600 font-nunito">
                                  {habit.currentStreak} day streak
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {isCompletedToday && (
                            <Badge className="bg-green-100 text-green-800">
                              Completed ✓
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 font-nunito">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Add your first habit to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mindfulness */}
        <TabsContent value="mindfulness" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mindfulnessExercises.map((exercise) => (
              <Card key={exercise.id} className="border-nature-mint/30">
                <CardHeader>
                  <CardTitle className="font-poppins text-nature-forest">
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="font-nunito">
                    {exercise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-nature-mint/20 text-nature-forest">
                      {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
                    </Badge>
                    {activeExercise === exercise.id && (
                      <div className="font-nunito font-semibold text-nature-sage">
                        {formatTime(exerciseTimer)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 font-nunito">
                    {exercise.instructions}
                  </p>

                  {activeExercise === exercise.id ? (
                    <div className="space-y-3">
                      <Progress 
                        value={(exerciseTimer / exercise.duration) * 100} 
                        className="h-2"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={pauseExercise}
                          variant="outline"
                          className="flex-1 border-nature-mint/30"
                        >
                          {isExerciseRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isExerciseRunning ? 'Pause' : 'Resume'}
                        </Button>
                        <Button
                          onClick={stopExercise}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => startExercise(exercise.id)}
                      className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                    >
                      <Wind className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Breathing Animation */}
          {activeExercise === 'breathing' && isExerciseRunning && (
            <Card className="border-nature-mint/30 bg-gradient-to-br from-nature-mint/5 to-nature-sky/5">
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1.3, 1],
                    opacity: [0.7, 1, 1, 0.7]
                  }}
                  transition={{
                    duration: 19, // 4 + 7 + 8 seconds
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-nature-sage to-nature-mint rounded-full flex items-center justify-center"
                >
                  <Wind className="w-12 h-12 text-white" />
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-dancing text-nature-forest">
                    Breathe with the circle
                  </p>
                  <p className="text-gray-600 font-nunito">
                    Inhale for 4 • Hold for 7 • Exhale for 8
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Wellness
