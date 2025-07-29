import React, { useState, useEffect, useRef } from 'react';

// Mock Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Mock user ID generator for local development
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

// Career data for different streams
const careerData = {
  Science: [
    {
      name: "Data Scientist",
      description: "Analyze complex data to help businesses make informed decisions",
      icon: "📊",
      responsibilities: ["Data analysis and modeling", "Statistical research", "Machine learning implementation", "Business intelligence reporting"],
      typicalDay: "Start with data exploration, build predictive models, collaborate with teams, present findings",
      growthPath: "Junior Analyst → Data Scientist → Senior Data Scientist → Lead Data Scientist → Chief Data Officer"
    },
    {
      name: "Software Engineer",
      description: "Design and develop software applications and systems",
      icon: "💻",
      responsibilities: ["Code development", "System architecture", "Testing and debugging", "Collaboration with cross-functional teams"],
      typicalDay: "Morning standup, coding sessions, code reviews, debugging, planning meetings",
      growthPath: "Junior Developer → Software Engineer → Senior Engineer → Tech Lead → Engineering Manager"
    },
    {
      name: "Research Scientist",
      description: "Conduct scientific research to advance knowledge in specialized fields",
      icon: "🔬",
      responsibilities: ["Experimental design", "Data collection and analysis", "Research publication", "Grant writing"],
      typicalDay: "Laboratory work, data analysis, literature review, writing research papers",
      growthPath: "Research Assistant → Scientist → Senior Scientist → Principal Scientist → Research Director"
    }
  ],
  Commerce: [
    {
      name: "Financial Analyst",
      description: "Analyze financial data to guide business investment decisions",
      icon: "💰",
      responsibilities: ["Financial modeling", "Market research", "Investment analysis", "Risk assessment"],
      typicalDay: "Market analysis, financial modeling, client meetings, report preparation",
      growthPath: "Analyst → Senior Analyst → Associate → Vice President → Managing Director"
    },
    {
      name: "Marketing Manager",
      description: "Develop and execute marketing strategies to promote products",
      icon: "📈",
      responsibilities: ["Campaign development", "Brand management", "Market analysis", "Team leadership"],
      typicalDay: "Strategy meetings, campaign reviews, client presentations, market research analysis",
      growthPath: "Marketing Coordinator → Marketing Manager → Senior Manager → Marketing Director → CMO"
    },
    {
      name: "Business Consultant",
      description: "Advise organizations on improving business performance",
      icon: "🎯",
      responsibilities: ["Business analysis", "Strategy development", "Process improvement", "Client management"],
      typicalDay: "Client meetings, data analysis, strategy workshops, presentation development",
      growthPath: "Associate → Consultant → Senior Consultant → Principal → Partner"
    }
  ],
  Arts: [
    {
      name: "Content Creator",
      description: "Create engaging content across various digital platforms",
      icon: "✍️",
      responsibilities: ["Content writing", "Social media management", "Creative strategy", "Audience engagement"],
      typicalDay: "Content brainstorming, writing sessions, social media posting, analytics review",
      growthPath: "Content Writer → Content Creator → Content Manager → Creative Director → Head of Content"
    },
    {
      name: "UX Designer",
      description: "Design user-friendly interfaces and experiences for digital products",
      icon: "🎨",
      responsibilities: ["User research", "Wireframing", "Prototyping", "Usability testing"],
      typicalDay: "User interviews, design iterations, stakeholder reviews, prototype testing",
      growthPath: "Junior Designer → UX Designer → Senior Designer → Design Lead → Design Director"
    },
    {
      name: "Journalist",
      description: "Research, write, and report news stories across various media",
      icon: "📰",
      responsibilities: ["News reporting", "Interview conducting", "Story writing", "Fact-checking"],
      typicalDay: "Source interviews, research, writing articles, editing, meeting deadlines",
      growthPath: "Reporter → Senior Reporter → Editor → Managing Editor → Editor-in-Chief"
    }
  ],
  Design: [
    {
      name: "Graphic Designer",
      description: "Create visual concepts to communicate ideas that inspire and inform",
      icon: "🎨",
      responsibilities: ["Visual design", "Brand development", "Layout design", "Client collaboration"],
      typicalDay: "Design conceptualization, client feedback sessions, design iterations, final deliverables",
      growthPath: "Junior Designer → Graphic Designer → Senior Designer → Art Director → Creative Director"
    },
    {
      name: "Product Designer",
      description: "Design and improve product experiences from concept to launch",
      icon: "📱",
      responsibilities: ["Product strategy", "User research", "Interface design", "Prototype testing"],
      typicalDay: "User research, design sprints, prototype development, stakeholder alignment",
      growthPath: "Junior Designer → Product Designer → Senior Designer → Principal Designer → Head of Design"
    },
    {
      name: "Interior Designer",
      description: "Plan and design interior spaces for residential and commercial use",
      icon: "🏠",
      responsibilities: ["Space planning", "Material selection", "Client consultation", "Project management"],
      typicalDay: "Client meetings, space planning, material research, site visits, design presentations",
      growthPath: "Design Assistant → Interior Designer → Senior Designer → Design Manager → Principal Designer"
    }
  ]
};

// Quiz questions data
const quizQuestions = [
  {
    question: "What type of activities do you enjoy most?",
    options: [
      { text: "Conducting experiments and research", stream: "Science", emoji: "🔬" },
      { text: "Analyzing market trends and data", stream: "Commerce", emoji: "📈" },
      { text: "Writing stories and creative content", stream: "Arts", emoji: "✍️" },
      { text: "Creating visual designs and layouts", stream: "Design", emoji: "🎨" }
    ]
  },
  {
    question: "Which subject interests you the most?",
    options: [
      { text: "Mathematics and Physics", stream: "Science", emoji: "🔢" },
      { text: "Economics and Business Studies", stream: "Commerce", emoji: "💼" },
      { text: "Literature and History", stream: "Arts", emoji: "📚" },
      { text: "Art and Computer Graphics", stream: "Design", emoji: "🖥️" }
    ]
  },
  {
    question: "What motivates you most in your work?",
    options: [
      { text: "Discovering new knowledge", stream: "Science", emoji: "🧪" },
      { text: "Making profitable decisions", stream: "Commerce", emoji: "💰" },
      { text: "Expressing creativity", stream: "Arts", emoji: "🎭" },
      { text: "Creating beautiful things", stream: "Design", emoji: "✨" }
    ]
  },
  {
    question: "How do you prefer to solve problems?",
    options: [
      { text: "Using logical analysis and data", stream: "Science", emoji: "📊" },
      { text: "Considering financial implications", stream: "Commerce", emoji: "💹" },
      { text: "Through creative thinking", stream: "Arts", emoji: "💡" },
      { text: "With visual solutions", stream: "Design", emoji: "🎯" }
    ]
  },
  {
    question: "What work environment appeals to you?",
    options: [
      { text: "Laboratory or research facility", stream: "Science", emoji: "🏢" },
      { text: "Corporate office or financial district", stream: "Commerce", emoji: "🏙️" },
      { text: "Creative studio or newsroom", stream: "Arts", emoji: "📺" },
      { text: "Design studio or workshop", stream: "Design", emoji: "🛠️" }
    ]
  },
  {
    question: "Which skill would you like to develop further?",
    options: [
      { text: "Advanced analytical thinking", stream: "Science", emoji: "🧠" },
      { text: "Strategic business planning", stream: "Commerce", emoji: "📋" },
      { text: "Storytelling and communication", stream: "Arts", emoji: "🗣️" },
      { text: "Visual communication", stream: "Design", emoji: "👁️" }
    ]
  },
  {
    question: "What type of projects excite you most?",
    options: [
      { text: "Research and development", stream: "Science", emoji: "🚀" },
      { text: "Business growth initiatives", stream: "Commerce", emoji: "📈" },
      { text: "Content and media creation", stream: "Arts", emoji: "🎬" },
      { text: "Design and aesthetics", stream: "Design", emoji: "🎨" }
    ]
  },
  {
    question: "How do you measure success?",
    options: [
      { text: "Scientific breakthroughs", stream: "Science", emoji: "🏆" },
      { text: "Financial achievements", stream: "Commerce", emoji: "💵" },
      { text: "Creative recognition", stream: "Arts", emoji: "🌟" },
      { text: "Design impact", stream: "Design", emoji: "💎" }
    ]
  },
  {
    question: "What type of challenges do you enjoy?",
    options: [
      { text: "Complex technical problems", stream: "Science", emoji: "⚙️" },
      { text: "Market and financial puzzles", stream: "Commerce", emoji: "🧩" },
      { text: "Creative and artistic challenges", stream: "Arts", emoji: "🎪" },
      { text: "Visual and aesthetic problems", stream: "Design", emoji: "🎯" }
    ]
  },
  {
    question: "Which tools would you prefer to work with?",
    options: [
      { text: "Scientific instruments and software", stream: "Science", emoji: "🔬" },
      { text: "Financial analysis tools", stream: "Commerce", emoji: "📊" },
      { text: "Writing and media tools", stream: "Arts", emoji: "📝" },
      { text: "Design software and creative tools", stream: "Design", emoji: "🖌️" }
    ]
  }
];

// Mock B.Tech recommendations
const mockBtechRecommendations = [
  {
    role: "Full Stack Developer",
    pros: ["High demand", "Creative problem solving", "Good salary potential", "Remote work opportunities"],
    skills: ["JavaScript", "React", "Node.js", "Database management", "Problem solving"],
    salaryRange: "₹6-15 LPA"
  },
  {
    role: "Data Engineer",
    pros: ["Growing field", "Big data expertise", "Excellent career growth", "Cross-industry opportunities"],
    skills: ["Python", "SQL", "Apache Spark", "Cloud platforms", "Data modeling"],
    salaryRange: "₹8-20 LPA"
  },
  {
    role: "DevOps Engineer",
    pros: ["High growth potential", "Modern tech stack", "Automation focus", "Critical role in companies"],
    skills: ["Docker", "Kubernetes", "CI/CD", "Cloud services", "Linux", "Infrastructure as Code"],
    salaryRange: "₹7-18 LPA"
  }
];

function App() {
  // Core application state
  const [activeFeature, setActiveFeature] = useState('home');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Quiz state management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScores, setQuizScores] = useState({ Science: 0, Commerce: 0, Arts: 0, Design: 0 });
  const [recommendedStream, setRecommendedStream] = useState('');

  // Modal and UI state
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'Hi there! I\'m your AI career advisor. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // B.Tech Advisor state
  const [btechBranch, setBtechBranch] = useState('');
  const [btechInterests, setBtechInterests] = useState('');
  const [btechRecommendations, setBtechRecommendations] = useState([]);
  const [isLoadingBtech, setIsLoadingBtech] = useState(false);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  // Initialize Firebase and authentication on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Mock Firebase initialization - replace with actual Firebase setup
        const mockUserId = generateUserId();
        setUserId(mockUserId);
        setIsAuthenticated(true);
        
        // In a real app, you would initialize Firebase here:
        // const app = initializeApp(firebaseConfig);
        // const auth = getAuth(app);
        // onAuthStateChanged(auth, (user) => {
        //   if (user) {
        //     setUserId(user.uid);
        //     setIsAuthenticated(true);
        //   }
        // });
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Fallback to anonymous user
        const fallbackUserId = generateUserId();
        setUserId(fallbackUserId);
        setIsAuthenticated(true);
      }
    };

    initializeApp();
  }, []);

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Quiz Functions
  const handleQuizAnswer = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    // Update scores based on selected option
    const newScores = { ...quizScores };
    newScores[selectedOption.stream] += 1;
    setQuizScores(newScores);

    // Add answer to answers array
    const newAnswers = [...quizAnswers, selectedOption];
    setQuizAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed - determine recommended stream
      const maxScore = Math.max(...Object.values(newScores));
      const recommended = Object.keys(newScores).find(stream => newScores[stream] === maxScore);
      setRecommendedStream(recommended);
      setActiveFeature('recommender');
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setSelectedOption(null);
    setQuizScores({ Science: 0, Commerce: 0, Arts: 0, Design: 0 });
    setRecommendedStream('');
  };

  // Career Modal Functions
  const openCareerModal = (career) => {
    setSelectedCareer(career);
    setShowCareerModal(true);
  };

  const closeCareerModal = () => {
    setShowCareerModal(false);
    setSelectedCareer(null);
  };

  // Chatbot Functions
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Create a career-focused prompt
      const careerPrompt = `You are CareerBuddy.AI, a helpful career advisor for high school and college students. 
      Please provide personalized, practical career guidance. Keep responses concise but informative.
      
      User question: ${chatInput.trim()}
      
      Please respond with helpful career advice, educational guidance, or information about career paths. 
      If the question is not career-related, gently redirect to career topics while still being helpful.`;

      const result = await model.generateContent(careerPrompt);
      const response = await result.response;
      const aiResponseText = response.text();

      const aiResponse = {
        type: 'ai',
        content: aiResponseText
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorResponse = {
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to my AI services right now. Please check that your API key is configured correctly, or try again in a moment. In the meantime, feel free to explore the other features!"
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // B.Tech Advisor Functions
  const handleGetBtechRecommendations = () => {
    if (!btechBranch.trim() || !btechInterests.trim()) return;

    setIsLoadingBtech(true);
    
    // Generate AI-powered recommendations
    generateBtechRecommendations();
  };

  const generateBtechRecommendations = async () => {
    try {
      const prompt = `You are a career advisor specializing in B.Tech career guidance. 
      Based on the following information, provide 3 specific career recommendations:
      
      B.Tech Branch: ${btechBranch}
      Interests: ${btechInterests}
      
      For each recommendation, provide:
      1. Role name
      2. 4 key advantages/pros
      3. 5 essential skills needed
      4. Salary range in Indian market (₹X-Y LPA format)
      
      Format your response as a JSON array with this structure:
      [
        {
          "role": "Role Name",
          "pros": ["advantage1", "advantage2", "advantage3", "advantage4"],
          "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
          "salaryRange": "₹X-Y LPA"
        }
      ]
      
      Make sure the recommendations are specific to the branch and interests provided.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = response.text();
      
      try {
        // Try to parse the JSON response
        const cleanedResponse = aiResponseText.replace(/```json\n?|\n?```/g, '').trim();
        const recommendations = JSON.parse(cleanedResponse);
        setBtechRecommendations(recommendations);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // Fallback to mock data if parsing fails
        setBtechRecommendations(mockBtechRecommendations);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to mock data on API error
      setBtechRecommendations(mockBtechRecommendations);
    } finally {
      setIsLoadingBtech(false);
    }
  };

  const toggleRecommendationExpansion = (index) => {
    setExpandedRecommendation(expandedRecommendation === index ? null : index);
  };

  // Progress calculation for quiz
  const quizProgress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  // Render Functions
  const renderNavigation = () => (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setActiveFeature('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CareerBuddy.AI
            </h1>
          </div>
          
          <div className="flex space-x-1 sm:space-x-4">
            {[
              { key: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { key: 'quiz', label: 'Stream Quiz', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { key: 'chatbot', label: 'AI Chatbot', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
              { key: 'btech-advisor', label: 'B.Tech Advisor', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveFeature(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeFeature === key
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-animated-home flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            CareerBuddy.AI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 font-light">
            Your personalized guide to a bright future!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveFeature('quiz')}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Your Career Journey</h3>
            <p className="text-gray-600 text-sm">Take our stream selector quiz to discover your ideal career path</p>
          </button>

          <button
            onClick={() => setActiveFeature('chatbot')}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ask AI Chatbot</h3>
            <p className="text-gray-600 text-sm">Get instant answers to your career-related questions</p>
          </button>

          <button
            onClick={() => setActiveFeature('btech-advisor')}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">B.Tech Career Advisor</h3>
            <p className="text-gray-600 text-sm">Get personalized career recommendations for engineering students</p>
          </button>
        </div>

        <button
          disabled
          className="bg-gray-200 text-gray-500 px-8 py-3 rounded-xl font-medium cursor-not-allowed mb-8"
        >
          More Features Coming Soon! 🚀
        </button>

        <div className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-3 inline-block">
          User ID: {userId}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="min-h-screen bg-gradient-animated-quiz p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(quizProgress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {quizQuestions[currentQuestion].question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuizAnswer(option)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                  selectedOption === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium text-gray-800">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Button */}
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedOption}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              selectedOption
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderRecommender = () => (
    <div className="min-h-screen bg-gradient-animated-recommender p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Great Choice!</h1>
          <p className="text-xl text-gray-600 mb-4">Your Recommended Stream:</p>
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-2xl">
            {recommendedStream}
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {careerData[recommendedStream]?.map((career, index) => (
            <div key={index} className="career-card-container">
              <div className="career-card">
                <div className="career-card-front">
                  <div className="text-4xl mb-4">{career.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{career.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{career.description}</p>
                </div>
                <div className="career-card-back">
                  <div className="text-2xl mb-4">{career.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{career.name}</h3>
                  <p className="text-white/90 text-sm mb-4">Quick Look</p>
                  <button
                    onClick={() => openCareerModal(career)}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors duration-200"
                  >
                    Explore More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => {
              resetQuiz();
              setActiveFeature('quiz');
            }}
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-8 py-3 rounded-xl font-medium hover:bg-white transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );

  const renderChatbot = () => (
    <div className="min-h-screen bg-gradient-animated-chatbot p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col pt-8 pb-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Chatbot</h1>
          <p className="text-gray-600">Ask me anything about careers and education!</p>
          <p className="text-sm text-gray-500 mt-2">
            {GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' 
              ? '⚠️ Please configure your Gemini API key to enable AI features'
              : '🤖 AI-powered career guidance is active!'
            }
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your career question here..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                chatInput.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBtechAdvisor = () => (
    <div className="min-h-screen bg-gradient-animated-btech p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">B.Tech Career Advisor</h1>
          <p className="text-gray-600 mb-2">Get personalized career recommendations based on your engineering background</p>
          <p className="text-sm text-gray-500">
            {GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' 
              ? '⚠️ Please configure your Gemini API key for AI-powered recommendations'
              : '🤖 AI-powered recommendations are active!'
            }
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your B.Tech Branch
              </label>
              <input
                type="text"
                value={btechBranch}
                onChange={(e) => setBtechBranch(e.target.value)}
                placeholder="e.g., Computer Science, Electronics, Mechanical"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Interests
              </label>
              <input
                type="text"
                value={btechInterests}
                onChange={(e) => setBtechInterests(e.target.value)}
                placeholder="e.g., Web Development, AI/ML, Mobile Apps"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleGetBtechRecommendations}
              disabled={!btechBranch.trim() || !btechInterests.trim() || isLoadingBtech}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                btechBranch.trim() && btechInterests.trim() && !isLoadingBtech
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoadingBtech ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {btechRecommendations.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Recommendations</h2>
            <div className="space-y-4">
              {btechRecommendations.map((recommendation, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleRecommendationExpansion(index)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{recommendation.role}</h3>
                      <p className="text-gray-600">{recommendation.salaryRange}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedRecommendation === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedRecommendation === index && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Pros</h4>
                          <ul className="space-y-1">
                            {recommendation.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="text-gray-600 text-sm flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCareerModal = () => {
    if (!showCareerModal || !selectedCareer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800">{selectedCareer.name}</h2>
            <button
              onClick={closeCareerModal}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedCareer.icon}</div>
              <p className="text-gray-600 text-lg">{selectedCareer.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedCareer.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Typical Day</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{selectedCareer.typicalDay}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Career Growth Path</h3>
                <p className="text-gray-600 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
                  {selectedCareer.growthPath}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Custom CSS for animations and special effects */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .bg-gradient-animated-home {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .bg-gradient-animated-quiz {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .bg-gradient-animated-recommender {
          background: linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #38f9d7);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .bg-gradient-animated-chatbot {
          background: linear-gradient(-45deg, #fa709a, #fee140, #a8edea, #fed6e3);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .bg-gradient-animated-btech {
          background: linear-gradient(-45deg, #ff9a9e, #fecfef, #fecfef, #fecfef);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        /* Career card flip animation */
        .career-card-container {
          perspective: 1000px;
          height: 300px;
        }

        .career-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .career-card-container:hover .career-card {
          transform: rotateY(180deg);
        }

        .career-card-front,
        .career-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .career-card-front {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }

        .career-card-back {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: rotateY(180deg);
          color: white;
        }

        /* Typing indicator animation */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #6b7280;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Smooth scrollbar for chat */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .career-card-container {
            height: 250px;
          }
          
          .career-card-front,
          .career-card-back {
            padding: 1.5rem;
          }
        }
      `}</style>

      {renderNavigation()}
      
      {activeFeature === 'home' && renderHome()}
      {activeFeature === 'quiz' && renderQuiz()}
      {activeFeature === 'recommender' && renderRecommender()}
      {activeFeature === 'chatbot' && renderChatbot()}
      {activeFeature === 'btech-advisor' && renderBtechAdvisor()}
      
      {renderCareerModal()}
    </div>
  );
}

export default App;