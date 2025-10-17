Product Requirements Document (PRD)
Mental Health Support Website - “Bloom Garden”
1. Project Information
Language: English
Programming Language: Shadcn-ui, TypeScript, Tailwind CSS
Project Name: bloom_garden
Document Version: 1.0
Date: October 9, 2025

Original Requirements Restatement
Create a comprehensive mental health support website featuring:

Gamified plant growth system with personality-based plant assignment
Community forums and peer support features
Personal wellness tools including mood tracking and journaling
Animated login/sign-up with panda mascot
Nature-inspired design with calming aesthetics
Privacy and safety features for vulnerable users
2. Product Definition
2.1 Product Goals
Enhance Mental Wellness Through Gamification: Create an engaging, game-like experience that motivates users to consistently practice self-care and track their mental health progress through a personalized plant growth system.

Foster Supportive Community Connections: Build a safe, anonymous platform where users can connect with peers, share experiences, and receive support through forums, private circles, and expert guidance.

Provide Comprehensive Wellness Tools: Offer a complete suite of evidence-based mental health tools including mood tracking, journaling, mindfulness exercises, and habit building in an intuitive, accessible interface.

2.2 User Stories
As a new user seeking mental health support, I want to complete a personality quiz that assigns me a unique plant companion, so that I feel personally connected to my wellness journey from the start.

As someone struggling with anxiety, I want to join anonymous discussion groups and private support circles, so that I can share my experiences and receive encouragement from others who understand my challenges.

As a user working on daily wellness habits, I want to track my mood, write in a digital journal, and see my virtual plant grow, so that I feel motivated to maintain consistent self-care practices.

As a person in crisis, I want immediate access to crisis support resources and local helplines, so that I can get professional help when I need it most.

As a community member, I want to participate in wellness challenges and earn badges for acts of kindness, so that I can contribute positively to others’ mental health journeys while improving my own.

2.3 Competitive Analysis
Based on market research, the mental health app market is valued at $5.6 billion in 2024 and is expected to grow at 16.3% CAGR. Key competitors include:

BetterHelp

Pros: Large therapist network, professional credibility, insurance integration
Cons: Expensive ($60-90/week), lacks gamification, limited peer support
Headspace

Pros: Excellent meditation content, user-friendly interface, strong brand recognition
Cons: Limited community features, subscription-based, focuses mainly on meditation
Calm

Pros: Diverse content library, sleep stories, celebrity partnerships
Cons: Premium paywall, no peer support, limited personalization
Sanvello (now Ginger)

Pros: Mood tracking, CBT tools, peer support groups
Cons: Clinical interface, limited gamification, complex navigation
Youper

Pros: AI-powered mood tracking, personalized insights, affordable
Cons: Limited community features, basic design, no gamification
Talkspace

Pros: Professional therapy access, text-based communication, insurance coverage
Cons: High cost, no peer support, clinical approach
PTSD Coach

Pros: Evidence-based tools, free access, crisis resources
Cons: Limited scope, government-style interface, no community
2.4 Competitive Quadrant Chart
Community + Engagement Leaders
Engagement Innovators
Traditional Platforms
Community Focused
Bloom Garden
PTSD Coach
Talkspace
Youper
Sanvello
Calm
Headspace
BetterHelp
Low Community Focus
High Community Focus
Low Gamification
High Gamification
“Mental Health Platform Positioning”

3. Technical Specifications
3.1 Requirements Analysis
The mental health support website requires a comprehensive technical architecture supporting:

Frontend: React-based SPA with TypeScript for type safety
Styling: Tailwind CSS with Shadcn-ui components for consistent design
Animations: Framer Motion for smooth plant growth and panda interactions
State Management: Zustand for client-side state management
Authentication: Secure user authentication with privacy controls
Database: Real-time database for community features and user data
Content Moderation: AI-powered content filtering and human moderation
Crisis Support: Integration with crisis helpline APIs
Analytics: Privacy-compliant user behavior tracking
Accessibility: WCAG 2.1 AA compliance for inclusive design
3.2 Requirements Pool
P0 Requirements (Must-Have)
User Authentication & Onboarding

Secure sign-up/login system with email verification
Personality quiz with plant assignment algorithm
Privacy settings and data consent management
Gamified Plant System

Five plant types with unique growth characteristics
Five growth stages with visual progression
Activity-based growth point system
Achievement milestones and celebrations
Core Wellness Tools

Daily mood tracker with emoji/slider interface
Digital journaling with rich text editor
Basic habit tracking functionality
Crisis support button with helpline integration
Community Features

Anonymous forum posting and commenting
Topic-based discussion groups
Basic moderation and reporting system
User blocking and privacy controls
P1 Requirements (Should-Have)
Advanced Community Features

Private support circles (5-10 members)
1-on-1 peer chat matching system
Community challenges with point system
Badge and achievement system
Enhanced Wellness Tools

Voice journaling with transcription
Guided mindfulness exercises
Mood trend visualization graphs
Habit streak tracking and rewards
Personalization Features

Mood-adaptive interface themes
Smart content recommendations
Personalized email check-ins
AI-powered journal insights
P2 Requirements (Nice-to-Have)
Advanced Features

Expert Q&A sessions scheduling
Integration with wearable devices
Offline mode for core features
Multi-language support
Advanced analytics dashboard
Premium Features

Professional therapist matching
Advanced meditation library
Personalized wellness plans
Family/caregiver dashboard access
3.3 UI Design Draft
Layout Structure
Header Navigation

Logo with plant icon
Main navigation: Dashboard, Community, Tools, Profile
Crisis support button (always visible)
User avatar with plant growth indicator
Dashboard Layout

Central plant visualization with growth stage
Quick mood check-in widget
Today’s habits checklist
Community activity feed
Progress statistics cards
Color Palette

Primary: Soft mint green (#A7E6D7)
Secondary: Pastel blue (#B8E0FF)
Accent: Warm cream (#FFF8E7)
Success: Light sage (#C8E6C9)
Warning: Soft peach (#FFE0B2)
Text: Charcoal gray (#2E2E2E)
Typography

Headers: Poppins (rounded, friendly)
Body text: Nunito (readable, warm)
Quotes/inspiration: Dancing Script (handwritten feel)
Animation Behaviors

Plant growth: Smooth scale and opacity transitions
Panda reactions: Micro-interactions for form validation
Page transitions: Gentle fade and slide effects
Floating elements: Subtle movement with CSS transforms
3.4 Open Questions
Data Privacy Compliance: What specific privacy regulations need to be addressed (HIPAA, GDPR, etc.)?

Crisis Intervention Protocol: How should the platform handle users expressing suicidal ideation or self-harm?

Content Moderation Scale: What is the expected user volume for determining moderation resource needs?

Professional Integration: Should the platform integrate with licensed therapists or mental health professionals?

Age Restrictions: What are the minimum age requirements and parental consent processes?

Monetization Strategy: Will the platform be free, freemium, or subscription-based?

Accessibility Requirements: What specific accessibility standards need to be met for users with disabilities?

International Expansion: Are there plans for multi-language support and international crisis resources?

4. User Personas
Primary Persona: “Sarah - The Anxious Achiever”
Age: 28, Marketing Professional
Goals: Manage work stress, build daily wellness habits, connect with others
Pain Points: Overwhelmed by traditional therapy costs, needs flexible support
Tech Comfort: High, uses multiple wellness apps
Motivation: Visual progress tracking, community support
Secondary Persona: “Mike - The Isolated Student”
Age: 22, College Student
Goals: Combat loneliness, develop coping strategies, find peer support
Pain Points: Social anxiety, limited budget, stigma around mental health
Tech Comfort: Very high, prefers digital solutions
Motivation: Gamification, anonymous community interaction
Tertiary Persona: “Lisa - The Overwhelmed Parent”
Age: 35, Working Mother
Goals: Self-care while caring for family, stress management
Pain Points: Limited time, guilt about self-care, need for quick tools
Tech Comfort: Moderate, values simplicity
Motivation: Efficient tools, supportive community, progress tracking
5. Success Metrics
User Engagement
Daily active users (DAU) target: 70% retention after 30 days
Average session duration: 15+ minutes
Plant growth milestones completed: 80% of users reach “Sprout” stage
Community Health
Forum post engagement rate: 60% of posts receive responses
Support circle participation: 85% weekly activity rate
Crisis support utilization: <5% of users, 100% receive resources
Wellness Outcomes
Mood tracking consistency: 70% of users log mood 5+ days/week
Habit completion rate: 60% of set habits completed weekly
User-reported wellness improvement: 75% report positive change after 8 weeks
6. Technical Architecture
Frontend Stack
Framework: Next.js 14 with App Router
Language: TypeScript for type safety
Styling: Tailwind CSS + Shadcn-ui components
Animations: Framer Motion for smooth interactions
State Management: Zustand for global state
Forms: React Hook Form with Zod validation
Backend Requirements
Database: PostgreSQL for relational data, Redis for caching
Authentication: NextAuth.js with multiple providers
API: RESTful API with GraphQL for complex queries
File Storage: Cloud storage for user uploads
Real-time: WebSocket connections for chat features
Security & Privacy
Data Encryption: End-to-end encryption for sensitive data
Privacy Controls: Granular user privacy settings
Content Moderation: AI + human moderation pipeline
Crisis Detection: Keyword monitoring with professional escalation
This PRD provides a comprehensive foundation for developing the Bloom Garden mental health support website, balancing user needs with technical feasibility and market opportunities.
