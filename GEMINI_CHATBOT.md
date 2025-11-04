# 🤖 Gemini AI Chatbot Integration

## ✨ Features Implemented

### AI Medical Assistant
- **Real-time Chat**: Interactive conversational AI powered by Google Gemini
- **Context-Aware**: Understands your medical analysis results
- **Medical Expertise**: Trained to provide accurate health information
- **User-Friendly**: Simple, clean interface with quick questions

### Capabilities

1. **General Health Q&A**
   - Answer any health-related questions
   - Explain medical terms in simple language
   - Provide evidence-based information

2. **Test Result Explanations**
   - Break down complex test results
   - Explain what abnormalities mean
   - Suggest when to seek care

3. **Symptom Analysis**
   - Analyze reported symptoms
   - Assess severity levels
   - Recommend appropriate actions

4. **Health Recommendations**
   - Personalized based on your results
   - Lifestyle and dietary suggestions
   - Exercise recommendations

5. **Medical Information Simplification**
   - Convert medical jargon to everyday language
   - Make health info accessible

## 🚀 How to Use

### Backend API Endpoints

#### 1. Chat with AI
```bash
POST http://localhost:5000/api/chat
Content-Type: application/json

{
  "message": "What does high cholesterol mean?",
  "sessionId": "optional-session-id",
  "analysisId": "optional-analysis-id"
}
```

#### 2. Analyze Symptoms
```bash
POST http://localhost:5000/api/analyze-symptoms
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "headache"]
}
```

#### 3. Explain Test Results
```bash
POST http://localhost:5000/api/explain-test
Content-Type: application/json

{
  "testName": "Blood Glucose",
  "value": "180",
  "normalRange": "70-100",
  "status": "High"
}
```

#### 4. Get Health Recommendations
```bash
POST http://localhost:5000/api/health-recommendations
Content-Type: application/json

{
  "analysisId": "your-analysis-id"
}
```

#### 5. Ask General Health Question
```bash
POST http://localhost:5000/api/ask-health-question
Content-Type: application/json

{
  "question": "How can I lower my cholesterol naturally?"
}
```

#### 6. Simplify Medical Info
```bash
POST http://localhost:5000/api/simplify-medical-info
Content-Type: application/json

{
  "text": "Hyperlipidemia with elevated LDL-C levels..."
}
```

#### 7. Clear Chat Session
```bash
DELETE http://localhost:5000/api/chat/:sessionId
```

## 🎨 Frontend ChatBot Component

### Features
- **Floating Chat Button**: Always accessible in bottom-right corner
- **Beautiful UI**: Modern gradient design with smooth animations
- **Quick Questions**: Pre-written questions for easy start
- **Context Awareness**: Automatically knows your analysis results
- **Loading States**: Visual feedback during AI processing
- **Message History**: Maintains conversation context
- **Responsive**: Works on all screen sizes

### Usage in Frontend

The ChatBot is automatically included in the App component and available on all pages:

```jsx
<ChatBot analysisId={currentAnalysis?.analysisId} />
```

### User Experience

1. **Click the floating chat button** (💬) in the bottom-right
2. **Chat window opens** with welcome message
3. **Ask any question** or use quick questions
4. **AI responds** with helpful, accurate information
5. **Continue conversation** - context is maintained
6. **Close anytime** - returns to floating button

## 📝 Example Conversations

### Example 1: Understanding Test Results
```
User: What does my high blood glucose mean?
AI: High blood glucose (sugar) means there's more sugar in your blood than normal. 
This could indicate:
1. Prediabetes or diabetes
2. Your body isn't processing sugar properly
3. You may need dietary changes...
```

### Example 2: Symptom Check
```
User: I have a headache and feel tired
AI: Headaches and fatigue are common symptoms that can have many causes:
- Dehydration
- Lack of sleep
- Stress
- Low blood sugar...
```

### Example 3: Lifestyle Advice
```
User: How can I improve my health based on my results?
AI: Based on your test results, here are personalized recommendations:
1. Diet: Reduce sodium intake...
2. Exercise: 30 minutes daily walking...
3. Sleep: Aim for 7-8 hours...
```

## 🔧 Configuration

### Environment Setup

Your API key is already configured in `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyBqFlECSrvf_BGdw60IYKLtSv0bOLdoSik
```

### Model Configuration

The service uses `gemini-pro` model with:
- Max output tokens: 1000
- Temperature: 0.7 (balanced creativity/accuracy)
- Context window: Last 20 messages

### System Context

The AI is instructed to:
- Be empathetic and patient-friendly
- Use simple, understandable language
- Emphasize importance of professional care
- Provide evidence-based information
- Acknowledge limitations when uncertain

## 🎯 Integration Points

### App.jsx
```jsx
import ChatBot from './components/ChatBot';

// Included at bottom of App
<ChatBot analysisId={currentAnalysis?.analysisId} />
```

### ResultsPage.jsx
The chatbot automatically receives the current analysis ID and can answer questions about your specific results.

## 🐛 Troubleshooting

### Chatbot Not Responding?
1. Check backend is running on port 5000
2. Verify GEMINI_API_KEY in `.env`
3. Check browser console for errors
4. Ensure internet connection (API calls)

### Slow Responses?
- First response may take 2-3 seconds (API cold start)
- Subsequent responses are faster
- Network speed affects response time

### API Key Issues?
- Verify key is correct in `.env`
- Check key hasn't expired
- Restart backend after changing `.env`

## 🧪 Testing

### Test the Chat API with curl:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"What is diabetes?\"}"
```

### Test Symptom Analysis:
```bash
curl -X POST http://localhost:5000/api/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d "{\"symptoms\":[\"fever\",\"cough\"]}"
```

## 🎉 Features Highlights

✅ **Conversational AI** - Natural, human-like interactions
✅ **Medical Context** - Understands health and medical topics
✅ **Context Awareness** - Remembers conversation history
✅ **Beautiful UI** - Modern, intuitive design
✅ **Quick Questions** - Easy-to-use suggestions
✅ **Real-time Updates** - Instant responses
✅ **Session Management** - Multiple independent conversations
✅ **Mobile Responsive** - Works on all devices

## 🚀 Ready to Use!

Your AI chatbot is fully integrated and ready to help users with:
- Understanding test results
- Answering health questions
- Explaining medical terms
- Providing lifestyle advice
- Symptom assessment
- General health guidance

**Start chatting by clicking the 💬 button in the bottom-right corner!**

---

## ⚠️ Important Disclaimer

The AI assistant provides information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
