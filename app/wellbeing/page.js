"use client"
import React, { Suspense, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Activity, Brain, Users, Calendar, TrendingUp, Heart, Clock, Home, Coffee, Moon, Sun, Utensils, Smile, MessageCircle, Phone, Mail } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
const DetailedQoLDashboard = () => {
  // Mock data for patients
  const patientsData = {
    1: {
      id: 1,
      name: "John Doe",
      age: 65,
      risk: "High",
      lastVisit: "2024-03-15",
      contact: { phone: "555-0123", email: "john.doe@email.com" },
      emergencyContact: "Mary Doe (Wife) - 555-0124",
      primaryCare: "Dr. Smith",
      currentMetrics: {
        overall: 3.9,
        mental: 3.5,
        social: 4.2,
        physical: 4.0
      },
      trends: [
        { month: 'Jan', aggregated: 3.8, activities: 4.0, mental: 3.5, social: 4.0, sleep: 3.8, nutrition: 3.6 },
        { month: 'Feb', aggregated: 3.2, activities: 3.0, mental: 3.0, social: 3.5, sleep: 3.2, nutrition: 3.4 },
        { month: 'Mar', aggregated: 3.5, activities: 3.5, mental: 3.5, social: 3.5, sleep: 3.6, nutrition: 3.7 }
      ],
      radarData: [
        { metric: 'Daily Activities', value: 4.0, fullMark: 5 },
        { metric: 'Mental Health', value: 3.0, fullMark: 5 },
        { metric: 'Social Support', value: 4.2, fullMark: 5 },
        { metric: 'Sleep Quality', value: 3.5, fullMark: 5 },
        { metric: 'Nutrition', value: 3.6, fullMark: 5 },
        { metric: 'Emotional', value: 3.2, fullMark: 5 }
      ],
      mentalHealthNotes: [
        { date: '2024-03-20', type: 'Anxiety', severity: 'Mild', notes: 'Related to upcoming medical appointment', followUp: 'Scheduled counseling session' },
        { date: '2024-03-15', type: 'Depression', severity: 'Moderate', notes: 'Feeling isolated from family', followUp: 'Increased social activities recommended' }
      ]
    },
    2: {
      id: 2,
      name: "Jane Smith",
      age: 58,
      risk: "Medium",
      lastVisit: "2024-03-18",
      contact: { phone: "555-0125", email: "jane.smith@email.com" },
      emergencyContact: "Tom Smith (Son) - 555-0126",
      primaryCare: "Dr. Johnson",
      currentMetrics: {
        overall: 4.2,
        mental: 4.0,
        social: 4.5,
        physical: 4.1
      },
      trends: [
        { month: 'Jan', aggregated: 4.1, activities: 4.2, mental: 4.0, social: 4.3, sleep: 4.0, nutrition: 4.2 },
        { month: 'Feb', aggregated: 4.2, activities: 4.3, mental: 4.1, social: 4.4, sleep: 4.1, nutrition: 4.3 },
        { month: 'Mar', aggregated: 4.2, activities: 4.2, mental: 4.0, social: 4.5, sleep: 4.2, nutrition: 4.1 }
      ],
      radarData: [
        { metric: 'Daily Activities', value: 4.2, fullMark: 5 },
        { metric: 'Mental Health', value: 4.0, fullMark: 5 },
        { metric: 'Social Support', value: 4.5, fullMark: 5 },
        { metric: 'Sleep Quality', value: 4.1, fullMark: 5 },
        { metric: 'Nutrition', value: 4.3, fullMark: 5 },
        { metric: 'Emotional', value: 4.0, fullMark: 5 }
      ],
      mentalHealthNotes: [
        { date: '2024-03-19', type: 'Stress', severity: 'Low', notes: 'Work-related stress', followUp: 'Recommended stress management techniques' }
      ]
    }
  };

  const [selectedPatient, setSelectedPatient] = useState(patientsData[1]);

  const getColorForRisk = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (

    <>
    
    <Suspense>
    <div className="flex h-screen bg-gray-50">
      {/* Patient Navigation Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-xl font-bold">Patient Dashboard</h2>
          <p className="text-sm opacity-80">Quality of Life Monitoring</p>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full p-2 border rounded-lg mb-4"
          />
          {Object.values(patientsData).map(patient => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 rounded-lg mb-3 cursor-pointer transition-all border ${
                selectedPatient.id === patient.id
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="font-medium text-gray-800">{patient.name}</div>
              <div className="text-sm text-gray-500">Age: {patient.age}</div>
              <div className={`text-sm mt-1 px-2 py-1 rounded-full inline-block ${getColorForRisk(patient.risk)}`}>
                {patient.risk} Risk
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Patient Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedPatient.name}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Last Visit: {selectedPatient.lastVisit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>{selectedPatient.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{selectedPatient.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-500" />
                  <span>Dr. {selectedPatient.primaryCare}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <select className="border rounded-lg p-2 bg-white shadow-sm">
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>Last month</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Overall QoL Score</p>
                  <p className="text-3xl font-bold">{selectedPatient.currentMetrics.overall}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Mental Health</p>
                  <p className="text-3xl font-bold">{selectedPatient.currentMetrics.mental}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Social Support</p>
                  <p className="text-3xl font-bold">{selectedPatient.currentMetrics.social}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Physical Health</p>
                  <p className="text-3xl font-bold">{selectedPatient.currentMetrics.physical}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>QoL Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedPatient.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="aggregated" stroke="#2563eb" name="Overall" strokeWidth={2} />
                    <Line type="monotone" dataKey="activities" stroke="#16a34a" name="Activities" />
                    <Line type="monotone" dataKey="mental" stroke="#9333ea" name="Mental" />
                    <Line type="monotone" dataKey="social" stroke="#ea580c" name="Social" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>QoL Components Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={selectedPatient.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Current Scores" dataKey="value" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mental Health Notes */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="text-red-500" />
              Mental Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPatient.mentalHealthNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-red-700">{note.type} - {note.severity}</h3>
                      <p className="text-gray-700 mt-1">{note.notes}</p>
                      <p className="text-gray-600 mt-2">Follow-up: {note.followUp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{note.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      </Suspense>
      </>
  );
};

export default DetailedQoLDashboard;