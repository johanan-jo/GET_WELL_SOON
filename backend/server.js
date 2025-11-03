import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { DiagnosticAnalyzer } from './services/analyzer.js';
import { normalRanges } from './data/normalRanges.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const patients = new Map();
const analysisHistory = new Map();

// Initialize analyzer
const analyzer = new DiagnosticAnalyzer();

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

// Start server
app.listen(PORT, () => {
  console.log(`\n🚑 Automated Diagnostic System API`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 API Ready for requests\n`);
});
