// Medical reference ranges for common lab tests
export const normalRanges = {
  hemoglobin: {
    name: "Hemoglobin",
    min: 12.0,
    max: 15.5,
    unit: "g/dL",
    lowCondition: "Anemia",
    highCondition: "Polycythemia",
    category: "CBC"
  },
  wbc: {
    name: "White Blood Cells (WBC)",
    min: 4.0,
    max: 11.0,
    unit: "10³/µL",
    lowCondition: "Leukopenia (Weak Immunity)",
    highCondition: "Infection/Inflammation",
    category: "CBC"
  },
  platelets: {
    name: "Platelets",
    min: 150,
    max: 450,
    unit: "10³/µL",
    lowCondition: "Thrombocytopenia (Bleeding Risk)",
    highCondition: "Thrombocytosis",
    category: "CBC"
  },
  rbc: {
    name: "Red Blood Cells (RBC)",
    min: 4.5,
    max: 5.5,
    unit: "10⁶/µL",
    lowCondition: "Anemia",
    highCondition: "Polycythemia",
    category: "CBC"
  },
  glucose: {
    name: "Blood Glucose (Fasting)",
    min: 70,
    max: 99,
    unit: "mg/dL",
    lowCondition: "Hypoglycemia",
    highCondition: "Diabetes/Prediabetes",
    category: "Metabolic"
  },
  creatinine: {
    name: "Creatinine",
    min: 0.6,
    max: 1.2,
    unit: "mg/dL",
    lowCondition: "Muscle Loss",
    highCondition: "Kidney Dysfunction",
    category: "Kidney Function"
  },
  alt: {
    name: "ALT (Liver Enzyme)",
    min: 7,
    max: 56,
    unit: "U/L",
    lowCondition: "Vitamin B6 Deficiency",
    highCondition: "Liver Damage",
    category: "Liver Function"
  },
  ast: {
    name: "AST (Liver Enzyme)",
    min: 10,
    max: 40,
    unit: "U/L",
    lowCondition: "Vitamin B6 Deficiency",
    highCondition: "Liver/Heart Damage",
    category: "Liver Function"
  },
  bilirubin: {
    name: "Bilirubin",
    min: 0.1,
    max: 1.2,
    unit: "mg/dL",
    lowCondition: "Normal",
    highCondition: "Jaundice/Liver Issue",
    category: "Liver Function"
  },
  cholesterol: {
    name: "Total Cholesterol",
    min: 125,
    max: 200,
    unit: "mg/dL",
    lowCondition: "Malnutrition",
    highCondition: "Heart Disease Risk",
    category: "Lipid Panel"
  }
};

// Diagnostic patterns for multi-parameter analysis
export const diagnosticPatterns = [
  {
    conditions: {
      hemoglobin: "low",
      rbc: "low"
    },
    diagnosis: "Iron Deficiency Anemia",
    severity: "Medium",
    recommendation: "Check iron levels, consider iron supplements"
  },
  {
    conditions: {
      wbc: "high",
      platelets: "high"
    },
    diagnosis: "Acute Infection",
    severity: "High",
    recommendation: "Check CRP levels, consult for antibiotics"
  },
  {
    conditions: {
      glucose: "high"
    },
    diagnosis: "Possible Diabetes/Prediabetes",
    severity: "High",
    recommendation: "HbA1c test, lifestyle modification, endocrinologist consultation"
  },
  {
    conditions: {
      creatinine: "high"
    },
    diagnosis: "Kidney Dysfunction",
    severity: "High",
    recommendation: "Nephrology consultation, check GFR"
  },
  {
    conditions: {
      alt: "high",
      ast: "high"
    },
    diagnosis: "Liver Damage/Hepatitis",
    severity: "High",
    recommendation: "Hepatology consultation, viral hepatitis screening"
  },
  {
    conditions: {
      cholesterol: "high"
    },
    diagnosis: "Cardiovascular Risk",
    severity: "Medium",
    recommendation: "Lipid profile, diet modification, statin consideration"
  }
];
