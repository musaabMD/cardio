'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Heart, AlertTriangle, Plus, Activity, Clock } from 'lucide-react';
// Dynamically import charts to prevent hydration issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

// Initial data
const INITIAL_MEDICATIONS = [
  {
    id: 1,
    medication_name: 'Lisinopril (ACE Inhibitor)',
    dosage: '10mg',
    frequency: 'Once daily',
    current_phase: 'Titration',
    target_dosage: '20mg',
    titrationProgress: 75,
  },
  {
    id: 2,
    medication_name: 'Carvedilol (Beta Blocker)',
    dosage: '12.5mg',
    frequency: 'Twice daily',
    current_phase: 'Titration',
    target_dosage: '25mg',
    titrationProgress: 50,
  }
];

const INITIAL_VITALS = {
  systolic: 120,
  diastolic: 80,
  weight: 80
};

// Chart Component
const ChartComponent = ({ data }) => {
  const [width, setWidth] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      setWidth(chartRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setWidth(chartRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (

    <div ref={chartRef} className="w-full h-[400px]">
      <LineChart 
        width={width || 600} 
        height={400} 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          yAxisId="left" 
          domain={[60, 200]} 
          label={{ value: 'Blood Pressure (mmHg)', angle: -90, position: 'insideLeft', offset: -5 }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[40, 120]} 
          label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', offset: 10 }}
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'Weight') return [`${value} kg`, 'Weight'];
            return [`${value} mmHg`, name];
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="systolic" 
          stroke="#ef4444" 
          name="Systolic BP" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="diastolic" 
          stroke="#3b82f6" 
          name="Diastolic BP" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="weight" 
          stroke="#10b981" 
          name="Weight" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  
  );
};

// Main Component
export default function MedicationTracker() {
  const [isClient, setIsClient] = useState(false);
  const [adherenceRecords, setAdherenceRecords] = useState([]);
  const [medications] = useState(INITIAL_MEDICATIONS);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [notification, setNotification] = useState(null);
  const [vitals, setVitals] = useState(INITIAL_VITALS);

  // Initialize data on client-side
  useEffect(() => {
    setIsClient(true);
    // Generate 7 days of dummy data
    const dummyData = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        id: index + 1,
        medication_id: 1,
        taken_at: date.toISOString(),
        was_taken: Math.random() > 0.2,
        systolic: 120 + Math.floor(Math.random() * 20),
        diastolic: 75 + Math.floor(Math.random() * 15),
        weight: 80 + Math.floor(Math.random() * 5),
        notes: 'Daily record'
      };
    });
    setAdherenceRecords(dummyData);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getAdherenceData = () => {
    if (adherenceRecords.length === 0) return [];

    // Aggregate data by date
    const dates = [...new Set(adherenceRecords.map(record => 
      new Date(record.taken_at).toLocaleDateString()
    ))];

    return dates.map(date => {
      const dayRecords = adherenceRecords.filter(record => 
        new Date(record.taken_at).toLocaleDateString() === date
      );

      return {
        date,
        systolic: dayRecords[0]?.systolic || 0,
        diastolic: dayRecords[0]?.diastolic || 0,
        weight: dayRecords[0]?.weight || 0
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Heart className="w-10 h-10 text-red-500 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">Heart Failure Medication Tracker</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Charts Section */}
          {isClient && adherenceRecords.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Activity className="w-8 h-8 text-blue-500 mr-2" />
                Blood Pressure & Weight Trends
              </h2>
              <div className="mt-4">
                <ChartComponent data={getAdherenceData()} />
              </div>
              
              {/* Summary Statistics */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Systolic BP</p>
                  <p className="text-2xl font-bold text-red-700">
                    {Math.round(adherenceRecords[adherenceRecords.length - 1]?.systolic || 0)}
                    <span className="text-sm font-normal ml-1">mmHg</span>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Diastolic BP</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {Math.round(adherenceRecords[adherenceRecords.length - 1]?.diastolic || 0)}
                    <span className="text-sm font-normal ml-1">mmHg</span>
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Weight</p>
                  <p className="text-2xl font-bold text-green-700">
                    {Math.round(adherenceRecords[adherenceRecords.length - 1]?.weight || 0)}
                    <span className="text-sm font-normal ml-1">kg</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Medication Titration Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Plus className="w-8 h-8 text-green-500 mr-2" />
              Medication Titration Progress
            </h2>
            {medications.map(med => (
              <div key={med.id} className="mb-8 last:mb-0">
                <h3 className="font-medium text-xl text-gray-700 mb-3">{med.medication_name}</h3>
                <div className="relative mb-4">
                  <div className="h-4 bg-gray-200 rounded-full">
                    <div 
                      className="h-4 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${med.titrationProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm font-medium">
                    <span>Starting Dose</span>
                    <span>Current: {med.dosage}</span>
                    <span>Target: {med.target_dosage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Record New Dose Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 col-span-2">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="w-8 h-8 text-purple-500 mr-2" />
              Record Medication Dose
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newRecord = {
                id: Date.now(),
                medication_id: parseInt(selectedMedication),
                taken_at: new Date().toISOString(),
                was_taken: true,
                notes: e.target.notes.value,
                systolic: vitals.systolic,
                diastolic: vitals.diastolic,
                weight: vitals.weight
              };
              setAdherenceRecords(prev => [...prev, newRecord]);
              showNotification('Dose recorded successfully!');
              e.target.reset();
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-lg font-medium text-gray-700 mb-2">Medication</label>
                  <select 
                    className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedMedication}
                    onChange={(e) => setSelectedMedication(e.target.value)}
                    required
                  >
                    <option value="">Select Medication</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.medication_name} - {med.dosage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vitals Sliders */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Systolic BP: {vitals.systolic} mmHg
                    </label>
                    <input 
                      type="range" 
                      min="90" 
                      max="200" 
                      value={vitals.systolic}
                      onChange={(e) => setVitals(prev => ({ ...prev, systolic: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Diastolic BP: {vitals.diastolic} mmHg
                    </label>
                    <input 
                      type="range" 
                      min="60" 
                      max="120" 
                      value={vitals.diastolic}
                      onChange={(e) => setVitals(prev => ({ ...prev, diastolic: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Weight: {vitals.weight} kg
                    </label>
                    <input 
                      type="range" 
                      min="40" 
                      max="120" 
                      value={vitals.weight}
                      onChange={(e) => setVitals(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-lg font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    name="notes"
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  ></textarea>
                </div>

                <div className="col-span-2">
                <button 
                    type="submit"
                    className="w-full bg-green-500 text-white text-xl font-semibold px-6 py-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <Heart className="w-6 h-6 mr-2" />
                    Record Dose & Vitals
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white text-lg font-medium z-50 animate-fade-in-up`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
     
  );
}

// Optional: Add these animations to your tailwind.config.js
/*
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out'
      }
    },
  },
  // ... rest of your config
}
*/
