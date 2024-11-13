"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { 
  Activity, 
  Heart, 
  Users, 
  TrendingUp,
  Droplet,
  AlertCircle 
} from 'lucide-react';

// Separate LabCard component with ranges passed as prop
const LabCard = ({ title, data, metrics, IconComponent, ranges }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex items-center space-x-2">
        {IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />}
        <CardTitle className="text-lg text-blue-800">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        {metrics.map(metric => (
          <div key={metric} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{ranges[metric].name}</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                data[data.length - 1][metric] < ranges[metric].min || 
                data[data.length - 1][metric] > ranges[metric].max
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {data[data.length - 1][metric]} {ranges[metric].unit}
              </span>
            </div>
            <div className="h-32">
              <BarChart width={300} height={120} data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <ReferenceLine y={ranges[metric].min} stroke="#ef4444" strokeDasharray="3 3" />
                <ReferenceLine y={ranges[metric].max} stroke="#ef4444" strokeDasharray="3 3" />
                <Bar dataKey={metric} fill="#3b82f6" />
              </BarChart>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Normal Range: {ranges[metric].min}-{ranges[metric].max} {ranges[metric].unit}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LabResultsDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Reference ranges and thresholds
  const labRanges = {
    eGFR: { min: 60, max: 120, unit: 'mL/min', name: 'eGFR' },
    BUN: { min: 7, max: 20, unit: 'mg/dL', name: 'Blood Urea Nitrogen' },
    creatinine: { min: 0.7, max: 1.2, unit: 'mg/dL', name: 'Creatinine' },
    potassium: { min: 3.5, max: 5.0, unit: 'mEq/L', name: 'Potassium' },
    sodium: { min: 135, max: 145, unit: 'mEq/L', name: 'Sodium' },
    chloride: { min: 98, max: 106, unit: 'mEq/L', name: 'Chloride' },
    bnp: { min: 0, max: 400, unit: 'pg/mL', name: 'BNP' },
    troponin: { min: 0, max: 0.04, unit: 'ng/mL', name: 'Troponin' },
    hemoglobin: { min: 13.5, max: 17.5, unit: 'g/dL', name: 'Hemoglobin' },
    platelets: { min: 150, max: 450, unit: 'K/µL', name: 'Platelets' },
    wbc: { min: 4.5, max: 11.0, unit: 'K/µL', name: 'White Blood Cells' }
  };

  // Enhanced mock patient data
  const patients = [
    {
      id: 1,
      name: 'John Doe',
      age: 65,
      gender: 'Male',
      status: 'Critical',
      mrn: 'MRN001',
      diagnosis: 'Heart Failure with Reduced Ejection Fraction',
      lastVisit: '2024-03-15',
      nextVisit: '2024-04-15',
      weight: '180 lbs',
      height: "5'10\"",
      bmi: '25.8',
      bloodType: 'A+',
      allergies: ['Penicillin', 'Sulfa'],
      medications: [
        'Lisinopril 10mg daily',
        'Metoprolol 25mg twice daily',
        'Furosemide 40mg daily'
      ],
      vitals: {
        bp: '130/80',
        hr: '72',
        temp: '98.6°F',
        o2sat: '98%'
      },
      labResults: {
        kidney: [
          { date: '2024-01', eGFR: 65, BUN: 18, creatinine: 1.1 },
          { date: '2024-02', eGFR: 62, BUN: 20, creatinine: 1.2 },
          { date: '2024-03', eGFR: 58, BUN: 22, creatinine: 1.3 }
        ],
        electrolytes: [
          { date: '2024-01', potassium: 4.2, sodium: 138, chloride: 101 },
          { date: '2024-02', potassium: 4.5, sodium: 137, chloride: 100 },
          { date: '2024-03', potassium: 4.8, sodium: 136, chloride: 99 }
        ],
        cardiac: [
          { date: '2024-01', bnp: 450, troponin: 0.04 },
          { date: '2024-02', bnp: 520, troponin: 0.05 },
          { date: '2024-03', bnp: 480, troponin: 0.04 }
        ],
        cbc: [
          { date: '2024-01', hemoglobin: 14.2, platelets: 250, wbc: 7.5 },
          { date: '2024-02', hemoglobin: 13.8, platelets: 245, wbc: 7.8 },
          { date: '2024-03', hemoglobin: 13.5, platelets: 240, wbc: 8.0 }
        ]
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 54,
      gender: 'Female',
      status: 'Stable',
      mrn: 'MRN002',
      diagnosis: 'Type 2 Diabetes Mellitus',
      lastVisit: '2024-02-20',
      nextVisit: '2024-05-20',
      weight: '150 lbs',
      height: "5'6\"",
      bmi: '24.2',
      bloodType: 'B+',
      allergies: ['Aspirin'],
      medications: [
        'Metformin 500mg twice daily',
        'Glipizide 5mg daily'
      ],
      vitals: {
        bp: '120/75',
        hr: '70',
        temp: '98.7°F',
        o2sat: '97%'
      },
      labResults: {
        kidney: [
          { date: '2024-01', eGFR: 85, BUN: 15, creatinine: 1.0 },
          { date: '2024-02', eGFR: 80, BUN: 16, creatinine: 1.1 },
          { date: '2024-03', eGFR: 78, BUN: 17, creatinine: 1.1 }
        ],
        electrolytes: [
          { date: '2024-01', potassium: 4.0, sodium: 140, chloride: 102 },
          { date: '2024-02', potassium: 4.3, sodium: 139, chloride: 101 },
          { date: '2024-03', potassium: 4.5, sodium: 138, chloride: 100 }
        ],
        cardiac: [
          { date: '2024-01', bnp: 120, troponin: 0.01 },
          { date: '2024-02', bnp: 130, troponin: 0.02 },
          { date: '2024-03', bnp: 125, troponin: 0.02 }
        ],
        cbc: [
          { date: '2024-01', hemoglobin: 13.5, platelets: 255, wbc: 7.0 },
          { date: '2024-02', hemoglobin: 13.2, platelets: 250, wbc: 7.2 },
          { date: '2024-03', hemoglobin: 13.1, platelets: 248, wbc: 7.3 }
        ]
      }
    },
    {
      id: 3,
      name: 'Alex Brown',
      age: 48,
      gender: 'Male',
      status: 'Fair',
      mrn: 'MRN003',
      diagnosis: 'Chronic Kidney Disease',
      lastVisit: '2024-04-01',
      nextVisit: '2024-07-01',
      weight: '170 lbs',
      height: "5'9\"",
      bmi: '25.1',
      bloodType: 'O-',
      allergies: ['Ibuprofen'],
      medications: [
        'Lisinopril 20mg daily',
        'Amlodipine 10mg daily'
      ],
      vitals: {
        bp: '135/85',
        hr: '68',
        temp: '98.5°F',
        o2sat: '96%'
      },
      labResults: {
        kidney: [
          { date: '2024-01', eGFR: 45, BUN: 30, creatinine: 1.8 },
          { date: '2024-02', eGFR: 42, BUN: 32, creatinine: 1.9 },
          { date: '2024-03', eGFR: 40, BUN: 35, creatinine: 2.0 }
        ],
        electrolytes: [
          { date: '2024-01', potassium: 4.1, sodium: 139, chloride: 100 },
          { date: '2024-02', potassium: 4.4, sodium: 138, chloride: 99 },
          { date: '2024-03', potassium: 4.6, sodium: 137, chloride: 98 }
        ],
        cardiac: [
          { date: '2024-01', bnp: 150, troponin: 0.02 },
          { date: '2024-02', bnp: 160, troponin: 0.03 },
          { date: '2024-03', bnp: 158, troponin: 0.03 }
        ],
        cbc: [
          { date: '2024-01', hemoglobin: 12.5, platelets: 245, wbc: 6.5 },
          { date: '2024-02', hemoglobin: 12.2, platelets: 240, wbc: 6.8 },
          { date: '2024-03', hemoglobin: 12.0, platelets: 238, wbc: 7.0 }
        ]
      }
    },
    {
      id: 4,
      name: 'Sara Lee',
      age: 60,
      gender: 'Female',
      status: 'Good',
      mrn: 'MRN004',
      diagnosis: 'Hypertension',
      lastVisit: '2024-01-10',
      nextVisit: '2024-04-10',
      weight: '160 lbs',
      height: "5'7\"",
      bmi: '25.1',
      bloodType: 'AB+',
      allergies: ['None'],
      medications: [
        'Hydrochlorothiazide 25mg daily',
        'Losartan 50mg daily'
      ],
      vitals: {
        bp: '125/80',
        hr: '70',
        temp: '98.6°F',
        o2sat: '99%'
      },
      labResults: {
        kidney: [
          { date: '2024-01', eGFR: 70, BUN: 19, creatinine: 1.1 },
          { date: '2024-02', eGFR: 68, BUN: 18, creatinine: 1.1 },
          { date: '2024-03', eGFR: 66, BUN: 19, creatinine: 1.2 }
        ],
        electrolytes: [
          { date: '2024-01', potassium: 4.0, sodium: 139, chloride: 100 },
          { date: '2024-02', potassium: 4.1, sodium: 140, chloride: 101 },
          { date: '2024-03', potassium: 4.2, sodium: 138, chloride: 99 }
        ],
        cardiac: [
          { date: '2024-01', bnp: 110, troponin: 0.01 },
          { date: '2024-02', bnp: 115, troponin: 0.02 },
          { date: '2024-03', bnp: 118, troponin: 0.01 }
        ],
        cbc: [
          { date: '2024-01', hemoglobin: 13.8, platelets: 240, wbc: 6.8 },
          { date: '2024-02', hemoglobin: 13.6, platelets: 235, wbc: 6.9 },
          { date: '2024-03', hemoglobin: 13.5, platelets: 230, wbc: 7.0 }
        ]
      }
    }
  ];
  

  useEffect(() => {
    setMounted(true);
    setSelectedPatient(patients[0]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800',
      'Stable': 'bg-green-100 text-green-800',
      'Improving': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!mounted || !selectedPatient) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Patient Navigation */}
      <div className="w-72 bg-white shadow-lg">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-white text-xl font-bold">Heart Failure Clinic</h2>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Patients</span>
          </div>
          
          <div className="space-y-3">
            {patients.map(patient => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPatient.id === patient.id
                    ? 'bg-blue-100 shadow-md'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  <div>MRN: {patient.mrn}</div>
                  <div>Age: {patient.age} | {patient.gender}</div>
                  <div>Weight: {patient.weight}</div>
                  <div>Height: {patient.height}</div>
                  <div>BMI: {patient.bmi}</div>
                  <div>Blood Type: {patient.bloodType}</div>
                </div>
                <div className={`mt-2 px-2 py-1 rounded-full text-sm inline-block ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Header with Vitals */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h1>
                <p className="text-gray-600 mt-1">{selectedPatient.diagnosis}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Height: {selectedPatient.height} | Weight: {selectedPatient.weight} | BMI: {selectedPatient.bmi}
                  <br />
                  Blood Type: {selectedPatient.bloodType}
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700">Allergies:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Current Vitals:</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">Blood Pressure</div>
                      <div className="text-lg font-medium">{selectedPatient.vitals.bp}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">Heart Rate</div>
                      <div className="text-lg font-medium">{selectedPatient.vitals.hr} bpm</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="text-lg font-medium">{selectedPatient.vitals.temp}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">O2 Saturation</div>
                      <div className="text-lg font-medium">{selectedPatient.vitals.o2sat}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Current Medications:</h3>
                  <ul className="mt-2 space-y-1">
                    {selectedPatient.medications.map((med, index) => (
                      <li key={index} className="text-sm text-gray-600">• {med}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LabCard 
              title="Kidney Function"
              data={selectedPatient.labResults.kidney}
              metrics={['eGFR', 'BUN', 'creatinine']}
              IconComponent={Droplet}
              ranges={labRanges}
            />
            
            <LabCard
              title="Electrolytes"
              data={selectedPatient.labResults.electrolytes}
              metrics={['potassium', 'sodium', 'chloride']}
              IconComponent={Activity}
              ranges={labRanges}
            />
            
            <LabCard
              title="Cardiac Markers"
              data={selectedPatient.labResults.cardiac}
              metrics={['bnp', 'troponin']}
              IconComponent={Heart}
              ranges={labRanges}
            />

            {/* CBC Results */}
            <LabCard
              title="Complete Blood Count"
              data={selectedPatient.labResults.cbc}
              metrics={['hemoglobin', 'platelets', 'wbc']}
              IconComponent={Activity}
              ranges={labRanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsDashboard;