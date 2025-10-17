// Local storage management for Bloom Garden
export interface User {
  id: string
  email: string
  username: string
  displayName: string
  createdAt: string
  personalityType: PlantType
  privacyLevel: 'private' | 'moderate' | 'open'
}

export type PlantType = 'sunflower' | 'cactus' | 'fern' | 'rose' | 'bamboo'
export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'thrive'
export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface PlantData {
  id: string
  userId: string
  plantType: PlantType
  currentStage: GrowthStage
  growthPoints: number
  totalGrowthPoints: number
  lastWatered: string
  waterStreak: number
  milestonesAchieved: string[]
  createdAt: string
}

export interface MoodEntry {
  id: string
  userId: string
  moodLevel: MoodLevel
  moodTags: string[]
  energyLevel: number
  anxietyLevel: number
  notes: string
  triggers: string[]
  copingStrategies: string[]
  createdAt: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  contentType: 'text' | 'voice'
  audioUrl?: string
  transcription?: string
  aiInsights?: string[]
  sentimentScore?: number
  isPrivate: boolean
  shareWithCircles: string[]
  createdAt: string
  updatedAt: string
}

export interface Habit {
  id: string
  userId: string
  name: string
  description: string
  category: 'selfcare' | 'exercise' | 'mindfulness' | 'social' | 'creative'
  frequencyType: 'daily' | 'weekly' | 'custom'
  frequencyValue: number
  targetValue: number
  unit: string
  currentStreak: number
  longestStreak: number
  isActive: boolean
  createdAt: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  userId: string
  completedValue: number
  completionDate: string
  notes: string
  createdAt: string
}

export interface ForumPost {
  id: string
  forumId: string
  userId: string
  authorName: string
  authorPlant: PlantType
  title: string
  content: string
  upvotes: number
  downvotes: number
  replyCount: number
  viewCount: number
  parentPostId?: string
  threadDepth: number
  createdAt: string
  updatedAt: string
}

export interface Forum {
  id: string
  name: string
  description: string
  category: 'anxiety' | 'depression' | 'positivity' | 'sleep' | 'relationships' | 'general'
  memberCount: number
  postCount: number
  isActive: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: 'growth' | 'community' | 'wellness' | 'consistency'
  requirements: Record<string, unknown>
  pointsReward: number
  iconUrl: string
  badgeUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  difficultyLevel: number
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  earnedAt: string
  progressData: Record<string, unknown>
  isDisplayed: boolean
}

export interface CrisisResource {
  id: string
  name: string
  type: 'hotline' | 'textline' | 'emergency' | 'professional'
  phoneNumber?: string
  textNumber?: string
  website?: string
  description: string
  availability: string
  location: string
}

// Storage utility functions
export class StorageManager {
  private static getKey(key: string): string {
    return `bloom_garden_${key}`
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return null
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('bloom_garden_'))
        .forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  // User management
  static getCurrentUser(): User | null {
    return this.get<User>('current_user')
  }

  static setCurrentUser(user: User): void {
    this.set('current_user', user)
  }

  static logout(): void {
    this.remove('current_user')
  }

  // Plant system
  static getUserPlant(userId: string): PlantData | null {
    const plants = this.get<PlantData[]>('plants') || []
    return plants.find(plant => plant.userId === userId) || null
  }

  static updatePlantGrowth(userId: string, points: number): PlantData | null {
    const plants = this.get<PlantData[]>('plants') || []
    const plantIndex = plants.findIndex(plant => plant.userId === userId)
    
    if (plantIndex === -1) return null

    const plant = plants[plantIndex]
    plant.growthPoints += points
    plant.totalGrowthPoints += points

    // Calculate growth stage based on points
    const stages: { stage: GrowthStage; threshold: number }[] = [
      { stage: 'seed', threshold: 0 },
      { stage: 'sprout', threshold: 100 },
      { stage: 'bud', threshold: 300 },
      { stage: 'bloom', threshold: 600 },
      { stage: 'thrive', threshold: 1000 }
    ]

    const newStage = stages
      .reverse()
      .find(s => plant.totalGrowthPoints >= s.threshold)?.stage || 'seed'

    const oldStage = plant.currentStage
    plant.currentStage = newStage

    plants[plantIndex] = plant
    this.set('plants', plants)

    // Check for milestone achievements
    if (oldStage !== newStage) {
      this.checkMilestoneAchievements(userId, newStage)
    }

    return plant
  }

  private static checkMilestoneAchievements(userId: string, newStage: GrowthStage): void {
    const achievements = this.get<UserAchievement[]>('user_achievements') || []
    const stageAchievements = {
      sprout: 'first_growth',
      bud: 'budding_progress', 
      bloom: 'full_bloom',
      thrive: 'thriving_garden'
    }

    const achievementId = stageAchievements[newStage as keyof typeof stageAchievements]
    if (achievementId && !achievements.some(a => a.userId === userId && a.achievementId === achievementId)) {
      const newAchievement: UserAchievement = {
        id: `achievement_${Date.now()}`,
        userId,
        achievementId,
        earnedAt: new Date().toISOString(),
        progressData: { stage: newStage },
        isDisplayed: true
      }
      achievements.push(newAchievement)
      this.set('user_achievements', achievements)
    }
  }

  // Mood tracking
  static addMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdAt'>): MoodEntry {
    const moods = this.get<MoodEntry[]>('mood_entries') || []
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    moods.push(newEntry)
    this.set('mood_entries', moods)

    // Award growth points for mood tracking
    this.updatePlantGrowth(entry.userId, 10)

    return newEntry
  }

  static getUserMoodEntries(userId: string, days: number = 30): MoodEntry[] {
    const moods = this.get<MoodEntry[]>('mood_entries') || []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return moods
      .filter(mood => 
        mood.userId === userId && 
        new Date(mood.createdAt) >= cutoffDate
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Journal entries
  static addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const journals = this.get<JournalEntry[]>('journal_entries') || []
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    journals.push(newEntry)
    this.set('journal_entries', journals)

    // Award growth points for journaling
    this.updatePlantGrowth(entry.userId, 15)

    return newEntry
  }

  static getUserJournalEntries(userId: string): JournalEntry[] {
    const journals = this.get<JournalEntry[]>('journal_entries') || []
    return journals
      .filter(journal => journal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Habits
  static addHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Habit {
    const habits = this.get<Habit[]>('habits') || []
    const newHabit: Habit = {
      ...habit,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    habits.push(newHabit)
    this.set('habits', habits)
    return newHabit
  }

  static getUserHabits(userId: string): Habit[] {
    const habits = this.get<Habit[]>('habits') || []
    return habits.filter(habit => habit.userId === userId && habit.isActive)
  }

  static completeHabit(habitId: string, userId: string, value: number = 1, notes: string = ''): void {
    const completions = this.get<HabitCompletion[]>('habit_completions') || []
    const today = new Date().toISOString().split('T')[0]
    
    // Check if already completed today
    const existingCompletion = completions.find(
      c => c.habitId === habitId && c.completionDate === today
    )

    if (!existingCompletion) {
      const newCompletion: HabitCompletion = {
        id: `completion_${Date.now()}`,
        habitId,
        userId,
        completedValue: value,
        completionDate: today,
        notes,
        createdAt: new Date().toISOString()
      }
      completions.push(newCompletion)
      this.set('habit_completions', completions)

      // Update habit streak
      this.updateHabitStreak(habitId)

      // Award growth points for habit completion
      this.updatePlantGrowth(userId, 20)
    }
  }

  private static updateHabitStreak(habitId: string): void {
    const habits = this.get<Habit[]>('habits') || []
    const completions = this.get<HabitCompletion[]>('habit_completions') || []
    
    const habitIndex = habits.findIndex(h => h.id === habitId)
    if (habitIndex === -1) return

    const habit = habits[habitIndex]
    const habitCompletions = completions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    
    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i].completionDate)
      const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        currentStreak++
      } else {
        break
      }
    }

    habit.currentStreak = currentStreak
    habit.longestStreak = Math.max(habit.longestStreak, currentStreak)
    
    habits[habitIndex] = habit
    this.set('habits', habits)
  }

  // Forum and community
  static getForums(): Forum[] {
    return this.get<Forum[]>('forums') || this.getDefaultForums()
  }

  private static getDefaultForums(): Forum[] {
    const defaultForums: Forum[] = [
      {
        id: 'anxiety_support',
        name: 'Anxiety Support',
        description: 'A safe space to discuss anxiety, share coping strategies, and find support.',
        category: 'anxiety',
        memberCount: 1247,
        postCount: 3892,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'positivity_corner',
        name: 'Positivity Corner',
        description: 'Share positive thoughts, gratitude, and uplifting experiences.',
        category: 'positivity',
        memberCount: 2156,
        postCount: 5643,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sleep_wellness',
        name: 'Sleep & Wellness',
        description: 'Discuss sleep hygiene, relaxation techniques, and wellness routines.',
        category: 'sleep',
        memberCount: 892,
        postCount: 2341,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'relationships',
        name: 'Relationships & Social',
        description: 'Navigate relationships, social anxiety, and connection challenges.',
        category: 'relationships',
        memberCount: 1534,
        postCount: 4127,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
    this.set('forums', defaultForums)
    return defaultForums
  }

  static addForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>): ForumPost {
    const posts = this.get<ForumPost[]>('forum_posts') || []
    const newPost: ForumPost = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    posts.push(newPost)
    this.set('forum_posts', posts)

    // Award growth points for community participation
    this.updatePlantGrowth(post.userId, 25)

    return newPost
  }

  static getForumPosts(forumId: string): ForumPost[] {
    const posts = this.get<ForumPost[]>('forum_posts') || []
    return posts
      .filter(post => post.forumId === forumId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Crisis resources
  static getCrisisResources(): CrisisResource[] {
    return this.get<CrisisResource[]>('crisis_resources') || this.getDefaultCrisisResources()
  }

  private static getDefaultCrisisResources(): CrisisResource[] {
    const defaultResources: CrisisResource[] = [
      {
        id: 'suicide_prevention',
        name: 'National Suicide Prevention Lifeline',
        type: 'hotline',
        phoneNumber: '988',
        description: 'Free and confidential emotional support 24/7',
        availability: '24/7',
        location: 'United States'
      },
      {
        id: 'crisis_text',
        name: 'Crisis Text Line',
        type: 'textline',
        textNumber: '741741',
        description: 'Text HOME to 741741 for crisis support',
        availability: '24/7',
        location: 'United States'
      },
      {
        id: 'emergency',
        name: 'Emergency Services',
        type: 'emergency',
        phoneNumber: '911',
        description: 'For immediate life-threatening emergencies',
        availability: '24/7',
        location: 'United States'
      }
    ]
    this.set('crisis_resources', defaultResources)
    return defaultResources
  }

  // Initialize default data
  static initializeDefaultData(): void {
    // Initialize forums if they don't exist
    if (!this.get('forums')) {
      this.getDefaultForums()
    }

    // Initialize crisis resources if they don't exist
    if (!this.get('crisis_resources')) {
      this.getDefaultCrisisResources()
    }

    // Initialize achievements if they don't exist
    if (!this.get('achievements')) {
      this.initializeAchievements()
    }
  }

  private static initializeAchievements(): void {
    const achievements: Achievement[] = [
      {
        id: 'first_growth',
        name: 'First Sprout',
        description: 'Your plant has grown to the sprout stage!',
        category: 'growth',
        requirements: { stage: 'sprout' },
        pointsReward: 50,
        iconUrl: '🌱',
        badgeUrl: '🌱',
        rarity: 'common',
        difficultyLevel: 1
      },
      {
        id: 'budding_progress',
        name: 'Budding Progress',
        description: 'Your plant is budding with potential!',
        category: 'growth',
        requirements: { stage: 'bud' },
        pointsReward: 100,
        iconUrl: '🌿',
        badgeUrl: '🌿',
        rarity: 'common',
        difficultyLevel: 2
      },
      {
        id: 'full_bloom',
        name: 'Full Bloom',
        description: 'Your plant has reached full bloom!',
        category: 'growth',
        requirements: { stage: 'bloom' },
        pointsReward: 200,
        iconUrl: '🌸',
        badgeUrl: '🌸',
        rarity: 'rare',
        difficultyLevel: 3
      },
      {
        id: 'thriving_garden',
        name: 'Thriving Garden',
        description: 'Your plant is thriving in its full glory!',
        category: 'growth',
        requirements: { stage: 'thrive' },
        pointsReward: 500,
        iconUrl: '🌺',
        badgeUrl: '🌺',
        rarity: 'epic',
        difficultyLevel: 4
      }
    ]
    this.set('achievements', achievements)
  }
}

// Initialize default data when the module loads
StorageManager.initializeDefaultData()
