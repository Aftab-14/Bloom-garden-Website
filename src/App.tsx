import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { StorageManager, User } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Heart, 
  Users, 
  BookOpen, 
  LogOut, 
  Shield,
  Menu,
  X
} from 'lucide-react'

// Import pages
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Wellness from './pages/Wellness'
import Community from './pages/Community'

const queryClient = new QueryClient()

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const existingUser = StorageManager.getCurrentUser()
    if (existingUser) {
      setUser(existingUser)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    StorageManager.setCurrentUser(loggedInUser)
  }

  const handleLogout = () => {
    StorageManager.logout()
    setUser(null)
    setCurrentPage('dashboard')
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen }
  ]

  const renderCurrentPage = () => {
    if (!user) return null

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'wellness':
        return <Wellness user={user} />
      case 'community':
        return <Community user={user} />
      case 'resources':
        return <ResourcesPage />
      default:
        return <Dashboard user={user} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-mint/20 via-nature-sky/20 to-nature-cream/20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🌱
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Auth onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-nature-mint/10 via-nature-sky/10 to-nature-cream/10">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-nature-mint/20 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🌱</div>
              <h1 className="text-xl font-poppins font-bold text-nature-forest">
                Bloom Garden
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-nature-forest"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <AnimatePresence>
              {(sidebarOpen || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="fixed lg:relative z-50 w-64 h-screen bg-white/90 backdrop-blur-sm border-r border-nature-mint/20 lg:block"
                >
                  <div className="p-6 space-y-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">🌱</div>
                      <div>
                        <h1 className="text-2xl font-poppins font-bold text-nature-forest">
                          Bloom Garden
                        </h1>
                        <p className="text-sm font-dancing text-nature-sage">
                          Mental wellness companion
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="p-4 bg-gradient-to-r from-nature-mint/10 to-nature-sky/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {user.personalityType === 'sunflower' && '🌻'}
                          {user.personalityType === 'cactus' && '🌵'}
                          {user.personalityType === 'fern' && '🌿'}
                          {user.personalityType === 'rose' && '🌹'}
                          {user.personalityType === 'bamboo' && '🎋'}
                        </div>
                        <div>
                          <p className="font-nunito font-semibold text-nature-forest">
                            {user.displayName}
                          </p>
                          <p className="text-sm text-gray-600 font-nunito">
                            {user.personalityType.charAt(0).toUpperCase() + user.personalityType.slice(1)} Guardian
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentPage(item.id)
                              setSidebarOpen(false)
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors font-nunito ${
                              currentPage === item.id
                                ? 'bg-nature-sage text-white'
                                : 'text-gray-600 hover:bg-nature-mint/10 hover:text-nature-forest'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </nav>

                    {/* Crisis Support Button */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-nunito font-semibold text-red-800">
                          Need immediate help?
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-nunito"
                        onClick={() => window.open('tel:988', '_self')}
                      >
                        Crisis Support: 988
                      </Button>
                    </div>

                    {/* Logout */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 font-nunito"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 min-h-screen">
              <div className="p-4 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderCurrentPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

// Resources Page Component
const ResourcesPage = () => {
  const crisisResources = StorageManager.getCrisisResources()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-poppins font-bold text-nature-forest">
            Mental Health Resources 🛡️
          </h1>
          <p className="text-gray-600 font-nunito">
            <span className="font-dancing text-xl text-nature-sage">
              "You are never alone in this journey"
            </span>
          </p>
        </motion.div>
      </div>

      {/* Crisis Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crisisResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white rounded-lg border border-nature-mint/30 shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {resource.type === 'hotline' && '📞'}
                  {resource.type === 'textline' && '💬'}
                  {resource.type === 'emergency' && '🚨'}
                  {resource.type === 'professional' && '👩‍⚕️'}
                </div>
                <h3 className="font-poppins font-bold text-nature-forest">
                  {resource.name}
                </h3>
              </div>
              
              <p className="text-gray-600 font-nunito text-sm">
                {resource.description}
              </p>
              
              <div className="space-y-2">
                {resource.phoneNumber && (
                  <Button
                    className="w-full bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                    onClick={() => window.open(`tel:${resource.phoneNumber}`, '_self')}
                  >
                    Call: {resource.phoneNumber}
                  </Button>
                )}
                
                {resource.textNumber && (
                  <Button
                    variant="outline"
                    className="w-full border-nature-mint/30 hover:bg-nature-mint/10 font-nunito"
                    onClick={() => window.open(`sms:${resource.textNumber}`, '_self')}
                  >
                    Text: {resource.textNumber}
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 font-nunito">
                Available: {resource.availability}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Self-Care Tips */}
      <div className="bg-white rounded-lg border border-nature-mint/30 p-8">
        <h2 className="text-2xl font-poppins font-bold text-nature-forest mb-6">
          Daily Self-Care Tips 🌿
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold text-nature-sage">
              Immediate Relief
            </h3>
            <ul className="space-y-2 font-nunito text-gray-700">
              <li>• Take 5 deep breaths (4-7-8 technique)</li>
              <li>• Ground yourself: 5 things you see, 4 you hear, 3 you touch</li>
              <li>• Step outside for fresh air</li>
              <li>• Listen to calming music</li>
              <li>• Call a trusted friend or family member</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold text-nature-sage">
              Long-term Wellness
            </h3>
            <ul className="space-y-2 font-nunito text-gray-700">
              <li>• Maintain a regular sleep schedule</li>
              <li>• Practice gratitude daily</li>
              <li>• Stay physically active</li>
              <li>• Connect with supportive people</li>
              <li>• Consider professional therapy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
