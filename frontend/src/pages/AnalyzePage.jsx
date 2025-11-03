import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AnalyzePage({ setCurrentAnalysis }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Patient information
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: 'male'
  });

  // Lab test values
  const [labValues, setLabValues] = useState({
    hemoglobin: '',
    wbc: '',
    platelets: '',
    rbc: '',
    glucose: '',
    creatinine: '',
    alt: '',
    ast: '',
    bilirubin: '',
    cholesterol: ''
  });

  const handlePatientChange = (e) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handleLabChange = (e) => {
    setLabValues({ ...labValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty lab values
      const labResults = {};
      Object.keys(labValues).forEach(key => {
        if (labValues[key] !== '') {
          labResults[key] = parseFloat(labValues[key]);
        }
      });

      if (Object.keys(labResults).length === 0) {
        setError('Please enter at least one lab test value');
        setLoading(false);
        return;
      }

      // Create patient first (optional)
      let patientId = null;
      if (patientInfo.name && patientInfo.age) {
        const patientResponse = await axios.post(`${API_URL}/patients`, patientInfo);
        patientId = patientResponse.data.data.id;
      }

      // Analyze lab results
      const analysisResponse = await axios.post(`${API_URL}/analyze`, {
        patientId,
        labResults
      });

      // Store analysis and navigate to results
      setCurrentAnalysis({
        ...analysisResponse.data.data,
        patientInfo
      });
      navigate('/results');

    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = () => {
    setPatientInfo({
      name: 'John Doe',
      age: '45',
      gender: 'male'
    });
    setLabValues({
      hemoglobin: '10.5',
      wbc: '13.2',
      platelets: '320',
      rbc: '4.2',
      glucose: '145',
      creatinine: '0.9',
      alt: '28',
      ast: '22',
      bilirubin: '0.8',
      cholesterol: '210'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-gradient-to-br from-white to-teal-50/20 border-t-4 border-primary">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center">
              <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                📋
              </span>
              New Lab Analysis
            </h1>
            <p className="text-sm text-secondary mt-1 ml-13">Enter patient lab values for instant diagnostic insights</p>
          </div>
          <button
            type="button"
            onClick={handleUseSample}
            className="btn-secondary text-sm hover:bg-secondary/10 hover:text-primary hover:border-primary transition-all"
          >
            ✨ Use Sample Data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Information */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2 text-lg">👤</span>
              Patient Information <span className="text-sm text-secondary font-normal ml-2">(Optional)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={patientInfo.name}
                  onChange={handlePatientChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={patientInfo.age}
                  onChange={handlePatientChange}
                  className="input-field"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={patientInfo.gender}
                  onChange={handlePatientChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lab Test Values */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2 text-lg">🔬</span>
              Lab Test Values <span className="text-danger ml-1">*</span>
            </h2>
            
            {/* CBC Tests */}
            <div className="mb-6 p-4 bg-gradient-to-r from-teal-50/50 to-transparent rounded-lg border-l-2 border-primary">
              <h3 className="text-md font-bold text-primary mb-3 flex items-center">
                <span className="text-lg mr-2">🩸</span>
                Complete Blood Count (CBC)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Hemoglobin (g/dL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 12-15.5</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="hemoglobin"
                    value={labValues.hemoglobin}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="13.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    WBC (10³/µL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 4-11</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="wbc"
                    value={labValues.wbc}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="7.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Platelets (10³/µL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 150-450</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="platelets"
                    value={labValues.platelets}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    RBC (10⁶/µL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 4.5-5.5</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="rbc"
                    value={labValues.rbc}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="5.0"
                  />
                </div>
              </div>
            </div>

            {/* Metabolic & Other Tests */}
            <div className="mb-6 p-4 bg-gradient-to-r from-jade-50/50 to-transparent rounded-lg border-l-2 border-success">
              <h3 className="text-md font-bold text-success mb-3 flex items-center">
                <span className="text-lg mr-2">⚗️</span>
                Metabolic & Function Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Glucose (mg/dL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 70-99</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="glucose"
                    value={labValues.glucose}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Creatinine (mg/dL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 0.6-1.2</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="creatinine"
                    value={labValues.creatinine}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="0.9"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    ALT (U/L)
                    <span className="text-xs text-gray-500 ml-2">Normal: 7-56</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="alt"
                    value={labValues.alt}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    AST (U/L)
                    <span className="text-xs text-gray-500 ml-2">Normal: 10-40</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="ast"
                    value={labValues.ast}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Bilirubin (mg/dL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 0.1-1.2</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="bilirubin"
                    value={labValues.bilirubin}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="0.8"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Cholesterol (mg/dL)
                    <span className="text-xs text-gray-500 ml-2">Normal: 125-200</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="cholesterol"
                    value={labValues.cholesterol}
                    onChange={handleLabChange}
                    className="input-field"
                    placeholder="180"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-coral-50 border-l-4 border-danger rounded-lg px-4 py-3 shadow-clinical">
              <p className="text-danger font-semibold flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Analyzing...' : '🔍 Analyze Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnalyzePage;
