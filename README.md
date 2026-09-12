# Queen

AI-powered photorealistic image generation studio built with React, Vite, TypeScript, and Express.

## Features
- AI image generation with Gemini
- Prompt enhancement
- Multiple aspect ratios
- Multiple image sizes
- Reference image upload
- Modern Arabic/English UI

## Tech Stack
- React
- Vite
- TypeScript
- Express
- Gemini API

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   APP_URL=http://localhost:3000
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

## Production Build
```bash
npm run build
npm start
```

## Notes
- `.env` is ignored by Git for security.
- You need a valid Gemini API key and available quota/billing to generate images.
