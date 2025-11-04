import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Chatbot Service
 * Medical assistant for answering health-related questions
 */

export class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Try gemini-pro which is the stable model
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // System prompt for medical context
    this.systemContext = `You are a knowledgeable medical AI assistant integrated into an automated diagnostic system. 
Your role is to:
- Answer medical and health-related questions clearly and accurately
- Provide information about symptoms, conditions, and general health advice
- Explain medical test results and their significance
- Offer guidance on when to seek professional medical care
- Always remind users that you're not a replacement for professional medical diagnosis

Important guidelines:
- Be empathetic and patient-friendly in your responses
- Use simple language that non-medical people can understand
- Always emphasize the importance of consulting healthcare professionals for serious concerns
- Provide evidence-based information
- If you're unsure, acknowledge limitations rather than guessing
- Never provide specific treatment prescriptions or dosage recommendations`;

    // Conversation history for context
    this.conversationHistory = [];
  }

  /**
   * Send a message to Gemini and get response
   */
  async chat(userMessage, analysisContext = null) {
    try {
      let prompt = userMessage;

      // Add analysis context if provided
      if (analysisContext) {
        prompt = `Based on the following medical analysis results:\n\n${JSON.stringify(analysisContext, null, 2)}\n\nUser question: ${userMessage}`;
      }

      // Add system context to first message
      if (this.conversationHistory.length === 0) {
        prompt = `${this.systemContext}\n\nUser: ${prompt}`;
      }

      // Use generateContent instead of chat for better compatibility
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Update conversation history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: response }],
      });

      // Keep history manageable (last 10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        message: response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Gemini chat error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      if (error.response) {
        console.error('API response:', error.response);
      }
      throw new Error(`Failed to get response from AI assistant: ${error.message}`);
    }
  }

  /**
   * Analyze symptoms and provide insights
   */
  async analyzeSymptoms(symptoms) {
    try {
      const prompt = `A patient reports the following symptoms: ${symptoms.join(', ')}. 
      
Please provide:
1. Possible conditions that could cause these symptoms
2. Severity assessment (mild, moderate, severe)
3. Recommended actions (home care, see doctor soon, seek immediate care)
4. Questions to help narrow down the diagnosis

Format the response clearly with sections.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        analysis: response,
        symptoms,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  /**
   * Explain medical test results in simple terms
   */
  async explainTestResults(testName, value, normalRange, status) {
    try {
      const prompt = `Explain the following medical test result to a patient in simple, easy-to-understand language:

Test: ${testName}
Patient's Value: ${value}
Normal Range: ${normalRange}
Status: ${status}

Please explain:
1. What this test measures
2. What the result means
3. Why it might be ${status}
4. What the patient should know or do about it

Keep it simple, friendly, and informative.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        explanation: response,
        test: testName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Test explanation error:', error);
      throw new Error('Failed to explain test results');
    }
  }

  /**
   * Get health recommendations based on analysis
   */
  async getHealthRecommendations(analysisResults) {
    try {
      const prompt = `Based on these medical test results, provide personalized health recommendations:

${JSON.stringify(analysisResults, null, 2)}

Please provide:
1. Lifestyle modifications
2. Dietary suggestions
3. Exercise recommendations
4. When to follow up with a doctor
5. Warning signs to watch for

Make it practical and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        recommendations: response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Recommendations error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Answer general health questions
   */
  async answerHealthQuestion(question) {
    try {
      const prompt = `${this.systemContext}\n\nPatient question: ${question}\n\nProvide a clear, helpful, and accurate answer.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        answer: response,
        question,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Question answering error:', error);
      throw new Error('Failed to answer question');
    }
  }

  /**
   * Translate medical information to simple language
   */
  async simplifyMedicalInfo(medicalText) {
    try {
      const prompt = `Translate the following medical information into simple, everyday language that anyone can understand:

${medicalText}

Make it clear, concise, and friendly.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        simplified: response,
        original: medicalText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Simplification error:', error);
      throw new Error('Failed to simplify medical information');
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }
}
