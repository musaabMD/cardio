"use client"
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
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
          },
          // ... more modules
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
          { date: '2024-03-16', severity: 2, reported: true },
          // ... more dates
        ]
      }
    },
    'Jane Smith': {
      chatbotInteractions: [
        { 
          week: 'Week 1',
          symptomReports: 5,
          educationCompleted: 3,
          questionsAsked: 6,
          adherenceRate: 88
        },
        // ... more weeks
      ],
      educationModules: {
        completed: [
          {
            name: 'GDMT Basics',
            completionDate: '2024-04-01',
            score: 80,
            timeSpent: '40 mins'
          },
          {
            name: 'Medication Management',
            completionDate: '2024-04-05',
            score: 78,
            timeSpent: '35 mins'
          }
        ],
        inProgress: [
          {
            name: 'Exercise & Heart Health',
            progress: 50,
            lastAccessed: '2024-04-10'
          }
        ]
      },
      metrics: {
        overallEngagement: 82,
        symptomReportingRate: 90,
        educationCompletion: 74,
        chatbotResponseRate: 89,
        knowledgeImprovement: 35,
        lastSymptomReport: '5 hours ago',
        criticalAlerts: 1
      },
      symptoms: {
        trends: [
          { date: '2024-04-01', severity: 3, reported: true },
          { date: '2024-04-02', severity: 4, reported: true },
          // ... more dates
        ]
      }
    },
    'Robert Brown': {
      chatbotInteractions: [
        { 
          week: 'Week 1',
          symptomReports: 6,
          educationCompleted: 4,
          questionsAsked: 3,
          adherenceRate: 82
        },
        // ... more weeks
      ],
      educationModules: {
        completed: [
          {
            name: 'Symptom Recognition',
            completionDate: '2024-05-10',
            score: 75,
            timeSpent: '25 mins'
          },
          {
            name: 'Diet & Nutrition',
            completionDate: '2024-05-12',
            score: 82,
            timeSpent: '40 mins'
          }
        ],
        inProgress: [
          {
            name: 'Heart Failure Basics',
            progress: 30,
            lastAccessed: '2024-05-15'
          }
        ]
      },
      metrics: {
        overallEngagement: 78,
        symptomReportingRate: 85,
        educationCompletion: 70,
        chatbotResponseRate: 88,
        knowledgeImprovement: 28,
        lastSymptomReport: '8 hours ago',
        criticalAlerts: 2
      },
      symptoms: {
        trends: [
          { date: '2024-05-10', severity: 2, reported: true },
          { date: '2024-05-11', severity: 3, reported: true },
          // ... more dates
        ]
      }
    },
    'Emily Davis': {
      chatbotInteractions: [
        { 
          week: 'Week 1',
          symptomReports: 8,
          educationCompleted: 6,
          questionsAsked: 7,
          adherenceRate: 90
        },
        // ... more weeks
      ],
      educationModules: {
        completed: [
          {
            name: 'GDMT Basics',
            completionDate: '2024-06-05',
            score: 95,
            timeSpent: '50 mins'
          },
          {
            name: 'Exercise & Heart Health',
            completionDate: '2024-06-08',
            score: 88,
            timeSpent: '45 mins'
          }
        ],
        inProgress: [
          {
            name: 'Medication Management',
            progress: 70,
            lastAccessed: '2024-06-10'
          }
        ]
      },
      metrics: {
        overallEngagement: 89,
        symptomReportingRate: 93,
        educationCompletion: 84,
        chatbotResponseRate: 96,
        knowledgeImprovement: 45,
        lastSymptomReport: '3 hours ago',
        criticalAlerts: 0
      },
      symptoms: {
        trends: [
          { date: '2024-06-05', severity: 1, reported: true },
          { date: '2024-06-06', severity: 3, reported: true },
          // ... more dates
        ]
      }
    }
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
                {selectedPatient}'s Heart Failure Education Dashboard
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
  );
};

export default Dashboard;