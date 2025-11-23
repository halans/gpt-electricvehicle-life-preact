# EV Life Chat

A modern, AI-powered chat application designed to answer all your questions about Electric Vehicles. Built with Antigravity, Preact, Tailwind CSS, and Cloudflare Pages.

## Features

- **AI-Powered Chat**: Uses OpenAI's GPT models to provide accurate and helpful information about EVs.
- **Modern UI**: A sleek, responsive interface built with Tailwind CSS, featuring glassmorphism and smooth animations.
- **Inspiration System**:
  - **Welcome Grid**: Browse categories (General, Charging, Technical, Safety, Other) to get started.
  - **Collapsible Suggestions**: Access inspiration questions anytime via the "Sparkles" button in the input bar.
  - **Smart Pills**: Clickable question pills that wrap naturally for easy selection.
- **Rich Interactions**:
  - **Typewriter Effect**: AI responses appear smoothly with a dynamic typing speed based on length.
  - **Smooth Animations**: Chat bubbles slide and fade in for a natural feel.
  - **Visual Clarity**: Distinct icons for User and Bot to easily follow the conversation.

## Tech Stack

- **Frontend**: [Preact](https://preactjs.com/) (Fast, 3kB React alternative)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [WMR](https://wmr.dev/)
- **Backend/Edge**: [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- **AI**: [OpenAI API](https://platform.openai.com/docs/api-reference) (via Cloudflare AI Gateway)

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/halans/gpt-electricvehicle-life-preact
   cd gpt-electricvehicle-life-preact
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.dev.vars` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   This runs `wrangler pages dev` with `wmr`. Open http://localhost:8788 in your browser.

## Deployment

This project is designed to be deployed on **Cloudflare Pages**.

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository.

2. **Create a Cloudflare Pages Project**:
   - Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - Navigate to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
   - Select your repository.

3. **Configure Build Settings**:
   - **Framework Preset**: None (or custom)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

4. **Environment Variables**:
   - In the Cloudflare Pages dashboard for your project, go to **Settings** > **Environment variables**.
   - Add `OPENAI_API_KEY` with your production API key.
   - **Note**: For production, ensure your API key has usage limits set in the OpenAI dashboard.

5. **Deploy**: Click **Save and Deploy**. Cloudflare will build and deploy your site globally.

## Project Structure

- `/public`: Static assets and frontend code (`Chat.tsx`, `index.tsx`).
- `/functions`: Cloudflare Pages Functions (backend logic).
- `tailwind.config.js`: Tailwind CSS configuration.
- `wmr.config.mjs`: WMR build configuration.
