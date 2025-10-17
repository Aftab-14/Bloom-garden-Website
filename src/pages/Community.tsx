import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StorageManager, User, Forum, ForumPost, PlantType } from '@/lib/storage'
import { 
  MessageSquare, 
  Users, 
  Heart, 
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Flag,
  Shield,
  Plus,
  Search,
  Filter,
  Clock,
  TrendingUp
} from 'lucide-react'

interface CommunityProps {
  user: User
}

const Community = ({ user }: CommunityProps) => {
  const [activeTab, setActiveTab] = useState('forums')
  const [forums, setForums] = useState<Forum[]>([])
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null)
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = () => {
    const allForums = StorageManager.getForums()
    setForums(allForums)
    
    if (allForums.length > 0 && !selectedForum) {
      setSelectedForum(allForums[0])
      loadForumPosts(allForums[0].id)
    }
  }

  const loadForumPosts = (forumId: string) => {
    const posts = StorageManager.getForumPosts(forumId)
    setForumPosts(posts)
  }

  const handleForumSelect = (forum: Forum) => {
    setSelectedForum(forum)
    loadForumPosts(forum.id)
    setSelectedPost(null)
  }

  const handleCreatePost = () => {
    if (!selectedForum || !newPostTitle.trim() || !newPostContent.trim()) return

    const post = StorageManager.addForumPost({
      forumId: selectedForum.id,
      userId: user.id,
      authorName: `Anonymous ${user.personalityType.charAt(0).toUpperCase() + user.personalityType.slice(1)} Guardian`,
      authorPlant: user.personalityType,
      title: newPostTitle,
      content: newPostContent,
      upvotes: 0,
      downvotes: 0,
      replyCount: 0,
      viewCount: 0,
      threadDepth: 0
    })

    setForumPosts([post, ...forumPosts])
    setNewPostTitle('')
    setNewPostContent('')
  }

  const handleReply = (parentPost: ForumPost) => {
    if (!replyContent.trim()) return

    const reply = StorageManager.addForumPost({
      forumId: selectedForum!.id,
      userId: user.id,
      authorName: `Anonymous ${user.personalityType.charAt(0).toUpperCase() + user.personalityType.slice(1)} Guardian`,
      authorPlant: user.personalityType,
      title: '',
      content: replyContent,
      upvotes: 0,
      downvotes: 0,
      replyCount: 0,
      viewCount: 0,
      parentPostId: parentPost.id,
      threadDepth: parentPost.threadDepth + 1
    })

    // Update reply count
    const updatedPosts = forumPosts.map(post => 
      post.id === parentPost.id 
        ? { ...post, replyCount: post.replyCount + 1 }
        : post
    )
    setForumPosts([reply, ...updatedPosts])
    setReplyContent('')
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

  const getForumIcon = (category: string) => {
    const icons = {
      anxiety: '💙',
      depression: '💜',
      positivity: '🌟',
      sleep: '🌙',
      relationships: '💕',
      general: '💬'
    }
    return icons[category as keyof typeof icons] || '💬'
  }

  const filteredPosts = forumPosts
    .filter(post => 
      post.parentPostId === undefined && // Only show top-level posts
      (searchQuery === '' || 
       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const getReplies = (parentPostId: string) => {
    return forumPosts
      .filter(post => post.parentPostId === parentPostId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
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
            Community Garden 🌱
          </h1>
          <p className="text-gray-600 font-nunito">
            <span className="font-dancing text-xl text-nature-sage">
              "Together we grow stronger"
            </span>
          </p>
        </motion.div>
      </div>

      {/* Community Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-nature-mint/20">
          <TabsTrigger value="forums" className="font-nunito data-[state=active]:bg-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Forums
          </TabsTrigger>
          <TabsTrigger value="circles" className="font-nunito data-[state=active]:bg-white">
            <Users className="w-4 h-4 mr-2" />
            Support Circles
          </TabsTrigger>
          <TabsTrigger value="challenges" className="font-nunito data-[state=active]:bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* Forums */}
        <TabsContent value="forums" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Forum Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-nature-mint/30">
                <CardHeader>
                  <CardTitle className="font-poppins text-nature-forest text-lg">
                    Discussion Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {forums.map((forum) => (
                    <button
                      key={forum.id}
                      onClick={() => handleForumSelect(forum)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedForum?.id === forum.id
                          ? 'bg-nature-mint/20 border border-nature-sage'
                          : 'hover:bg-nature-mint/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getForumIcon(forum.category)}</span>
                        <div className="flex-1">
                          <h4 className="font-nunito font-semibold text-nature-forest">
                            {forum.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-nunito">
                            {forum.memberCount} members
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card className="border-nature-mint/30 mt-4">
                <CardHeader>
                  <CardTitle className="font-poppins text-nature-forest text-sm flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Community Guidelines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-gray-600 font-nunito space-y-2">
                    <li>• Be kind and supportive</li>
                    <li>• Respect privacy and anonymity</li>
                    <li>• No medical advice</li>
                    <li>• Report harmful content</li>
                    <li>• Use content warnings when needed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Forum Content */}
            <div className="lg:col-span-3 space-y-6">
              {selectedForum && (
                <>
                  {/* Forum Header */}
                  <Card className="border-nature-mint/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{getForumIcon(selectedForum.category)}</span>
                          <div>
                            <CardTitle className="font-poppins text-nature-forest">
                              {selectedForum.name}
                            </CardTitle>
                            <CardDescription className="font-nunito">
                              {selectedForum.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-nature-mint/20 text-nature-forest">
                          {selectedForum.memberCount} members
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Search and Filter */}
                  <Card className="border-nature-mint/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-nature-mint/30 focus:border-nature-sage font-nunito"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant={sortBy === 'recent' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSortBy('recent')}
                            className="font-nunito"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Recent
                          </Button>
                          <Button
                            variant={sortBy === 'popular' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSortBy('popular')}
                            className="font-nunito"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Popular
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Create New Post */}
                  <Card className="border-nature-mint/30">
                    <CardHeader>
                      <CardTitle className="font-poppins text-nature-forest text-lg">
                        Share Your Thoughts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="post-title" className="font-nunito text-nature-forest">
                          Title
                        </Label>
                        <Input
                          id="post-title"
                          placeholder="What's on your mind?"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="post-content" className="font-nunito text-nature-forest">
                          Content
                        </Label>
                        <Textarea
                          id="post-content"
                          placeholder="Share your experience, ask for support, or offer encouragement..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          rows={4}
                          className="border-nature-mint/30 focus:border-nature-sage font-nunito resize-none"
                        />
                      </div>

                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPostTitle.trim() || !newPostContent.trim()}
                        className="bg-gradient-to-r from-nature-sage to-nature-mint hover:from-nature-forest hover:to-nature-sage text-white font-nunito"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post Anonymously
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Forum Posts */}
                  <div className="space-y-4">
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="border-nature-mint/30 hover:border-nature-sage/50 transition-colors">
                            <CardContent className="p-6">
                              {/* Post Header */}
                              <div className="flex items-start space-x-4 mb-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-nature-mint/20 text-nature-forest">
                                    {getPlantEmoji(post.authorPlant)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-nunito font-semibold text-nature-forest">
                                      {post.authorName}
                                    </h4>
                                    <span className="text-xs text-gray-500 font-nunito">
                                      {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {post.title && (
                                    <h3 className="text-lg font-poppins font-semibold text-nature-forest mb-2">
                                      {post.title}
                                    </h3>
                                  )}
                                  <p className="text-gray-700 font-nunito leading-relaxed">
                                    {post.content}
                                  </p>
                                </div>
                              </div>

                              {/* Post Actions */}
                              <div className="flex items-center justify-between pt-4 border-t border-nature-mint/20">
                                <div className="flex items-center space-x-4">
                                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm font-nunito">{post.upvotes}</span>
                                  </button>
                                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                                    <ThumbsDown className="w-4 h-4" />
                                    <span className="text-sm font-nunito">{post.downvotes}</span>
                                  </button>
                                  <button 
                                    onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-sm font-nunito">{post.replyCount} replies</span>
                                  </button>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                  <Flag className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Replies Section */}
                              <AnimatePresence>
                                {selectedPost?.id === post.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 space-y-4"
                                  >
                                    {/* Reply Form */}
                                    <div className="bg-nature-mint/5 p-4 rounded-lg">
                                      <Textarea
                                        placeholder="Write a supportive reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={3}
                                        className="border-nature-mint/30 focus:border-nature-sage font-nunito resize-none mb-3"
                                      />
                                      <Button
                                        onClick={() => handleReply(post)}
                                        disabled={!replyContent.trim()}
                                        size="sm"
                                        className="bg-nature-sage hover:bg-nature-forest text-white font-nunito"
                                      >
                                        <Send className="w-3 h-3 mr-2" />
                                        Reply
                                      </Button>
                                    </div>

                                    {/* Existing Replies */}
                                    <div className="space-y-3">
                                      {getReplies(post.id).map((reply) => (
                                        <div key={reply.id} className="flex items-start space-x-3 pl-4 border-l-2 border-nature-mint/30">
                                          <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-nature-mint/20 text-nature-forest text-sm">
                                              {getPlantEmoji(reply.authorPlant)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <h5 className="font-nunito font-medium text-nature-forest text-sm">
                                                {reply.authorName}
                                              </h5>
                                              <span className="text-xs text-gray-500 font-nunito">
                                                {new Date(reply.createdAt).toLocaleDateString()}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-nunito">
                                              {reply.content}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <Card className="border-nature-mint/30">
                        <CardContent className="p-12 text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-poppins text-gray-500 mb-2">
                            No posts yet
                          </h3>
                          <p className="text-gray-400 font-nunito">
                            Be the first to start a conversation in this forum
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Support Circles */}
        <TabsContent value="circles" className="space-y-6">
          <Card className="border-nature-mint/30">
            <CardHeader className="text-center">
              <CardTitle className="font-poppins text-nature-forest text-2xl">
                Support Circles
              </CardTitle>
              <CardDescription className="font-nunito">
                Join small, private groups for deeper connection and support
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-nature-mint" />
              <h3 className="text-lg font-poppins text-nature-forest mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600 font-nunito max-w-md mx-auto">
                Private support circles will allow you to connect with 5-10 people in a safe, 
                moderated environment for ongoing support and friendship.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          <Card className="border-nature-mint/30">
            <CardHeader className="text-center">
              <CardTitle className="font-poppins text-nature-forest text-2xl">
                Community Challenges
              </CardTitle>
              <CardDescription className="font-nunito">
                Participate in wellness challenges and earn badges for kindness
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-nature-rose" />
              <h3 className="text-lg font-poppins text-nature-forest mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600 font-nunito max-w-md mx-auto">
                Join community-wide wellness challenges, support others in their goals, 
                and earn badges for acts of kindness and encouragement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Community
