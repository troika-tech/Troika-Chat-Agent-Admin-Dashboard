# Welcome Card Component

## Overview
A beautiful, animated welcome card component for the user dashboard that displays personalized performance metrics and includes a Lottie animation.

## Features

### 🎨 Visual Design
- **Gradient Background**: Beautiful blue gradient with glassmorphism effects
- **Animated Elements**: Floating decorative elements with smooth animations
- **Responsive Layout**: Adapts to different screen sizes (mobile, tablet, desktop)
- **Modern UI**: Clean, modern design with subtle shadows and borders

### 🎭 Animations
- **Framer Motion**: Smooth entrance animations with staggered timing
- **Interactive Elements**: Hover effects on buttons and stat cards
- **Lottie Animation**: Engaging character animation from LottieFiles
- **Progress Bar**: Animated progress bar that fills up smoothly
- **Floating Elements**: Subtle floating animations for decorative elements

### 📊 Performance Metrics
- **Dynamic Data**: Calculates performance based on actual user data
- **Engagement Percentage**: Shows percentage increase in user engagement
- **Star Performer Progress**: Visual progress bar for performance score
- **Real-time Stats**: Displays messages, users, performance, and growth metrics

### 🎯 Key Components

#### 1. Congratulations Message
- Personalized greeting with user's name
- Animated confetti emoji
- Performance highlight with percentage

#### 2. Star Performer Progress Bar
- Rotating star icon
- Animated progress bar
- Performance score display

#### 3. Action Buttons
- "View Analytics" - Primary action button
- "Check Performance" - Secondary action button
- Hover and tap animations

#### 4. Lottie Animation
- Character animation from LottieFiles
- Smooth scaling entrance animation
- Responsive sizing

#### 5. Bottom Stats Grid
- Four key metrics in a responsive grid
- Hover effects on each stat card
- Color-coded metrics

## Usage

```jsx
import WelcomeCard from '../components/WelcomeCard';

<WelcomeCard 
  userName={company?.name || "User"}
  performanceData={{
    salesIncrease: 76,
    starSellerProgress: 60,
    totalMessages: 1250,
    uniqueUsers: 45
  }}
/>
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `userName` | string | User's name to display in greeting | "User" |
| `performanceData` | object | Performance metrics object | See below |

### performanceData Object

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `salesIncrease` | number | Percentage increase in engagement | 76 |
| `starSellerProgress` | number | Performance score (0-100) | 60 |
| `totalMessages` | number | Total number of messages | 0 |
| `uniqueUsers` | number | Number of unique users | 0 |

## Dependencies

- `@dotlottie/react-player` - Lottie animation player
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `tailwindcss` - Styling framework

## Installation

```bash
npm install @dotlottie/react-player --legacy-peer-deps
```

## Customization

### Colors
The component uses Tailwind CSS classes that can be easily customized:
- Primary blue: `text-blue-600`, `bg-blue-600`
- Success green: `text-green-600`
- Warning orange: `text-orange-600`
- Purple accent: `text-purple-600`

### Animations
All animations are controlled by Framer Motion and can be customized by modifying the `motion` component props.

### Layout
The component is fully responsive and uses CSS Grid and Flexbox for layout. Breakpoints can be adjusted using Tailwind's responsive prefixes.

## Performance

- **Lazy Loading**: Lottie animation loads asynchronously
- **Optimized Animations**: Uses CSS transforms for smooth performance
- **Responsive Images**: Lottie animation scales appropriately
- **Minimal Re-renders**: Efficient state management

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- [ ] Add more animation variants
- [ ] Implement theme switching
- [ ] Add sound effects
- [ ] Create more Lottie animation options
- [ ] Add more performance metrics
- [ ] Implement real-time updates
