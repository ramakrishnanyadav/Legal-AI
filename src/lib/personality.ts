// Witty loading messages - legal puns
export const loadingMessages = [
  "Reviewing the case files...",
  "Consulting the legal precedents...",
  "Objection! Just kidding, still loading...",
  "Briefing our AI counsel...",
  "Cross-examining the data...",
  "Filing a motion to proceed...",
  "Deliberating with algorithms...",
  "Approaching the bench (it's a progress bar)...",
  "Sustaining your patience...",
  "The court is now in session...",
  "Pleading the fifth... dimension of loading...",
  "Our AI is taking the bar exam...",
  "Examining the evidence...",
  "The jury is still out... on this loading time...",
  "Making our closing arguments to the server...",
];

// Encouraging error messages
export const errorMessages = {
  network: [
    "Looks like we hit a legal loophole! Let's try again.",
    "The connection was held in contempt. Retrying...",
    "Brief network interruption - nothing we can't appeal!",
  ],
  validation: [
    "Hmm, that doesn't quite fit our case. Let's adjust!",
    "A small technicality - easy fix!",
    "Let's make sure all the evidence is in order.",
  ],
  server: [
    "Our servers are taking a short recess. Back shortly!",
    "Technical difficulties - even the best lawyers take breaks.",
    "We're experiencing high traffic. Justice takes time!",
  ],
  notFound: [
    "This case file seems to have wandered off.",
    "404: Evidence not found. But we'll keep looking!",
    "That page is playing hide and seek. Let's find another way.",
  ],
  generic: [
    "A minor setback, not a verdict! Let's try again.",
    "Every case has its challenges. We've got this!",
    "Think of this as a plot twist, not an ending.",
  ],
};

// Empty state messages
export const emptyStateMessages = {
  noResults: {
    title: "No cases found",
    message: "The courtroom is empty, but that's not a bad thing! Try adjusting your search.",
    emoji: "⚖️",
  },
  noMessages: {
    title: "Start the conversation",
    message: "Your AI legal assistant is ready and waiting. What's on your mind?",
    emoji: "💬",
  },
  noLawyers: {
    title: "Finding the perfect match",
    message: "We're expanding our network of legal experts. Check back soon!",
    emoji: "👨‍⚖️",
  },
  noHistory: {
    title: "Fresh start",
    message: "No previous cases yet. Every great legal journey starts here!",
    emoji: "📋",
  },
};

// Success celebration messages
export const successMessages = [
  "Case closed! 🎉",
  "Victory! The scales tip in your favor.",
  "Motion granted! You're on a roll.",
  "Excellent work, counselor!",
  "Justice has been served! ⚖️",
  "That's a legal slam dunk!",
  "Objection sustained - in your favor!",
];

// Get random message from array
export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get random error message by type
export const getErrorMessage = (type: keyof typeof errorMessages = 'generic'): string => {
  const messages = errorMessages[type] || errorMessages.generic;
  return getRandomMessage(messages);
};

// Keyboard shortcuts
export const keyboardShortcuts = [
  { keys: ['/', 'Ctrl+K'], action: 'Open search', description: 'Quick access to search' },
  { keys: ['Escape'], action: 'Close modal', description: 'Close any open modal or menu' },
  { keys: ['Shift+?'], action: 'Show shortcuts', description: 'Display this help menu' },
  { keys: ['Alt+1-5'], action: 'Navigate sections', description: 'Jump to specific sections' },
  { keys: ['Ctrl+Enter'], action: 'Submit', description: 'Submit forms quickly' },
  { keys: ['↑↑↓↓←→←→BA'], action: '???', description: 'Something special...' },
];

// Tutorial tooltips
export const tutorialSteps = [
  {
    id: 'welcome',
    target: '.hero-section',
    title: 'Welcome to LegalAI',
    message: 'Your AI-powered legal assistant. Let us help you understand your rights.',
  },
  {
    id: 'analyzer',
    target: '#analyzer',
    title: 'Describe Your Situation',
    message: 'Tell us what happened. Our AI will analyze the legal implications.',
  },
  {
    id: 'perspective',
    target: '.perspective-switcher',
    title: 'See Both Sides',
    message: 'View your situation from different legal perspectives.',
  },
  {
    id: 'timeline',
    target: '#timeline',
    title: 'Understand the Process',
    message: 'See what to expect in a typical legal proceeding.',
  },
  {
    id: 'lawyers',
    target: '#lawyers',
    title: 'Find Legal Help',
    message: 'Connect with verified legal professionals when you need them.',
  },
];
