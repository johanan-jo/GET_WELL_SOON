import { normalRanges, diagnosticPatterns } from '../data/normalRanges.js';

/**
 * Analyzes lab test results and generates diagnostic insights
 */
export class DiagnosticAnalyzer {
  
  /**
   * Main analysis function
   * @param {Object} labResults - Patient lab test values
   * @returns {Object} - Analysis results with diagnostics
   */
  analyze(labResults) {
    const results = {
      testResults: [],
      abnormalities: [],
      diagnostics: [],
      overallStatus: 'Normal',
      timestamp: new Date().toISOString()
    };

    // Analyze each test parameter
    for (const [testKey, value] of Object.entries(labResults)) {
      if (normalRanges[testKey]) {
        const analysis = this.analyzeParameter(testKey, value);
        results.testResults.push(analysis);
        
        if (analysis.status !== 'Normal') {
          results.abnormalities.push(analysis);
        }
      }
    }

    // Pattern-based diagnosis
    results.diagnostics = this.generateDiagnostics(results.abnormalities);

    // Overall status
    results.overallStatus = this.determineOverallStatus(results.abnormalities);

    return results;
  }

  /**
   * Analyzes a single test parameter
   */
  analyzeParameter(testKey, value) {
    const range = normalRanges[testKey];
    const numValue = parseFloat(value);

    let status = 'Normal';
    let severity = 'Normal';
    let possibleCondition = null;
    let deviation = 0;

    if (numValue < range.min) {
      status = 'Low';
      severity = this.calculateSeverity(numValue, range.min, 'low');
      possibleCondition = range.lowCondition;
      deviation = ((range.min - numValue) / range.min * 100).toFixed(1);
    } else if (numValue > range.max) {
      status = 'High';
      severity = this.calculateSeverity(numValue, range.max, 'high');
      possibleCondition = range.highCondition;
      deviation = ((numValue - range.max) / range.max * 100).toFixed(1);
    }

    return {
      testName: range.name,
      testKey,
      value: numValue,
      normalRange: `${range.min} - ${range.max}`,
      unit: range.unit,
      status,
      severity,
      possibleCondition,
      deviation: status !== 'Normal' ? `${deviation}%` : '0%',
      category: range.category
    };
  }

  /**
   * Calculates severity based on deviation from normal range
   */
  calculateSeverity(value, threshold, direction) {
    let deviationPercent;
    
    if (direction === 'low') {
      deviationPercent = ((threshold - value) / threshold) * 100;
    } else {
      deviationPercent = ((value - threshold) / threshold) * 100;
    }

    if (deviationPercent < 10) return 'Mild';
    if (deviationPercent < 30) return 'Medium';
    return 'Severe';
  }

  /**
   * Generates diagnostic suggestions based on abnormality patterns
   */
  generateDiagnostics(abnormalities) {
    const diagnostics = [];
    
    // Create abnormality map
    const abnormalityMap = {};
    abnormalities.forEach(abn => {
      abnormalityMap[abn.testKey] = abn.status.toLowerCase();
    });

    // Check against known patterns
    diagnosticPatterns.forEach(pattern => {
      let matches = true;
      
      for (const [testKey, expectedStatus] of Object.entries(pattern.conditions)) {
        if (abnormalityMap[testKey] !== expectedStatus) {
          matches = false;
          break;
        }
      }

      if (matches) {
        diagnostics.push({
          condition: pattern.diagnosis,
          confidence: 'High',
          severity: pattern.severity,
          recommendation: pattern.recommendation,
          relatedTests: Object.keys(pattern.conditions)
        });
      }
    });

    // Add individual parameter diagnostics if no pattern matched
    if (diagnostics.length === 0) {
      abnormalities.forEach(abn => {
        if (abn.possibleCondition) {
          diagnostics.push({
            condition: abn.possibleCondition,
            confidence: 'Medium',
            severity: abn.severity,
            recommendation: `Monitor ${abn.testName} levels, consult specialist`,
            relatedTests: [abn.testKey]
          });
        }
      });
    }

    return diagnostics;
  }

  /**
   * Determines overall health status
   */
  determineOverallStatus(abnormalities) {
    if (abnormalities.length === 0) return 'Healthy';
    
    const hasSevere = abnormalities.some(abn => abn.severity === 'Severe');
    if (hasSevere) return 'Critical';
    
    const hasMedium = abnormalities.some(abn => abn.severity === 'Medium');
    if (hasMedium) return 'Needs Attention';
    
    return 'Mild Concern';
  }
}
