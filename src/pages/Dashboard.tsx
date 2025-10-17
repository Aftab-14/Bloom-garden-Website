import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StorageManager, User, PlantData, GrowthStage, UserAchievement } from '@/lib/storage'
import { 
  Droplets, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Users, 
  Award,
  Sparkles,
  Heart,
  Calendar,
  Zap
} from 'lucide-react'

interface DashboardProps {
  user: User
}

interface TodayStats {
  moodLogged: boolean
  journalWritten: boolean
  habitsCompleted: number
  totalHabits: number
  communityPosts: number
}

const Dashboard = ({ user }: DashboardProps) => {
  const [plant, setPlant] = useState<PlantData | null>(null)
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [todayStats, setTodayStats] = useState<TodayStats>({
    moodLogged: false,
    journalWritten: false,
    habitsCompleted: 0,
    totalHabits: 0,
    communityPosts: 0
  })
  const [celebrationVisible, setCelebrationVisible] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [user.id])

  const loadDashboardData = () => {
    // Load plant data
    const plantData = StorageManager.getUserPlant(user.id)
    setPlant(plantData)

    // Load achievements
    const userAchievements = StorageManager.get<UserAchievement[]>('user_achievements') || []
    setAchievements(userAchievements.filter(a => a.userId === user.id))

    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0]
    
    const moods = StorageManager.getUserMoodEntries(user.id, 1)
    const journals = StorageManager.getUserJournalEntries(user.id)
    const habits = StorageManager.getUserHabits(user.id)
    const completions = StorageManager.get<HabitCompletion[]>('habit_completions') || []
    
    const todayJournals = journals.filter(j => j.createdAt.startsWith(today))
    const todayCompletions = completions.filter(c => 
      c.userId === user.id && c.completionDate === today
    )

    setTodayStats({
      moodLogged: moods.length > 0,
      journalWritten: todayJournals.length > 0,
      habitsCompleted: todayCompletions.length,
      totalHabits: habits.length,
      communityPosts: 0 // Will be calculated from forum posts
    })
  }

  const waterPlant = () => {
    if (!plant) return
    
    const updatedPlant = StorageManager.updatePlantGrowth(user.id, 5)
    if (updatedPlant) {
      setPlant(updatedPlant)
      setCelebrationVisible(true)
      setTimeout(() => setCelebrationVisible(false), 2000)
    }
  }

  const getPlantEmoji = (plantType: string, stage: GrowthStage) => {
    const plants = {
      sunflower: {
        seed: '🌰',
        sprout: '🌱',
        bud: '🌿',
        bloom: '🌻',
        thrive: '🌻✨'
      },
      cactus: {
        seed: '🌰',
        sprout: '🌱',
        bud: '🌿',
        bloom: '🌵',
        thrive: '🌵✨'
      },
      fern: {
        seed: '🌰',
        sprout: '🌱',
        bud: '🌿',
        bloom: '🍃',
        thrive: '🍃✨'
      },
      rose: {
        seed: '🌰',
        sprout: '🌱',
        bud: '🌿',
        bloom: '🌹',
        thrive: '🌹✨'
      },
      bamboo: {
        seed: '🌰',
        sprout: '🌱',
        bud: '🌿',
        bloom: '🎋',
        thrive: '🎋✨'
      }
    }
    return plants[plantType as keyof typeof plants]?.[stage] || '🌱'
  }

  const getGrowthProgress = (stage: GrowthStage, points: number) => {
    const thresholds = {
      seed: { current: 0, next: 100 },
      sprout: { current: 100, next: 300 },
      bud: { current: 300, next: 600 },
      bloom: { current: 600, next: 1000 },
      thrive: { current: 1000, next: 1000 }
    }
    
    const threshold = thresholds[stage]
    if (stage === 'thrive') return 100
    
    const progress = ((points - threshold.current) / (threshold.next - threshold.current)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const getNextMilestone = (stage: GrowthStage) => {
    const milestones = {
      seed: 'Sprout (100 points)',
      sprout: 'Bud (300 points)',
      bud: 'Bloom (600 points)',
      bloom: 'Thrive (1000 points)',
      thrive: 'Fully Grown! 🎉'
    }
    return milestones[stage]
  }

  if (!plant) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl">🌱</div>
        <p className="text-gray-600 font-nunito">Loading your garden...</p>
      </div>
    )
  }

  const completionRate = todayStats.totalHabits > 0 
    ? (todayStats.habitsCompleted / todayStats.totalHabits) * 100 
    : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-poppins font-bold text-nature-forest">
            Welcome back, {user.displayName}! 🌸
          </h1>
          <p className="text-gray-600 font-nunito">
            <span className="font-dancing text-xl text-nature-sage">
              "Every small step helps your garden grow"
            </span>
          </p>
        </motion.div>
      </div>

      {/* Plant Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Card className="border-nature-mint/30 bg-gradient-to-br from-nature-mint/10 to-nature-sky/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-poppins text-nature-forest">
              Your {plant.plantType.charAt(0).toUpperCase() + plant.plantType.slice(1)} Garden
            </CardTitle>
            <CardDescription className="font-nunito">
              Stage: {plant.currentStage.charAt(0).toUpperCase() + plant.currentStage.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Plant Visual */}
            <div className="relative">
              <motion.div
                className="text-8xl mx-auto cursor-pointer"
                animate={{ 
                  scale: celebrationVisible ? [1, 1.2, 1] : 1,
                  rotate: celebrationVisible ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.6 }}
                onClick={waterPlant}
              >
                {getPlantEmoji(plant.plantType, plant.currentStage)}
              </motion.div>
              
              {/* Celebration Effects */}
              {celebrationVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="text-4xl">✨💚✨</div>
                </motion.div>
              )}
            </div>

            {/* Growth Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-nunito text-nature-forest">Growth Progress</span>
                <Badge variant="secondary" className="bg-nature-mint/20 text-nature-forest">
                  {plant.totalGrowthPoints} points
                </Badge>
              </div>
              
              <Progress 
                value={getGrowthProgress(plant.currentStage, plant.totalGrowthPoints)} 
                className="h-3 bg-nature-mint/20"
              />
              
              <p className="text-sm text-gray-600 font-nunito">
                Next milestone: {getNextMilestone(plant.currentStage)}
              </p>
            </div>

            {/* Water Plant Button */}
            <Button
              onClick={waterPlant}
              className="bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Water Plant (+5 points)
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`border-2 transition-colors ${
            todayStats.moodLogged 
              ? 'border-green-200 bg-green-50' 
              : 'border-gray-200 hover:border-nature-mint/50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${
                  todayStats.moodLogged ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    todayStats.moodLogged ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-nunito font-semibold text-nature-forest">
                    Mood Check
                  </h3>
                  <p className="text-sm text-gray-600">
                    {todayStats.moodLogged ? 'Completed ✓' : 'Log your mood'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`border-2 transition-colors ${
            todayStats.journalWritten 
              ? 'border-green-200 bg-green-50' 
              : 'border-gray-200 hover:border-nature-mint/50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${
                  todayStats.journalWritten ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <BookOpen className={`w-6 h-6 ${
                    todayStats.journalWritten ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-nunito font-semibold text-nature-forest">
                    Daily Journal
                  </h3>
                  <p className="text-sm text-gray-600">
                    {todayStats.journalWritten ? 'Completed ✓' : 'Write thoughts'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-gray-200 hover:border-nature-mint/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-nature-mint/20">
                  <Target className="w-6 h-6 text-nature-sage" />
                </div>
                <div>
                  <h3 className="font-nunito font-semibold text-nature-forest">
                    Habits
                  </h3>
                  <p className="text-sm text-gray-600">
                    {todayStats.habitsCompleted}/{todayStats.totalHabits} completed
                  </p>
                  {todayStats.totalHabits > 0 && (
                    <div className="mt-2">
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-gray-200 hover:border-nature-mint/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-nature-sky/20">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-nunito font-semibold text-nature-forest">
                    Community
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect with others
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <Card className="border-nature-mint/30">
        <CardHeader>
          <CardTitle className="font-poppins text-nature-forest">Quick Actions</CardTitle>
          <CardDescription className="font-nunito">
            Take care of your mental wellness and help your plant grow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2 border-nature-mint/30 hover:bg-nature-mint/10"
            >
              <TrendingUp className="w-6 h-6 text-nature-sage" />
              <span className="font-nunito text-sm">Track Mood</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2 border-nature-mint/30 hover:bg-nature-mint/10"
            >
              <BookOpen className="w-6 h-6 text-nature-sage" />
              <span className="font-nunito text-sm">Write Journal</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2 border-nature-mint/30 hover:bg-nature-mint/10"
            >
              <Target className="w-6 h-6 text-nature-sage" />
              <span className="font-nunito text-sm">Check Habits</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2 border-nature-mint/30 hover:bg-nature-mint/10"
            >
              <Users className="w-6 h-6 text-nature-sage" />
              <span className="font-nunito text-sm">Join Community</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card className="border-nature-mint/30">
          <CardHeader>
            <CardTitle className="font-poppins text-nature-forest flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.slice(0, 4).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h4 className="font-nunito font-semibold text-yellow-800">
                      Achievement Unlocked!
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {achievement.achievementId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      <Card className="border-nature-mint/30">
        <CardHeader>
          <CardTitle className="font-poppins text-nature-forest flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>This Week's Growth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-poppins font-bold text-nature-sage">
                {plant.totalGrowthPoints}
              </div>
              <p className="text-sm text-gray-600 font-nunito">Total Growth Points</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-poppins font-bold text-blue-600">
                {plant.waterStreak}
              </div>
              <p className="text-sm text-gray-600 font-nunito">Day Streak</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-poppins font-bold text-purple-600">
                {achievements.length}
              </div>
              <p className="text-sm text-gray-600 font-nunito">Achievements Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="border-nature-mint/30 bg-gradient-to-r from-nature-mint/10 to-nature-sky/10">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-2xl font-dancing text-nature-forest mb-2">
              "Growth begins at the end of your comfort zone"
            </p>
            <p className="text-sm text-gray-600 font-nunito">
              Keep nurturing your mental wellness journey, one day at a time 🌱
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
