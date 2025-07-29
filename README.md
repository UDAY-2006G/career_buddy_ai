# CareerBuddy.AI

A comprehensive career guidance web application for high school and college students, featuring AI-powered career advice and personalized recommendations.

## Features

- **Stream Selector Quiz**: Interactive quiz to determine ideal academic streams
- **AI Career Chatbot**: Real-time career advice powered by Google's Gemini AI
- **B.Tech Career Advisor**: Personalized career recommendations for engineering students
- **Career Explorer**: Detailed information about various career paths
- **Responsive Design**: Optimized for all devices and screen sizes

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Application

1. Open `src/App.tsx`
2. Find the line: `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';`
3. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual Gemini API key

**Example:**
```javascript
const GEMINI_API_KEY = 'AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz';
```

### 3. Optional: Environment Variables (Recommended for Production)

For better security, you can use environment variables:

1. Create a `.env` file in the root directory
2. Add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Update the code to use the environment variable:
   ```javascript
   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
   ```

### 4. Run the Application

```bash
npm install
npm run dev
```

## API Key Security

⚠️ **Important Security Notes:**

- Never commit your actual API key to version control
- For production deployments, always use environment variables
- Consider implementing rate limiting and usage monitoring
- The Gemini API has usage quotas - monitor your usage in Google AI Studio

## Features Overview

### AI Chatbot
- Powered by Google's Gemini Pro model
- Provides personalized career advice
- Contextual responses focused on career guidance
- Error handling for API failures

### B.Tech Career Advisor
- AI-generated career recommendations
- Based on engineering branch and interests
- Includes salary ranges, required skills, and career advantages
- Expandable recommendation cards

### Stream Selector Quiz
- 10 comprehensive questions
- Covers Science, Commerce, Arts, and Design streams
- Progress tracking and visual feedback
- Personalized career recommendations based on results

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini Pro API
- **Build Tool**: Vite
- **Deployment**: Netlify

## Troubleshooting

### AI Features Not Working
1. Verify your Gemini API key is correctly configured
2. Check the browser console for error messages
3. Ensure you have internet connectivity
4. Verify your API key has sufficient quota

### Common Issues
- **"API key not configured"**: Replace the placeholder API key with your actual key
- **Network errors**: Check your internet connection and API key validity
- **Quota exceeded**: Monitor your API usage in Google AI Studio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.