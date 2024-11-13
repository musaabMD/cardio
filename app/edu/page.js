"use client";
import React, { useState, Suspense } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  MessageSquare, Heart, Brain, Activity, 
  ThumbsUp, AlertCircle, Stethoscope 
} from 'lucide-react';

// Sample data structure for heart failure patients
const patientsData = {
  'John Doe': {
    chatbotInteractions: [
      { 
        week: 'Week 1',
        symptomReports: 7,
        educationCompleted: 5,
        questionsAsked: 4,
        adherenceRate: 85
      },
      // ... more weeks
    ],
    educationModules: {
      completed: [
        {
          name: 'GDMT Basics',
          completionDate: '2024-03-15',
          score: 90,
          timeSpent: '45 mins'
        },
        {
          name: 'Symptom Recognition',
          completionDate: '2024-03-18',
          score: 85,
          timeSpent: '30 mins'
        }
      ],
      inProgress: [
        {
          name: 'Diet & Nutrition',
          progress: 60,
          lastAccessed: '2024-03-20'
        }
      ]
    },
    metrics: {
      overallEngagement: 85,
      symptomReportingRate: 92,
      educationCompletion: 78,
      chatbotResponseRate: 95,
      knowledgeImprovement: 40,
      lastSymptomReport: '2 hours ago',
      criticalAlerts: 0
    },
    symptoms: {
      trends: [
        { date: '2024-03-15', severity: 3, reported: true },
        { date: '2024-03-16', severity: 2, reported: true }
      ]
    }
  }
  // ... additional patient data
};

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState('John Doe');
  const patientData = patientsData[selectedPatient];

  const StatCard = ({ icon: Icon, title, value, subtext, color = 'blue' }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`text-${color}-500`} size={20} />
        <h3 className="text-gray-600 font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
  );

  const EducationModule = ({ module, status }) => (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-gray-800">{module.name}</h4>
          {status === 'completed' ? (
            <p className="text-sm text-gray-500">
              Completed on {module.completionDate} • Score: {module.score}%
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              {module.progress}% complete • Last accessed {module.lastAccessed}
            </p>
          )}
        </div>
        {status === 'completed' && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Completed
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Suspense>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">HF Patients</h2>
          <nav>
            {Object.keys(patientsData).map(name => (
              <button
                key={name}
                onClick={() => setSelectedPatient(name)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                  selectedPatient === name 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPatient}&apos;s Heart Failure Education Dashboard
                </h1>
                <p className="text-gray-500">
                  Last symptom report: {patientData.metrics.lastSymptomReport}
                </p>
              </div>
              {patientData.metrics.criticalAlerts > 0 && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{patientData.metrics.criticalAlerts} Critical Alerts</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Activity}
              title="Overall Engagement"
              value={`${patientData.metrics.overallEngagement}%`}
              subtext="Based on all interactions"
              color="blue"
            />
            <StatCard
              icon={Heart}
              title="Symptom Reporting"
              value={`${patientData.metrics.symptomReportingRate}%`}
              subtext="Response to daily checks"
              color="red"
            />
            <StatCard
              icon={Brain}
              title="Knowledge Improvement"
              value={`+${patientData.metrics.knowledgeImprovement}%`}
              subtext="Since enrollment"
              color="green"
            />
            <StatCard
              icon={MessageSquare}
              title="Chatbot Response Rate"
              value={`${patientData.metrics.chatbotResponseRate}%`}
              subtext="Messages answered"
              color="purple"
            />
          </div>

          {/* Education Progress and Chatbot Interaction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education Modules */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope size={20} className="text-blue-500" />
                Education Progress
              </h2>
              <div className="space-y-4">
                {patientData.educationModules.completed.map((module, index) => (
                  <EducationModule 
                    key={index} 
                    module={module} 
                    status="completed" 
                  />
                ))}
                {patientData.educationModules.inProgress.map((module, index) => (
                  <EducationModule 
                    key={index} 
                    module={module} 
                    status="inProgress" 
                  />
                ))}
              </div>
            </div>

            {/* Interaction Trends */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ThumbsUp size={20} className="text-blue-500" />
                Weekly Engagement Trends
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientData.chatbotInteractions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="symptomReports" 
                      stroke="#EF4444" 
                      name="Symptom Reports"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="educationCompleted" 
                      stroke="#3B82F6" 
                      name="Education Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="adherenceRate" 
                      stroke="#10B981" 
                      name="Adherence Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;
