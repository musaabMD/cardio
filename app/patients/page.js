"use client"
import React, { Suspense, useState } from 'react';
import { AlertTriangle, Users, ArrowUp, ArrowDown, AlertCircle, Search } from 'lucide-react';
const patientData = [
  {
    id: 1,
    name: "John Smith",
    age: 65,
    mrn: "MRN-2024-001",
    riskScore: 7.2,
    lastCheckIn: "2024-03-10",
    symptoms: {
      dyspnea: { level: "mild", trend: "stable" },
      fatigue: { level: "mild", trend: "improving" },
      edema: { level: "none", trend: "stable" },
      orthopnea: { level: "mild", trend: "stable" },
      newSymptoms: false
    },
    vitals: {
      weight: { current: 82.5, change: 2.1, trend: "up", isRapid: true },
      bp: { systolic: 145, diastolic: 90, trend: "up" },
      hr: { value: 82, trend: "stable" }
    },
    adherence: {
      medication: 95,
      fluid: true,
      sodium: false,
      exercise: true
    },
    titration: {
      status: "stable",
      sideEffects: "minimal",
      lastUpdate: "2024-03-08"
    },
    riskLevel: "moderate"
  },
  {
    id: 2,
    name: "Mary Johnson",
    age: 72,
    mrn: "MRN-2024-002",
    riskScore: 8.9,
    lastCheckIn: "2024-03-12",
    symptoms: {
      dyspnea: { level: "severe", trend: "worsening" },
      fatigue: { level: "severe", trend: "worsening" },
      edema: { level: "moderate", trend: "worsening" },
      orthopnea: { level: "severe", trend: "worsening" },
      newSymptoms: true
    },
    vitals: {
      weight: { current: 68.2, change: 4.5, trend: "up", isRapid: true },
      bp: { systolic: 160, diastolic: 95, trend: "up" },
      hr: { value: 95, trend: "up" }
    },
    adherence: {
      medication: 75,
      fluid: false,
      sodium: false,
      exercise: false
    },
    titration: {
      status: "poor",
      sideEffects: "significant",
      lastUpdate: "2024-03-11"
    },
    riskLevel: "high"
  },
  {
    id: 3,
    name: "Robert Davis",
    age: 58,
    mrn: "MRN-2024-003",
    riskScore: 3.1,
    lastCheckIn: "2024-03-11",
    symptoms: {
      dyspnea: { level: "none", trend: "stable" },
      fatigue: { level: "mild", trend: "stable" },
      edema: { level: "none", trend: "stable" },
      orthopnea: { level: "none", trend: "stable" },
      newSymptoms: false
    },
    vitals: {
      weight: { current: 90.1, change: 0, trend: "stable", isRapid: false },
      bp: { systolic: 128, diastolic: 82, trend: "stable" },
      hr: { value: 72, trend: "stable" }
    },
    adherence: {
      medication: 98,
      fluid: true,
      sodium: true,
      exercise: true
    },
    titration: {
      status: "good",
      sideEffects: "none",
      lastUpdate: "2024-03-10"
    },
    riskLevel: "low"
  }
];

export default function Dashboard() {
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getRiskBadgeStyle = (level) => {
    const baseStyle = "text-xs font-semibold px-2.5 py-1 rounded-full";
    switch (level) {
      case "high":
        return `${baseStyle} bg-red-100 text-red-800 border border-red-200`;
      case "moderate":
        return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "low":
        return `${baseStyle} bg-green-100 text-green-800 border border-green-200`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getSymptomSeverityStyle = (level) => {
    const baseStyle = "text-xs px-2 py-0.5 rounded font-medium";
    switch (level) {
      case "severe":
        return `${baseStyle} bg-red-50 text-red-700 border border-red-100`;
      case "moderate":
        return `${baseStyle} bg-yellow-50 text-yellow-700 border border-yellow-100`;
      case "mild":
        return `${baseStyle} bg-blue-50 text-blue-700 border border-blue-100`;
      case "none":
        return `${baseStyle} bg-gray-50 text-gray-600 border border-gray-100`;
      default:
        return `${baseStyle} bg-gray-50 text-gray-600 border border-gray-100`;
    }
  };

  const TrendIndicator = ({ trend, value, isWeight = false }) => {
    if (trend === "up") {
      return (
        <div className={`flex items-center ${isWeight && value > 2 ? 'text-red-600' : 'text-yellow-600'}`}>
          <ArrowUp size={16} />
          {isWeight && <span className="text-xs ml-1">{value}kg</span>}
        </div>
      );
    } else if (trend === "down") {
      return (
        <div className="flex items-center text-green-600">
          <ArrowDown size={16} />
          {isWeight && <span className="text-xs ml-1">{value}kg</span>}
        </div>
      );
    }
    return <span className="text-gray-400">―</span>;
  };

  const filteredPatients = patientData.filter(patient => {
    const riskMatch = selectedRisk === 'all' || patient.riskLevel === selectedRisk;
    const searchMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       patient.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    return riskMatch && searchMatch;
  });

  return (

    <>
   <Suspense>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Heart Failure Clinic</h1>
              <p className="text-sm text-gray-500 mt-1">Active Patients Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                <Users size={18} className="text-blue-600" />
                <span className="text-blue-600 font-medium">{patientData.length} Patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRisk('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedRisk === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Patients
              </button>
              <button
                onClick={() => setSelectedRisk('high')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedRisk === 'high' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
              >
                High Risk
              </button>
              <button
                onClick={() => setSelectedRisk('moderate')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedRisk === 'moderate' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
              >
                Moderate Risk
              </button>
              <button
                onClick={() => setSelectedRisk('low')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedRisk === 'low' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
              >
                Low Risk
              </button>
            </div>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients or MRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient) => (
            <div key={patient.id} 
                 className={`bg-white rounded-lg shadow-sm border ${
                   patient.riskLevel === 'high' ? 'border-red-200' :
                   patient.riskLevel === 'moderate' ? 'border-yellow-200' :
                   'border-gray-200'
                 } p-4`}>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* Patient Info */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.mrn}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={getRiskBadgeStyle(patient.riskLevel)}>
                        Risk Score: {patient.riskScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Last check-in: {patient.lastCheckIn}</p>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="lg:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(patient.symptoms)
                      .filter(([key]) => key !== 'newSymptoms')
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">{key}:</span>
                          <div className="flex items-center space-x-1">
                            <span className={getSymptomSeverityStyle(value.level)}>
                              {value.level}
                            </span>
                            <TrendIndicator trend={value.trend} />
                          </div>
                        </div>
                    ))}
                  </div>
                  {patient.symptoms.newSymptoms && (
                    <div className="mt-2 flex items-center space-x-1 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-xs font-medium">New symptoms reported</span>
                    </div>
                  )}
                </div>

                {/* Vitals */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Vitals</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Weight:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{patient.vitals.weight.current}kg</span>
                        <TrendIndicator 
                          trend={patient.vitals.weight.trend} 
                          value={patient.vitals.weight.change}
                          isWeight={true}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">BP:</span>
                      <div className="flex items-center space-x-1">
                        <span className={`text-sm font-medium ${
                          patient.vitals.bp.systolic > 140 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {patient.vitals.bp.systolic}/{patient.vitals.bp.diastolic}
                        </span>
                        <TrendIndicator trend={patient.vitals.bp.trend} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">HR:</span>
                      <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium ${
                          patient.vitals.hr.value > 90 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {patient.vitals.hr.value}
                        </span>
                        <TrendIndicator trend={patient.vitals.hr.trend} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adherence */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Adherence</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Medication:</span>
                      <span className={`text-sm font-medium ${
                        patient.adherence.medication >= 90 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {patient.adherence.medication}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Fluid:</span>
                      <span className={`text-sm font-medium ${
                        patient.adherence.fluid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {patient.adherence.fluid ? 'Adherent' : 'Non-adherent'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Sodium:</span>
                      <span className={`text-sm font-medium ${
                        patient.adherence.sodium ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {patient.adherence.sodium ? 'Adherent' : 'Non-adherent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Titration */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Titration</h4>
                  <div className="space-y-2">
                    <div>
                      <span className={`inline-block ${getRiskBadgeStyle(
                        patient.titration.status === 'poor' ? 'high' :
                        patient.titration.status === 'stable' ? 'low' : 'moderate'
                      )}`}>
                        {patient.titration.status.charAt(0).toUpperCase() + patient.titration.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Side effects: {patient.titration.sideEffects}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {patient.titration.lastUpdate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View History
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">
                  Review Patient
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
     </Suspense>
     </>
  );
}