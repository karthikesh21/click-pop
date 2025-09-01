# 🎯 Reaction Speed Game

A fast-paced, browser-based reaction speed game built with React, Tailwind CSS, and Framer Motion. Test your reflexes by clicking targets before time runs out!

## ✨ Features

### 🎮 Core Gameplay
- **Reaction Speed Test**: Click targets before the timer expires
- **Progressive Difficulty**: Each round gets faster and more challenging
- **Score Tracking**: Real-time score display with best score persistence
- **Round System**: Track your progress through increasingly difficult rounds

### 🎨 Visual Experience
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Dynamic Backgrounds**: Animated particle effects and geometric patterns
- **Visual Feedback**: Click sparks, target animations, and progress indicators
- **Responsive Design**: Optimized for both desktop and mobile devices

### 📱 Mobile Optimization
- **Touch-Friendly**: Optimized touch targets and mobile gestures
- **Responsive Layout**: Adapts to all screen sizes
- **Performance Optimized**: Smooth gameplay on mobile devices
- **Touch Events**: Proper touch handling for mobile gameplay

### 🏆 Leaderboard System
- **Local Storage**: Persistent leaderboard using localStorage
- **Score Tracking**: Records scores, reaction times, and accuracy
- **Mock Data**: Pre-populated with sample high scores
- **Real-time Updates**: See your current rank during gameplay

### ⚡ Performance Features
- **Memoized Components**: Optimized rendering with React.memo
- **Debounced Input**: Prevents rapid-fire clicking
- **Efficient Animations**: Hardware-accelerated CSS transforms
- **Memory Management**: Proper cleanup of timers and event listeners

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd speed-react-clash

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Game Controls
- **Click/Tap**: Hit targets to score points
- **Pause Button**: Pause/resume gameplay
- **Leaderboard**: View top scores and your rank
- **Restart**: Start a new game after game over

## 🛠️ Tech Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion + GSAP
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Storage**: localStorage for persistence
- **UI Components**: Custom components with shadcn/ui patterns

## 🎯 Game Mechanics

### Difficulty Scaling
- **Initial Time**: 3 seconds per target
- **Progression**: 100ms decrease per round
- **Minimum Time**: 0.5 seconds (challenging but fair)

### Scoring System
- **Base Score**: 1 point per target hit
- **Reaction Time**: Tracks your click speed
- **Accuracy**: Calculated based on performance
- **Leaderboard**: Top 8 scores saved locally

### Target Behavior
- **Random Positioning**: Targets spawn in different locations
- **Visual Feedback**: Color changes based on time remaining
- **Animation Effects**: Smooth entrance/exit animations
- **Touch Optimization**: Larger touch targets on mobile

## 📱 Mobile Features

### Touch Optimization
- **Minimum Touch Targets**: 44px minimum for accessibility
- **Touch Event Handling**: Proper touch event conversion
- **Mobile Gestures**: Optimized for touch interactions
- **Responsive Layout**: Adapts to all screen orientations

### Performance
- **Reduced Motion**: Respects user's motion preferences
- **Efficient Rendering**: Optimized for mobile GPUs
- **Memory Management**: Proper cleanup for mobile devices
- **Battery Optimization**: Efficient animation loops



### Component Structure
`Game.tsx` — Main game logic and state (corresponds to ReactionGame.jsx)
`Target.tsx` — Clickable target component
`Leaderboard.tsx` — Score leaderboard (could be enhanced/renamed to EnhancedLeaderboard.tsx)
`DotGrid.tsx or ClickSpark.tsx` — Candidates for dynamic/animated background effects (could be refactored as AnimatedBackground.tsx)
`GameHUD.tsx` — (To be created) Score and timer display
`GameOverScreen.tsx` — (To be created) End game interface
Current files in src/components/:
`Game.tsx`
`Target.tsx`
`Leaderboard.tsx`
`DotGrid.tsx`
`ClickSpark.tsx`

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── ClickSpark.tsx
│   ├── DotGrid.tsx
│   ├── Game.tsx
│   ├── Leaderboard.tsx
│   ├── Target.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       └── use-toast.ts
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── utils/        (see: lib/utils.ts)
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── styles/       (see: App.css, index.css)
│   ├── App.css
│   └── index.css
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── main.tsx
└── vite-env.d.ts           
```

### Key Hooks
- `useCallback` for memoized functions
- `useMemo` for expensive calculations
- `useRef` for DOM references and timers
- `useEffect` for side effects and cleanup

### Performance Tips
- Components are memoized to prevent unnecessary re-renders
- Event handlers are debounced to prevent rapid firing
- Animations use hardware acceleration
- Timers are properly cleaned up on unmount

## 🚀 Deployment

### Build Process
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
- No external API keys required
- All data stored locally in localStorage
- Game works offline after initial load

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request



## 🎮 Play Now!

Live URL:- https://click-pops.vercel.app 


```bash
npm run dev
```
