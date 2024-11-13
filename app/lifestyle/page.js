"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Activity, Droplet, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Suspense } from 'react';
const LifestyleMetrics = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState('P001');

  // Sample patients data
  const patients = {
    P001: {
      name: "John Doe",
      age: 65,
      weeklyData: [
        { day: 'Mon', fluidAdherence: 85, sodiumAdherence: 90, activity: 65 },
        { day: 'Tue', fluidAdherence: 75, sodiumAdherence: 85, activity: 70 },
        { day: 'Wed', fluidAdherence: 90, sodiumAdherence: 95, activity: 60 },
        { day: 'Thu', fluidAdherence: 95, sodiumAdherence: 80, activity: 75 },
        { day: 'Fri', fluidAdherence: 70, sodiumAdherence: 75, activity: 55 },
        { day: 'Sat', fluidAdherence: 80, sodiumAdherence: 85, activity: 50 },
        { day: 'Sun', fluidAdherence: 85, sodiumAdherence: 90, activity: 45 }
      ],
      activityNotes: [
        {
          date: "2024-03-13",
          type: "Walking",
          duration: "20 mins",
          intensity: "Light",
          limitations: "Experienced mild dyspnea after 15 minutes",
          heartRate: "85-95 bpm"
        },
        {
          date: "2024-03-12",
          type: "Stationary Bike",
          duration: "15 mins",
          intensity: "Moderate",
          limitations: "Fatigue required two rest periods",
          heartRate: "90-100 bpm"
        }
      ]
    },
    P002: {
      name: "Jane Smith",
      age: 58,
      weeklyData: [
        { day: 'Mon', fluidAdherence: 95, sodiumAdherence: 95, activity: 75 },
        { day: 'Tue', fluidAdherence: 90, sodiumAdherence: 90, activity: 80 },
        { day: 'Wed', fluidAdherence: 85, sodiumAdherence: 85, activity: 70 },
        { day: 'Thu', fluidAdherence: 90, sodiumAdherence: 90, activity: 75 },
        { day: 'Fri', fluidAdherence: 85, sodiumAdherence: 85, activity: 65 },
        { day: 'Sat', fluidAdherence: 80, sodiumAdherence: 80, activity: 60 },
        { day: 'Sun', fluidAdherence: 85, sodiumAdherence: 85, activity: 65 }
      ],
      activityNotes: [
        {
          date: "2024-03-13",
          type: "Swimming",
          duration: "30 mins",
          intensity: "Moderate",
          limitations: "None reported",
          heartRate: "80-90 bpm"
        },
        {
          date: "2024-03-12",
          type: "Light Yoga",
          duration: "25 mins",
          intensity: "Light",
          limitations: "Minor balance issues",
          heartRate: "75-85 bpm"
        }
      ]
    }
  };

  const getAdherenceStatus = (value) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateWeeklyAverage = (metric) => {
    return Math.round(
      patients[selectedPatient].weeklyData.reduce((acc, day) => acc + day[metric], 0) / 
      patients[selectedPatient].weeklyData.length
    );
  };

  return (
  <>
  <Suspense>

 
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Users className={`h-6 w-6 ${!isSidebarOpen && 'mx-auto'}`} />
          {isSidebarOpen && <span className="font-semibold">Patients</span>}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
        <div className="p-4">
          {Object.entries(patients).map(([id, patient]) => (
            <button
              key={id}
              onClick={() => setSelectedPatient(id)}
              className={`w-full text-left mb-2 p-2 rounded ${
                selectedPatient === id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              {isSidebarOpen ? (
                <div>
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-500">Age: {patient.age}</div>
                </div>
              ) : (
                <div className="text-center font-medium">{patient.name.split(' ').map(n => n[0]).join('')}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{patients[selectedPatient].name}'s Dashboard</h1>
          <p className="text-gray-500">Age: {patients[selectedPatient].age}</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fluid Adherence</CardTitle>
              <Droplet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAdherenceStatus(calculateWeeklyAverage('fluidAdherence'))}`}>
                {calculateWeeklyAverage('fluidAdherence')}%
              </div>
              <p className="text-xs text-muted-foreground">Weekly average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sodium Adherence</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAdherenceStatus(calculateWeeklyAverage('sodiumAdherence'))}`}>
                {calculateWeeklyAverage('sodiumAdherence')}%
              </div>
              <p className="text-xs text-muted-foreground">Weekly average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Physical Activity</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAdherenceStatus(calculateWeeklyAverage('activity'))}`}>
                {calculateWeeklyAverage('activity')}%
              </div>
              <p className="text-xs text-muted-foreground">Weekly target achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Physical Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients[selectedPatient].activityNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{note.type}</h3>
                      <p className="text-sm text-gray-500">{note.date}</p>
                    </div>
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {note.intensity}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {note.duration}
                    </div>
                    <div>
                      <span className="font-medium">Heart Rate:</span> {note.heartRate}
                    </div>
                  </div>
                  {note.limitations && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Limitations:</span>
                      <span className="text-red-600 ml-2">{note.limitations}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patients[selectedPatient].weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fluidAdherence" name="Fluid Adherence" fill="#3b82f6" />
                  <Bar dataKey="sodiumAdherence" name="Sodium Adherence" fill="#eab308" />
                  <Bar dataKey="activity" name="Physical Activity" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </Suspense>
    </>
  );
};

export default LifestyleMetrics;