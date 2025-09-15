# GPT-Life: AI Personality Coach

A modern web application that leverages artificial intelligence to provide personalized life coaching, habit tracking, and goal management. Built with Next.js and powered by OpenAI's GPT-OSS model, GPT-Life helps users develop positive habits, achieve their goals, and improve their overall well-being through intelligent conversational guidance.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### AI-Powered Coaching
- **Conversational Interface**: Natural language interaction with an AI coach
- **Intelligent Habit Creation**: Describe habits in plain English and let AI structure them
- **Personalized Advice**: Get tailored suggestions for habit improvement and goal achievement
- **Context-Aware Responses**: AI understands your current habits and goals for relevant guidance

### Habit Management
- **Categorized Tracking**: Organize habits across 8 life categories
- **Progress Visualization**: Track completion rates and streak statistics
- **Smart Suggestions**: AI-powered recommendations for habit consistency
- **Flexible Scheduling**: Support for daily, weekly, monthly, and one-time habits

### Goal Management
- **Long-term Planning**: Set and track progress toward personal and professional goals
- **AI-Generated Action Plans**: Get daily schedules based on your goals
- **Progress Monitoring**: Visual progress tracking with percentage completion
- **Timeline Management**: Set realistic timelines for goal achievement

### Analytics Dashboard
- **Performance Metrics**: View habit completion rates and longest streaks
- **Visual Charts**: Interactive pie charts and progress bars
- **Goal Overview**: Quick access to all active goals and their status
- **Trend Analysis**: Track improvement over time

## Technology Stack

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **React 18.3.1** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization library
- **Lucide React** - Icon library

### Backend & AI
- **Next.js Server Actions** - Server-side API handling
- **OpenRouter API** - AI model access
- **OpenAI GPT-OSS-20B** - Large language model
- **TypeScript** - End-to-end type safety

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundling (development)

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout component
│   ├── actions.ts         # Server actions for AI integration
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
│   ├── ChatInterface.tsx  # AI chat interface
│   ├── HabitTracker.tsx   # Habit management
│   ├── GoalManager.tsx    # Goal tracking
│   ├── Dashboard.tsx      # Analytics dashboard
│   └── ui/               # Reusable UI components
├── context/              # React Context providers
│   └── AppContext.tsx    # Global state management
├── lib/                  # Utility libraries
│   ├── gptoss.ts         # AI API integration
│   ├── types.ts          # TypeScript definitions
│   ├── data.ts           # Static data and constants
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
    └── use-toast.ts      # Toast notification hook
```

### State Management
- **React Context API** for global state
- **Local component state** with React hooks
- **Server state** managed through Next.js Server Actions

### AI Integration
- **OpenRouter API** for model access
- **Structured prompts** for consistent AI responses
- **JSON parsing** for habit creation and updates
- **Error handling** with user-friendly fallbacks

## Installation

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- OpenRouter API account and key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gpt-life.git
   cd gpt-life
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your API key**
   Edit `.env.local` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:9002`

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### API Configuration

The application uses OpenRouter API to access the GPT-OSS-20B model. To get started:

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and obtain an API key
3. Add the key to your environment variables

## Usage

### Getting Started

1. **Launch the application** and navigate to the AI Coach tab
2. **Start a conversation** by asking for help or describing a habit you want to create
3. **Add habits** by describing them naturally (e.g., "I want to meditate for 10 minutes every morning")
4. **Track progress** by checking off completed habits in the Habit Tracker
5. **Set goals** in the Goal Manager and get AI-generated daily plans

### Key Features

#### AI Coach
- Ask questions about personal development
- Request habit improvement suggestions
- Get motivation and encouragement
- Describe new habits in natural language

#### Habit Tracker
- View habits organized by category
- Mark habits as complete
- Track streak statistics
- Get AI suggestions for improvement

#### Goal Manager
- Set long-term goals with timelines
- Track progress with visual indicators
- Generate AI-powered daily action plans
- Monitor achievement milestones

## API Integration

### OpenRouter API

The application integrates with OpenRouter API to access the GPT-OSS-20B model:

```typescript
// Example API call structure
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-20b:free",
    messages: [...],
    max_tokens: 500,
    temperature: 0.7
  })
});
```

### Error Handling

The application includes comprehensive error handling:
- API connection failures
- Invalid responses
- Rate limiting
- User-friendly error messages

## Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Development Server

The development server runs on port 9002 with Turbopack for fast hot reloading:

```bash
npm run dev
```

### Code Structure

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Next.js pages in `src/app/`
- **Utilities**: Helper functions in `src/lib/`
- **Types**: TypeScript definitions in `src/lib/types.ts`
- **Context**: Global state in `src/context/`

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Firebase App Hosting

The application is configured for deployment on Firebase App Hosting:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables

Ensure all required environment variables are set in your deployment environment:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `NEXT_PUBLIC_APP_URL`: Your production URL

### Build Configuration

The application uses Next.js static export for optimal performance:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ... other configurations
};
```

## Contributing

We welcome contributions to GPT-Life! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch
5. Make your changes
6. Run tests: `npm run typecheck`
7. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Add proper type definitions
- Include error handling
- Write clear commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the GPT-OSS model
- OpenRouter for API access
- Next.js team for the excellent framework
- ShadCN UI for the component library
- The open-source community for inspiration and tools

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/gpt-life/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
4. Provide your environment details

---

**Built with Next.js, TypeScript, and AI** | **Powered by OpenAI GPT-OSS-20B**
