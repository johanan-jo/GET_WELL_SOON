import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800';
      case 'Mild Concern':
        return 'bg-yellow-100 text-yellow-800';
      case 'Needs Attention':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Analysis History</h2>
        <p className="text-gray-600 mb-6">
          Start by analyzing your first lab report
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="btn-primary"
        >
          New Analysis
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Analysis History
        </h1>
        <button
          onClick={() => navigate('/analyze')}
          className="btn-primary"
        >
          + New Analysis
        </button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div key={record.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🩺</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Analysis #{record.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Tests Performed</p>
                    <p className="font-semibold text-gray-800">
                      {Object.keys(record.labResults).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Abnormalities</p>
                    <p className="font-semibold text-gray-800">
                      {record.analysis.abnormalities.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Diagnostics</p>
                    <p className="font-semibold text-gray-800">
                      {record.analysis.diagnostics.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.analysis.overallStatus)}`}>
                      {record.analysis.overallStatus}
                    </span>
                  </div>
                </div>

                {record.analysis.diagnostics.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-800 mb-1">
                      Key Findings:
                    </p>
                    <p className="text-sm text-blue-700">
                      {record.analysis.diagnostics[0].condition}
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button
                  className="text-primary hover:text-blue-700 font-medium text-sm"
                  onClick={() => {
                    // You can implement view details functionality
                    console.log('View details:', record);
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Showing {history.length} analysis record{history.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default HistoryPage;
