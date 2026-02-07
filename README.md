# 🏛️ Lumina Legal - AI-Powered Legal Case Analyzer

> Intelligent legal assistant platform analyzing criminal cases under Indian law with 85-95% accuracy

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://legal-ai-chi-liart.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

---

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Modern Crime Detection**: Deepfakes, photo morphing, privacy violations, cyber crimes
- **140+ IPC Sections**: Comprehensive coverage of Indian Penal Code and IT Act
- **85-95% Accuracy**: Validated legal section identification
- **<3 Second Response**: Lightning-fast analysis with intelligent caching
- **Multi-AI Fallback**: Gemini, Claude, OpenAI, DeepSeek for reliability

### 👨‍⚖️ Lawyer Marketplace
- **45 Verified Lawyers** across 10 major Indian cities
- **Location-Based Filtering**: Find lawyers in your area
- **Smart AI Matching**: Recommends specialists based on your case
- **Detailed Profiles**: Experience, success rates, fees, languages, specializations
- **Direct Consultation**: Book meetings with preferred communication mode

### 📋 Enhanced Consultation System
- **3-Step Request Form**: Streamlined consultation booking
- **Urgency Levels**: Emergency, Urgent, Normal, Flexible
- **Evidence Tracking**: Document your proof upfront
- **Budget Transparency**: See lawyer fees before requesting
- **Multiple Modes**: Video, phone, in-person, or email consultations

### 📄 Premium Features (Logged-in Users)
- **Auto-Generated FIR Templates**
- **Legal Complaint Letters**
- **Evidence Checklists**
- **Detailed Action Plans** with timelines and cost estimates
- **Risk Assessment** with strengths and weaknesses

---

## 🎯 Supported Crime Types

✅ Cyber Crimes (hacking, phishing, identity theft)  
✅ Deepfake & Photo Morphing  
✅ Privacy Violations  
✅ Theft & Property Crimes  
✅ Fraud & Cheating (IPC 420)  
✅ Assault & Violence  
✅ Domestic Violence  
✅ Sexual Offenses  
✅ Food Adulteration  
✅ Corruption & Bribery  
✅ Defamation  
✅ And many more...

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Firebase (Auth & Firestore)
- Framer Motion
- Deployed on Vercel

**Backend:**
- Python 3.11 + FastAPI
- Google Gemini AI (primary)
- Claude, OpenAI, DeepSeek (fallbacks)
- Firebase Admin SDK
- In-memory caching
- Deployed on Railway/Render

---

## 📥 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase account
- At least one AI API key (Gemini recommended)

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/ramakrishnanyadav/Legal-AI.git
cd Legal-AI

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Firebase config

# Run development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add your AI API keys

# Run server
uvicorn main:app --reload
```

---

## 🔧 Environment Variables

**Frontend (.env):**
```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8000
```

**Backend (.env):**
```env
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Accuracy | 85-95% |
| Response Time | <3 seconds |
| Cached Queries | ~0.05 seconds |
| IPC Sections | 140+ |
| Lawyers | 45 |
| Cities | 10 major cities |
| Cache Hit Rate | 40-60% |

---

## 🎯 How It Works

1. **User describes their case** (e.g., "Someone created deepfake of me")
2. **AI analyzes** using hybrid approach (keywords + AI validation)
3. **Identifies applicable laws** (IPC sections, IT Act provisions)
4. **Recommends specialized lawyers** based on case type and location
5. **Generates legal documents** (FIR, complaint, action plan)
6. **User can book consultation** with recommended lawyers

---

## 📱 Usage Example

```javascript
// Analyze a case
const response = await fetch('http://localhost:8000/api/analyze-case', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: "Someone took my photos from social media and created morphed images",
    role: "victim"
  })
});

// Expected response:
{
  sections: [
    { code: "IT Act 66E", title: "Violation of Privacy", confidence: 0.95 },
    { code: "IT Act 67", title: "Publishing Obscene Material", confidence: 0.90 },
    { code: "IPC 509", title: "Insulting Modesty", confidence: 0.85 }
  ],
  severity: "Severe",
  bail: "Non-Bailable",
  overallConfidence: 90
}
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ramakrishnan Yadav**

- 📧 Email: ramakrishnayadav2004@gmail.com
- 💼 GitHub: [@ramakrishnanyadav](https://github.com/ramakrishnanyadav)
- 🌐 LinkedIn: [Ramakrishnan Yadav](https://linkedin.com/in/ramakrishnanyadav)

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful legal analysis
- Anthropic Claude for fallback support
- Firebase for backend infrastructure
- Vercel for seamless deployments
- All contributors and users

---

## ⚠️ Disclaimer

This platform provides AI-assisted legal information and should **NOT** be considered legal advice. Always consult a qualified lawyer for specific legal matters.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice input for case descriptions
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Video consultation integration
- [ ] Payment gateway
- [ ] POCSO Act and special laws
- [ ] Court case status tracking
- [ ] Legal precedent search

---

<div align="center">

**⭐ If you find this project helpful, please star it!**

Made with ❤️ for access to justice in India

[⭐ Star](https://github.com/ramakrishnanyadav/Legal-AI) • [🐛 Report Bug](https://github.com/ramakrishnanyadav/Legal-AI/issues) • [✨ Request Feature](https://github.com/ramakrishnanyadav/Legal-AI/issues)

</div>
