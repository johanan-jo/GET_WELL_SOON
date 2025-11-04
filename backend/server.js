import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { DiagnosticAnalyzer } from './services/analyzer.js';
import { GeminiService } from './services/gemini.js';
import { normalRanges } from './data/normalRanges.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const patients = new Map();
const analysisHistory = new Map();

// Initialize services
const analyzer = new DiagnosticAnalyzer();
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);

// Store chat sessions
const chatSessions = new Map();

// ============ API ENDPOINTS ============

/**
 * GET / - Health check
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Automated Diagnostic System API', 
    status: 'Running',
    version: '1.0.0'
  });
});

/**
 * GET /api/normal-ranges - Get all normal ranges reference
 */
app.get('/api/normal-ranges', (req, res) => {
  res.json({ success: true, data: normalRanges });
});

/**
 * POST /api/patients - Add new patient
 */
app.post('/api/patients', (req, res) => {
  try {
    const { name, age, gender, contact } = req.body;
    
    if (!name || !age || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, age, and gender are required' 
      });
    }

    const patientId = uuidv4();
    const patient = {
      id: patientId,
      name,
      age,
      gender,
      contact: contact || '',
      createdAt: new Date().toISOString()
    };

    patients.set(patientId, patient);

    res.status(201).json({ 
      success: true, 
      data: patient,
      message: 'Patient added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/patients - Get all patients
 */
app.get('/api/patients', (req, res) => {
  const allPatients = Array.from(patients.values());
  res.json({ success: true, data: allPatients });
});

/**
 * GET /api/patients/:id - Get specific patient
 */
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.get(req.params.id);
  
  if (!patient) {
    return res.status(404).json({ 
      success: false, 
      error: 'Patient not found' 
    });
  }

  res.json({ success: true, data: patient });
});

/**
 * POST /api/analyze - Analyze lab results
 */
app.post('/api/analyze', (req, res) => {
  try {
    const { patientId, labResults } = req.body;

    if (!labResults || typeof labResults !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Lab results are required' 
      });
    }

    // Perform analysis
    const analysis = analyzer.analyze(labResults);

    // Create analysis record
    const analysisId = uuidv4();
    const record = {
      id: analysisId,
      patientId: patientId || null,
      labResults,
      analysis,
      createdAt: new Date().toISOString()
    };

    analysisHistory.set(analysisId, record);

    res.json({ 
      success: true, 
      data: {
        analysisId,
        ...analysis
      },
      message: 'Analysis completed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/history - Get all analysis history
 */
app.get('/api/history', (req, res) => {
  const history = Array.from(analysisHistory.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ success: true, data: history });
});

/**
 * GET /api/history/:id - Get specific analysis
 */
app.get('/api/history/:id', (req, res) => {
  const analysis = analysisHistory.get(req.params.id);
  
  if (!analysis) {
    return res.status(404).json({ 
      success: false, 
      error: 'Analysis not found' 
    });
  }

  res.json({ success: true, data: analysis });
});

/**
 * GET /api/patient-history/:patientId - Get patient's analysis history
 */
app.get('/api/patient-history/:patientId', (req, res) => {
  const patientHistory = Array.from(analysisHistory.values())
    .filter(record => record.patientId === req.params.patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ success: true, data: patientHistory });
});

/**
 * GET /api/stats - Get system statistics
 */
app.get('/api/stats', (req, res) => {
  const totalPatients = patients.size;
  const totalAnalyses = analysisHistory.size;
  
  const recentAnalyses = Array.from(analysisHistory.values())
    .slice(-10);
  
  const criticalCount = recentAnalyses.filter(
    a => a.analysis.overallStatus === 'Critical'
  ).length;

  res.json({
    success: true,
    data: {
      totalPatients,
      totalAnalyses,
      criticalCount,
      lastAnalysisAt: recentAnalyses[0]?.createdAt || null
    }
  });
});

// ============ GEMINI AI CHATBOT ENDPOINTS ============

/**
 * POST /api/chat - Chat with AI assistant
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, analysisId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured'
      });
    }

    // Get or create chat session
    const sid = sessionId || uuidv4();
    let session = chatSessions.get(sid);
    
    if (!session) {
      session = new GeminiService(process.env.GEMINI_API_KEY);
      chatSessions.set(sid, session);
    }

    // Get analysis context if provided
    let analysisContext = null;
    if (analysisId) {
      const analysis = analysisHistory.get(analysisId);
      if (analysis) {
        analysisContext = analysis.analysis;
      }
    }

    console.log(`💬 Processing chat message: "${message.substring(0, 50)}..."`);
    const response = await session.chat(message, analysisContext);
    console.log(`✅ Chat response generated successfully`);

    res.json({
      success: true,
      data: {
        ...response,
        sessionId: sid
      }
    });
  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get response from AI assistant'
    });
  }
});

/**
 * POST /api/analyze-symptoms - Analyze symptoms with AI
 */
app.post('/api/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Symptoms array is required'
      });
    }

    const analysis = await geminiService.analyzeSymptoms(symptoms);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/explain-test - Explain test results in simple terms
 */
app.post('/api/explain-test', async (req, res) => {
  try {
    const { testName, value, normalRange, status } = req.body;

    if (!testName || !value || !normalRange || !status) {
      return res.status(400).json({
        success: false,
        error: 'Test name, value, normal range, and status are required'
      });
    }

    const explanation = await geminiService.explainTestResults(
      testName,
      value,
      normalRange,
      status
    );

    res.json({
      success: true,
      data: explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/health-recommendations - Get AI health recommendations
 */
app.post('/api/health-recommendations', async (req, res) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID is required'
      });
    }

    const analysis = analysisHistory.get(analysisId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    const recommendations = await geminiService.getHealthRecommendations(
      analysis.analysis
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ask-health-question - Ask general health question
 */
app.post('/api/ask-health-question', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const answer = await geminiService.answerHealthQuestion(question);

    res.json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/simplify-medical-info - Simplify medical information
 */
app.post('/api/simplify-medical-info', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    const simplified = await geminiService.simplifyMedicalInfo(text);

    res.json({
      success: true,
      data: simplified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/chat/:sessionId - Clear chat session
 */
app.delete('/api/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (chatSessions.has(sessionId)) {
    chatSessions.delete(sessionId);
    res.json({
      success: true,
      message: 'Chat session cleared'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚑 Automated Diagnostic System API`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 API Ready for requests\n`);
});
