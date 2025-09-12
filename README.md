# GPT-Life: AI Personality Coach

GPT-Life is a personalized coaching application designed for the OpenAI Open Model Hackathon. It leverages an open-source model to act as a life coach, helping users build better habits, manage goals, and improve their overall well-being through conversational AI.

## Hackathon Submission Details

- **Project Category:** For Humanity
- **Reasoning:** This project is submitted under the "For Humanity" category because its core mission is to provide an accessible and supportive tool for personal development. By helping users cultivate positive habits and a growth mindset, GPT-Life aims to make a tangible, positive impact on their daily lives and long-term happiness.

## Project Description

GPT-Life is a Next.js web application that serves as an AI-powered personality and habit coach. It provides a simple, intuitive, and encouraging environment where users can define their aspirations, create tangible habits, and track their progress over time.

The application is built around three main features:

1.  **AI Coach (Chat):** A conversational interface where users can interact with the AI assistant in natural language. Users can describe habits they want to form (e.g., "I want to run three times a week"), and the AI will parse this request and add the structured habit to the user's list.
2.  **Habit Tracker:** A dashboard where all user-defined habits are displayed, categorized for clarity (e.g., Morning Routine, Health & Wellness). Users can mark habits as complete, track their streaks, and request AI-powered suggestions for how to improve their routines.
3.  **Goal Manager:** A section for defining and tracking long-term goals. The AI can generate a daily action plan based on these goals to help users break down large ambitions into manageable steps.

## How It Works

The application uses an AI model served via an API. The core logic resides in a set of AI flows that are prompted to perform specific tasks:

-   **Habit Creation:** When a user describes a new habit, a system prompt instructs the model to parse the user's text and convert it into a structured JSON object representing the new habit. This object is then added to the user's list.
-   **Method Improvement:** Users can ask the AI for advice on how to better stick to a habit. The model receives the habit's details and is prompted to act as a coach, providing actionable, encouraging suggestions.
-   **Daily Plan Generation:** The AI can take a user's list of long-term goals and generate a realistic, time-specific daily schedule to help them make progress.

## Technical Stack

-   **Framework:** Next.js with React
-   **Language:** TypeScript
-   **AI Model:** openai/gpt-oss-20b via OpenRouter API
-   **Styling:** Tailwind CSS with ShadCN UI components
-   **Deployment:** Firebase App Hosting

## Running the Project

### Prerequisites
- Node.js (v18 or later)
- An API key from OpenRouter AI

### Setup Instructions
1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [project-directory]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your OpenRouter API key:
    ```
    OPENROUTER_API_KEY="your_openrouter_api_key_here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## Submission Links

-   **Demonstration Video:** [Link to your 3-minute video]
-   **Public Code Repository:** [Link to your public GitHub repository]
