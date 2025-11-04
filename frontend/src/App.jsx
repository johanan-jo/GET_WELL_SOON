import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import ResultsPage from './pages/ResultsPage';
import ChatBot from './components/ChatBot';

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <nav className="bg-white border-b-2 border-primary/10 shadow-clinical">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-clinical">
                  <span className="text-2xl">🏥</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-primary block leading-tight">
                    Automated Diagnostic System
                  </span>
                  <span className="text-xs text-secondary font-medium">Clinical Decision Support</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Link 
                  to="/" 
                  className="px-4 py-2 text-graphite hover:text-primary hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/analyze" 
                  className="px-4 py-2 text-graphite hover:text-primary hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium"
                >
                  New Analysis
                </Link>
                <Link 
                  to="/history" 
                  className="px-4 py-2 text-graphite hover:text-primary hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium"
                >
                  History
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/analyze" 
              element={<AnalyzePage setCurrentAnalysis={setCurrentAnalysis} />} 
            />
            <Route path="/history" element={<HistoryPage />} />
            <Route 
              path="/results" 
              element={<ResultsPage analysis={currentAnalysis} />} 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t-2 border-primary/10 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-amber-50 border-l-4 border-warning rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ <strong>Medical Disclaimer:</strong> This system provides preliminary diagnostic insights for educational and screening purposes only. Always consult with a qualified healthcare provider for professional medical advice, diagnosis, and treatment.
              </p>
            </div>
            <div className="text-center text-gray-500">
              <p className="text-xs">
                © 2025 Automated Diagnostic System | Clinical Decision Support Tool | Hackathon Project
              </p>
            </div>
          </div>
        </footer>

        {/* AI Chatbot */}
        <ChatBot analysisId={currentAnalysis?.analysisId} />
      </div>
    </Router>
  );
}

export default App;
