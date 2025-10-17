Project File Structure - Bloom Garden
Root Directory Structure
bloom_garden/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
│
├── docs/
│   ├── design/
│   │   ├── prd.md
│   │   ├── system_design.md
│   │   ├── architect.plantuml
│   │   ├── class_diagram.plantuml
│   │   ├── sequence_diagram.plantuml
│   │   ├── er_diagram.plantuml
│   │   └── ui_navigation.plantuml
│   ├── api/
│   │   └── endpoints.md
│   └── deployment/
│       └── setup.md
│
├── public/
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── manifest.json
│   ├── images/
│   │   ├── plants/
│   │   │   ├── sunflower/
│   │   │   ├── cactus/
│   │   │   ├── fern/
│   │   │   ├── rose/
│   │   │   └── bamboo/
│   │   ├── panda/
│   │   │   ├── idle.svg
│   │   │   ├── nod.svg
│   │   │   ├── look-away.svg
│   │   │   ├── shake.svg
│   │   │   └── dance.svg
│   │   ├── backgrounds/
│   │   │   ├── leaves-pattern.svg
│   │   │   └── gradient-bg.svg
│   │   └── achievements/
│   └── sounds/
│       ├── plant-growth.mp3
│       ├── achievement.mp3
│       └── notification.mp3
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── wellness/
│   │   │   ├── mood/
│   │   │   │   └── page.tsx
│   │   │   ├── journal/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── habits/
│   │   │   │   └── page.tsx
│   │   │   ├── mindfulness/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── community/
│   │   │   ├── page.tsx
│   │   │   ├── forums/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── posts/
│   │   │   │           └── [postId]/
│   │   │   │               └── page.tsx
│   │   │   ├── circles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [userId]/
│   │   │   │       └── page.tsx
│   │   │   ├── challenges/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── achievements/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── crisis/
│   │   │   └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/
│   │       │   │   └── route.ts
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── verify/
│   │       │       └── route.ts
│   │       ├── users/
│   │       │   ├── [id]/
│   │       │   │   └── route.ts
│   │       │   ├── profile/
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       ├── plants/
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts
│   │       │   │   └── activities/
│   │       │   │       └── route.ts
│   │       │   └── route.ts
│   │       ├── wellness/
│   │       │   ├── mood/
│   │       │   │   └── route.ts
│   │       │   ├── journal/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   └── habits/
│   │       │       ├── route.ts
│   │       │       └── [id]/
│   │       │           ├── route.ts
│   │       │           └── completions/
│   │       │               └── route.ts
│   │       ├── community/
│   │       │   ├── forums/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       ├── route.ts
│   │       │   │       └── posts/
│   │       │   │           ├── route.ts
│   │       │   │           └── [postId]/
│   │       │   │               ├── route.ts
│   │       │   │               └── replies/
│   │       │   │                   └── route.ts
│   │       │   ├── circles/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       ├── route.ts
│   │       │   │       └── members/
│   │       │   │           └── route.ts
│   │       │   ├── messages/
│   │       │   │   ├── route.ts
│   │       │   │   └── [conversationId]/
│   │       │   │       └── route.ts
│   │       │   └── challenges/
│   │       │       ├── route.ts
│   │       │       └── [id]/
│   │       │           ├── route.ts
│   │       │           └── participate/
│   │       │               └── route.ts
│   │       ├── achievements/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── crisis/
│   │       │   ├── alert/
│   │       │   │   └── route.ts
│   │       │   └── resources/
│   │       │       └── route.ts
│   │       ├── moderation/
│   │       │   ├── report/
│   │       │   │   └── route.ts
│   │       │   └── content/
│   │       │       └── route.ts
│   │       └── websocket/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── crisis-button.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── personality-quiz.tsx
│   │   │   ├── panda-mascot.tsx
│   │   │   └── auth-layout.tsx
│   │   │
│   │   ├── plant/
│   │   │   ├── plant-visualization.tsx
│   │   │   ├── plant-stages.tsx
│   │   │   ├── growth-animation.tsx
│   │   │   ├── plant-stats.tsx
│   │   │   ├── celebration-effects.tsx
│   │   │   └── plant-garden.tsx
│   │   │
│   │   ├── wellness/
│   │   │   ├── mood/
│   │   │   │   ├── mood-tracker.tsx
│   │   │   │   ├── mood-emoji-picker.tsx
│   │   │   │   ├── mood-slider.tsx
│   │   │   │   ├── mood-chart.tsx
│   │   │   │   └── mood-trends.tsx
│   │   │   ├── journal/
│   │   │   │   ├── journal-editor.tsx
│   │   │   │   ├── journal-entry.tsx
│   │   │   │   ├── journal-list.tsx
│   │   │   │   ├── voice-recorder.tsx
│   │   │   │   └── ai-insights.tsx
│   │   │   ├── habits/
│   │   │   │   ├── habit-tracker.tsx
│   │   │   │   ├── habit-card.tsx
│   │   │   │   ├── habit-form.tsx
│   │   │   │   ├── streak-counter.tsx
│   │   │   │   └── habit-calendar.tsx
│   │   │   └── mindfulness/
│   │   │       ├── breathing-exercise.tsx
│   │   │       ├── meditation-timer.tsx
│   │   │       ├── relaxation-visuals.tsx
│   │   │       └── exercise-library.tsx
│   │   │
│   │   ├── community/
│   │   │   ├── forums/
│   │   │   │   ├── forum-list.tsx
│   │   │   │   ├── forum-card.tsx
│   │   │   │   ├── post-list.tsx
│   │   │   │   ├── post-card.tsx
│   │   │   │   ├── post-form.tsx
│   │   │   │   ├── reply-form.tsx
│   │   │   │   └── voting-system.tsx
│   │   │   ├── circles/
│   │   │   │   ├── circle-list.tsx
│   │   │   │   ├── circle-card.tsx
│   │   │   │   ├── circle-chat.tsx
│   │   │   │   └── member-list.tsx
│   │   │   ├── messaging/
│   │   │   │   ├── conversation-list.tsx
│   │   │   │   ├── message-thread.tsx
│   │   │   │   ├── message-composer.tsx
│   │   │   │   └── user-search.tsx
│   │   │   ├── challenges/
│   │   │   │   ├── challenge-list.tsx
│   │   │   │   ├── challenge-card.tsx
│   │   │   │   ├── progress-tracker.tsx
│   │   │   │   └── leaderboard.tsx
│   │   │   └── moderation/
│   │   │       ├── report-form.tsx
│   │   │       ├── content-warning.tsx
│   │   │       └── block-user.tsx
│   │   │
│   │   ├── gamification/
│   │   │   ├── achievement-badge.tsx
│   │   │   ├── achievement-gallery.tsx
│   │   │   ├── points-display.tsx
│   │   │   ├── level-progress.tsx
│   │   │   ├── streak-flame.tsx
│   │   │   └── celebration-modal.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard-grid.tsx
│   │   │   ├── quick-mood-check.tsx
│   │   │   ├── today-habits.tsx
│   │   │   ├── community-feed.tsx
│   │   │   ├── progress-stats.tsx
│   │   │   └── welcome-message.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── profile-header.tsx
│   │   │   ├── profile-stats.tsx
│   │   │   ├── privacy-settings.tsx
│   │   │   ├── notification-settings.tsx
│   │   │   └── account-settings.tsx
│   │   │
│   │   ├── crisis/
│   │   │   ├── crisis-resources.tsx
│   │   │   ├── helpline-list.tsx
│   │   │   ├── emergency-chat.tsx
│   │   │   └── safety-plan.tsx
│   │   │
│   │   └── common/
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── confirmation-dialog.tsx
│   │       ├── image-upload.tsx
│   │       ├── date-picker.tsx
│   │       ├── search-bar.tsx
│   │       ├── pagination.tsx
│   │       ├── tooltip.tsx
│   │       └── floating-leaves.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   ├── websocket.ts
│   │   ├── email.ts
│   │   ├── storage.ts
│   │   ├── encryption.ts
│   │   ├── validation.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── api-client.ts
│   │   ├── error-handler.ts
│   │   └── analytics.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-plant.ts
│   │   ├── use-mood.ts
│   │   ├── use-journal.ts
│   │   ├── use-habits.ts
│   │   ├── use-community.ts
│   │   ├── use-websocket.ts
│   │   ├── use-achievements.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-debounce.ts
│   │   ├── use-intersection-observer.ts
│   │   └── use-media-query.ts
│   │
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── plant-store.ts
│   │   ├── wellness-store.ts
│   │   ├── community-store.ts
│   │   ├── ui-store.ts
│   │   ├── notification-store.ts
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── plants.ts
│   │   │   ├── wellness.ts
│   │   │   ├── community.ts
│   │   │   ├── achievements.ts
│   │   │   ├── crisis.ts
│   │   │   └── moderation.ts
│   │   ├── plant-system.ts
│   │   ├── personality-quiz.ts
│   │   ├── mood-analysis.ts
│   │   ├── content-moderation.ts
│   │   ├── crisis-detection.ts
│   │   ├── notification.ts
│   │   ├── analytics.ts
│   │   └── websocket-client.ts
│   │
│   ├── animations/
│   │   ├── plant-growth.ts
│   │   ├── panda-reactions.ts
│   │   ├── page-transitions.ts
│   │   ├── celebration-effects.ts
│   │   ├── floating-elements.ts
│   │   └── micro-interactions.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   └── themes.css
│   │
│   └── middleware.ts
│
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_plants_table.sql
│   │   ├── 003_add_wellness_tables.sql
│   │   ├── 004_add_community_tables.sql
│   │   ├── 005_add_gamification_tables.sql
│   │   └── 006_add_moderation_tables.sql
│   ├── seeds/
│   │   ├── achievements.sql
│   │   ├── forums.sql
│   │   ├── personality_types.sql
│   │   └── crisis_resources.sql
│   └── schema.sql
│
├── tests/
│   ├── __mocks__/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── services/
│   ├── utils/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── onboarding.spec.ts
│   │   ├── wellness.spec.ts
│   │   ├── community.spec.ts
│   │   └── crisis.spec.ts
│   ├── setup.ts
│   └── jest.config.js
│
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   ├── seed-db.ts
│   ├── migrate-db.ts
│   └── generate-types.ts
│
└── .github/
    └── workflows/
        ├── ci.yml
        ├── deploy.yml
        └── security-scan.yml
Key Directory Explanations
/src/app/ - Next.js App Router Structure
Follows Next.js 14 App Router conventions with nested layouts
Route groups like (auth) for shared authentication layout
API routes co-located with their respective features
Dynamic routes for user-specific content
/src/components/ - Component Organization
ui/: Reusable Shadcn-ui components
layout/: Navigation, header, footer components
auth/: Authentication-specific components including panda mascot
plant/: Plant visualization and growth animation components
wellness/: Mood tracking, journaling, habits, mindfulness tools
community/: Forums, circles, messaging, challenges
gamification/: Achievements, points, celebrations
crisis/: Emergency support components
/src/services/ - Business Logic Layer
API service classes for external communication
Plant growth calculation algorithms
Personality quiz logic and scoring
Content moderation and crisis detection services
Real-time WebSocket client management
/src/animations/ - Animation System
Framer Motion animation configurations
Plant growth stage transitions
Panda mascot reaction animations
Celebration effects and micro-interactions
/database/ - Database Management
SQL migration files for schema evolution
Seed data for initial platform setup
Complete schema definition for reference
/tests/ - Testing Infrastructure
Unit tests for components and services
Integration tests for API endpoints
End-to-end tests for critical user flows
Mocks for external services and dependencies
This file structure supports a scalable, maintainable codebase with clear separation of concerns, making it easy for multiple developers to work on different features simultaneously while maintaining code quality and consistency.
