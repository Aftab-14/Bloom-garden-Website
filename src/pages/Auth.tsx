import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StorageManager, User, PlantType } from '@/lib/storage'
import { Eye, EyeOff, Sparkles, Leaf } from 'lucide-react'

interface AuthProps {
  onLogin: (user: User) => void
}

interface PersonalityQuestion {
  id: string
  question: string
  options: Array<{
    value: PlantType
    text: string
    plant: string
  }>
}

const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 'energy',
    question: 'How do you recharge after a long day?',
    options: [
      { value: 'sunflower', text: 'Being around friends and family', plant: 'Sunflower' },
      { value: 'cactus', text: 'Quiet time alone with my thoughts', plant: 'Cactus' },
      { value: 'fern', text: 'Reading or learning something new', plant: 'Fern' },
      { value: 'rose', text: 'Creative activities or hobbies', plant: 'Rose' },
      { value: 'bamboo', text: 'Meditation or mindful activities', plant: 'Bamboo' }
    ]
  },
  {
    id: 'challenge',
    question: 'When facing a challenge, you tend to:',
    options: [
      { value: 'sunflower', text: 'Ask friends for advice and support', plant: 'Sunflower' },
      { value: 'cactus', text: 'Push through independently', plant: 'Cactus' },
      { value: 'fern', text: 'Research and analyze all options', plant: 'Fern' },
      { value: 'rose', text: 'Find creative solutions', plant: 'Rose' },
      { value: 'bamboo', text: 'Stay flexible and adapt', plant: 'Bamboo' }
    ]
  },
  {
    id: 'environment',
    question: 'Your ideal environment is:',
    options: [
      { value: 'sunflower', text: 'Bright, social, and energetic', plant: 'Sunflower' },
      { value: 'cactus', text: 'Minimal, organized, and peaceful', plant: 'Cactus' },
      { value: 'fern', text: 'Cozy, quiet, and comfortable', plant: 'Fern' },
      { value: 'rose', text: 'Beautiful, inspiring, and artistic', plant: 'Rose' },
      { value: 'bamboo', text: 'Natural, balanced, and harmonious', plant: 'Bamboo' }
    ]
  }
]

const Auth = ({ onLogin }: AuthProps) => {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<PlantType[]>([])
  const [pandaAnimation, setPandaAnimation] = useState('idle')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Panda animations based on user interactions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pandaAnimation === 'idle') {
        setPandaAnimation('float')
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [pandaAnimation])

  const handleInputFocus = (field: string) => {
    if (field === 'password') {
      setPandaAnimation('lookAway')
    } else {
      setPandaAnimation('nod')
    }
  }

  const handleInputBlur = () => {
    setPandaAnimation('idle')
  }

  const validateForm = (isSignup: boolean = false) => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
      setPandaAnimation('shake')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
      setPandaAnimation('shake')
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      setPandaAnimation('shake')
    } else if (isSignup && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      setPandaAnimation('shake')
    }

    if (isSignup) {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      }
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
        setPandaAnimation('shake')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, create a user or find existing one
      const existingUsers = StorageManager.get<User[]>('users') || []
      const user = existingUsers.find(u => u.email === formData.email)
      
      if (user) {
        setPandaAnimation('dance')
        setTimeout(() => {
          onLogin(user)
        }, 1200)
      } else {
        setErrors({ email: 'User not found. Please sign up first.' })
        setPandaAnimation('shake')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm(true)) return

    setShowQuiz(true)
  }

  const handleQuizAnswer = (answer: PlantType) => {
    const newAnswers = [...quizAnswers, answer]
    setQuizAnswers(newAnswers)

    if (quizStep < personalityQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      // Calculate personality type based on most frequent answer
      const plantCounts = newAnswers.reduce((acc, plant) => {
        acc[plant] = (acc[plant] || 0) + 1
        return acc
      }, {} as Record<PlantType, number>)
      
      const assignedPlant = Object.entries(plantCounts)
        .sort(([,a], [,b]) => b - a)[0][0] as PlantType

      completeSignup(assignedPlant)
    }
  }

  const completeSignup = (plantType: PlantType) => {
    setIsLoading(true)
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: formData.email,
      username: formData.username,
      displayName: formData.displayName,
      createdAt: new Date().toISOString(),
      personalityType: plantType,
      privacyLevel: 'moderate'
    }

    // Save user
    const users = StorageManager.get<User[]>('users') || []
    users.push(newUser)
    StorageManager.set('users', users)

    // Create initial plant
    const plants = StorageManager.get<PlantData[]>('plants') || []
    plants.push({
      id: `plant_${Date.now()}`,
      userId: newUser.id,
      plantType: plantType,
      currentStage: 'seed',
      growthPoints: 0,
      totalGrowthPoints: 0,
      lastWatered: new Date().toISOString(),
      waterStreak: 0,
      milestonesAchieved: [],
      createdAt: new Date().toISOString()
    })
    StorageManager.set('plants', plants)

    setPandaAnimation('dance')
    setTimeout(() => {
      onLogin(newUser)
    }, 1200)
  }

  const getPlantEmoji = (plantType: PlantType) => {
    const emojis = {
      sunflower: '🌻',
      cactus: '🌵',
      fern: '🌿',
      rose: '🌹',
      bamboo: '🎋'
    }
    return emojis[plantType]
  }

  if (showQuiz) {
    const currentQuestion = personalityQuestions[quizStep]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-nature-mint/20 via-nature-sky/20 to-nature-cream/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-nature-mint/30 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mx-auto"
              >
                🌱
              </motion.div>
              <CardTitle className="text-2xl font-poppins text-nature-forest">
                Discover Your Plant Spirit
              </CardTitle>
              <CardDescription className="font-nunito">
                Question {quizStep + 1} of {personalityQuestions.length}
              </CardDescription>
              <div className="w-full bg-nature-mint/20 rounded-full h-2">
                <motion.div
                  className="bg-nature-sage h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((quizStep + 1) / personalityQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-xl font-poppins text-center text-nature-forest">
                {currentQuestion.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuizAnswer(option.value)}
                    className="w-full p-4 text-left bg-white hover:bg-nature-mint/10 border border-nature-mint/30 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getPlantEmoji(option.value)}</span>
                      <div>
                        <p className="font-nunito text-nature-forest group-hover:text-nature-sage transition-colors">
                          {option.text}
                        </p>
                        <p className="text-sm text-gray-500 font-nunito">
                          {option.plant} personality
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-mint/20 via-nature-sky/20 to-nature-cream/20 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            initial={{ 
              x: -100, 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              rotate: 0 
            }}
            animate={{ 
              x: (typeof window !== 'undefined' ? window.innerWidth : 1200) + 100,
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              rotate: 360
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-nature-mint/30 shadow-2xl backdrop-blur-sm bg-white/90">
            <CardHeader className="text-center space-y-4">
              {/* Panda Mascot */}
              <motion.div
                className="text-8xl mx-auto cursor-pointer"
                animate={
                  pandaAnimation === 'nod' ? { rotateY: [0, 15, -15, 0] } :
                  pandaAnimation === 'lookAway' ? { rotateY: 45 } :
                  pandaAnimation === 'shake' ? { rotateX: [0, -10, 10, 0] } :
                  pandaAnimation === 'dance' ? { 
                    scale: [1, 1.1, 1], 
                    rotateZ: [0, 5, -5, 0] 
                  } :
                  pandaAnimation === 'float' ? { y: [0, -10, 0] } :
                  {}
                }
                transition={{ 
                  duration: pandaAnimation === 'float' ? 3 : 0.6,
                  repeat: pandaAnimation === 'float' ? Infinity : 0
                }}
                onAnimationComplete={() => {
                  if (pandaAnimation !== 'float' && pandaAnimation !== 'idle') {
                    setPandaAnimation('idle')
                  }
                }}
              >
                🐼
              </motion.div>
              
              <div className="space-y-2">
                <CardTitle className="text-3xl font-poppins text-nature-forest">
                  Welcome to Bloom Garden
                </CardTitle>
                <CardDescription className="font-nunito text-gray-600">
                  <span className="font-dancing text-lg text-nature-sage">
                    "Let's grow together 🌸"
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-nature-mint/20">
                  <TabsTrigger 
                    value="login" 
                    className="font-nunito data-[state=active]:bg-white data-[state=active]:text-nature-forest"
                  >
                    Welcome Back
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="font-nunito data-[state=active]:bg-white data-[state=active]:text-nature-forest"
                  >
                    Start Growing
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login" className="space-y-4">
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-nunito text-nature-forest">
                          Email
                        </Label>
                        <Input
                          id="email"
                          ref={emailRef}
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => handleInputFocus('email')}
                          onBlur={handleInputBlur}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 font-nunito">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-nunito text-nature-forest">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            ref={passwordRef}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onFocus={() => handleInputFocus('password')}
                            onBlur={handleInputBlur}
                            className="border-nature-mint/30 focus:border-nature-sage font-nunito pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-nature-sage"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500 font-nunito">{errors.password}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Leaf className="w-4 h-4" />
                            <span>Let's Grow! 🌱</span>
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="font-nunito text-nature-forest">
                            Username
                          </Label>
                          <Input
                            id="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            onFocus={() => handleInputFocus('username')}
                            onBlur={handleInputBlur}
                            className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                          />
                          {errors.username && (
                            <p className="text-sm text-red-500 font-nunito">{errors.username}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="font-nunito text-nature-forest">
                            Display Name
                          </Label>
                          <Input
                            id="displayName"
                            placeholder="Your Name"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            onFocus={() => handleInputFocus('displayName')}
                            onBlur={handleInputBlur}
                            className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                          />
                          {errors.displayName && (
                            <p className="text-sm text-red-500 font-nunito">{errors.displayName}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="font-nunito text-nature-forest">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => handleInputFocus('email')}
                          onBlur={handleInputBlur}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 font-nunito">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="font-nunito text-nature-forest">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          onFocus={() => handleInputFocus('password')}
                          onBlur={handleInputBlur}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500 font-nunito">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="font-nunito text-nature-forest">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          onFocus={() => handleInputFocus('password')}
                          onBlur={handleInputBlur}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 font-nunito">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Start Your Journey 🌱</span>
                        </div>
                      </Button>
                    </motion.form>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
