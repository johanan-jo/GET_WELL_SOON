import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="card bg-gradient-to-br from-primary via-teal-600 to-secondary text-white border-none shadow-elevated">
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <span className="text-6xl">🏥</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Welcome to Automated Diagnostic System
          </h1>
          <p className="text-xl mb-2 opacity-95 font-medium">
            Intelligent Lab Report Analysis in Seconds
          </p>
          <p className="text-sm mb-8 opacity-80 max-w-2xl mx-auto">
            Advanced pattern recognition • Clinical decision support • Rule-based diagnostics
          </p>
          <button 
            onClick={() => navigate('/analyze')}
            className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-mist transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start New Analysis →
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-primary bg-gradient-to-br from-white to-teal-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold uppercase tracking-wide">Total Patients</p>
              <p className="text-4xl font-bold text-primary mt-1">
                {loading ? '...' : stats?.totalPatients || 0}
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-success bg-gradient-to-br from-white to-jade-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-jade-600 text-sm font-semibold uppercase tracking-wide">Total Analyses</p>
              <p className="text-4xl font-bold text-success mt-1">
                {loading ? '...' : stats?.totalAnalyses || 0}
              </p>
            </div>
            <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-danger bg-gradient-to-br from-white to-coral-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-coral-600 text-sm font-semibold uppercase tracking-wide">Critical Cases</p>
              <p className="text-4xl font-bold text-danger mt-1">
                {loading ? '...' : stats?.criticalCount || 0}
              </p>
            </div>
            <div className="w-16 h-16 bg-danger/10 rounded-xl flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-teal-50/20">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-clinical">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-primary">Instant Analysis</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get diagnostic insights in under a second
          </p>
        </div>

        <div className="card text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-jade-50/20">
          <div className="w-14 h-14 bg-gradient-to-br from-success to-jade-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-clinical">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-success">Accurate Detection</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Rule-based abnormality detection system
          </p>
        </div>

        <div className="card text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-blue-50/20">
          <div className="w-14 h-14 bg-gradient-to-br from-secondary to-sky-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-clinical">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-secondary">Pattern Recognition</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Multi-parameter diagnostic patterns
          </p>
        </div>

        <div className="card text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-amber-50/20">
          <div className="w-14 h-14 bg-gradient-to-br from-warning to-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-clinical">
            <span className="text-3xl">💡</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-amber-700">Smart Suggestions</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Clinical recommendations included
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h3 className="font-semibold mb-2">Enter Lab Data</h3>
            <p className="text-gray-600 text-sm">
              Input patient details and lab test values manually
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h3 className="font-semibold mb-2">Automatic Analysis</h3>
            <p className="text-gray-600 text-sm">
              System compares values against medical ranges
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h3 className="font-semibold mb-2">Get Insights</h3>
            <p className="text-gray-600 text-sm">
              View diagnostics, severity, and recommendations
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Ready to Analyze Lab Reports?
        </h2>
        <p className="text-gray-600 mb-6">
          Start making faster, data-driven diagnostic decisions today
        </p>
        <button 
          onClick={() => navigate('/analyze')}
          className="btn-primary text-lg"
        >
          Begin Analysis
        </button>
      </div>
    </div>
  );
}

export default HomePage;
