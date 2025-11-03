import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResultsPage({ analysis }) {
  const navigate = useNavigate();

  if (!analysis) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Available</h2>
        <p className="text-gray-600 mb-6">
          Please perform an analysis first
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Normal':
        return 'bg-jade-50 text-jade-700 border border-jade-200';
      case 'Mild':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border border-orange-300';
      case 'Severe':
        return 'bg-coral-100 text-danger border-2 border-danger font-bold';
      default:
        return 'bg-mist text-graphite border border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Normal':
        return '✅';
      case 'Low':
        return '⬇️';
      case 'High':
        return '⬆️';
      default:
        return '❓';
    }
  };

  const getOverallStatusIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return { icon: '✓', bg: 'bg-success', color: 'text-white' };
      case 'Mild Concern':
        return { icon: '!', bg: 'bg-warning', color: 'text-amber-900' };
      case 'Needs Attention':
        return { icon: '⚠', bg: 'bg-orange-500', color: 'text-white' };
      case 'Critical':
        return { icon: '⚠', bg: 'bg-danger', color: 'text-white' };
      default:
        return { icon: '?', bg: 'bg-gray-400', color: 'text-white' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-primary via-teal-600 to-secondary text-white border-none shadow-elevated">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
                <span className="text-3xl">📊</span>
              </div>
              <h1 className="text-3xl font-bold">
                Analysis Results
              </h1>
            </div>
            {analysis.patientInfo?.name && (
              <div className="bg-white/10 rounded-lg px-4 py-2 inline-block backdrop-blur-sm">
                <p className="text-sm font-medium">
                  👤 {analysis.patientInfo.name} • {analysis.patientInfo.age}y • {analysis.patientInfo.gender}
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`w-24 h-24 ${getOverallStatusIcon(analysis.overallStatus).bg} rounded-2xl flex items-center justify-center shadow-lg mb-2`}>
              <span className={`text-5xl font-bold ${getOverallStatusIcon(analysis.overallStatus).color}`}>
                {getOverallStatusIcon(analysis.overallStatus).icon}
              </span>
            </div>
            <p className="text-sm font-bold bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              {analysis.overallStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-primary bg-gradient-to-br from-white to-teal-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold uppercase tracking-wide">Tests Performed</p>
              <p className="text-4xl font-bold text-primary mt-1">
                {analysis.testResults.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🔬</span>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-warning bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-wide">Abnormalities Found</p>
              <p className="text-4xl font-bold text-warning mt-1">
                {analysis.abnormalities.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-secondary bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-wide">Diagnostic Insights</p>
              <p className="text-4xl font-bold text-secondary mt-1">
                {analysis.diagnostics.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span className="text-3xl">💡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Suggestions */}
      {analysis.diagnostics.length > 0 && (
        <div className="card border-t-4 border-primary bg-gradient-to-br from-white to-teal-50/20">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
            <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
              🩺
            </span>
            Diagnostic Suggestions
          </h2>
          <div className="space-y-4">
            {analysis.diagnostics.map((diagnostic, index) => (
              <div key={index} className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-r from-white to-teal-50/30 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-primary flex items-center">
                    <span className="text-xl mr-2">🔍</span>
                    {diagnostic.condition}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getSeverityColor(diagnostic.severity)}`}>
                      {diagnostic.severity}
                    </span>
                    <span className="bg-secondary/20 text-primary px-3 py-1.5 rounded-full text-xs font-semibold border border-secondary">
                      {diagnostic.confidence} Confidence
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 mb-2 border border-primary/10">
                  <p className="text-graphite">
                    <span className="font-bold text-primary">💊 Recommendation:</span> {diagnostic.recommendation}
                  </p>
                </div>
                <p className="text-xs text-secondary font-medium">
                  📊 Based on: {diagnostic.relatedTests.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results Table */}
      <div className="card border-t-4 border-success">
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
          <span className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mr-3">
            📋
          </span>
          Detailed Test Results
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary to-secondary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold">Test</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Value</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Normal Range</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Severity</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Possible Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysis.testResults.map((test, index) => (
                <tr key={index} className={test.status !== 'Normal' ? 'bg-coral-50/50 hover:bg-coral-50 transition-colors' : 'hover:bg-gray-50 transition-colors'}>
                  <td className="px-4 py-3 text-sm font-semibold text-primary">
                    {test.testName}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-graphite">
                    {test.value} {test.unit}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary font-medium">
                    {test.normalRange} {test.unit}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center font-medium">
                      <span className="mr-1">{getStatusIcon(test.status)}</span>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getSeverityColor(test.severity)}`}>
                      {test.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-graphite font-medium">
                    {test.possibleCondition || '-'}
                    {test.deviation !== '0%' && (
                      <span className="text-xs text-danger font-bold ml-2 bg-coral-100 px-2 py-1 rounded">
                        ↗ {test.deviation}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-gradient-to-r from-mist to-white border-2 border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl text-primary mb-2 flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
                🎯
              </span>
              Next Steps
            </h3>
            <p className="text-graphite text-sm font-medium">
              Save this report for your records or perform another analysis
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="btn-secondary hover:border-primary hover:text-primary"
            >
              <span className="mr-2">🖨️</span>
              Print Report
            </button>
            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary shadow-clinical hover:shadow-card"
            >
              <span className="mr-2">➕</span>
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-warning shadow-clinical">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="font-bold text-amber-800 mb-1">Important Medical Disclaimer</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              This system provides preliminary diagnostic insights for <strong>educational and screening purposes only</strong>. It should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for comprehensive evaluation and medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
