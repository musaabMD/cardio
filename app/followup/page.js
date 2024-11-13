"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, Calendar, ChevronRight, UserCircle, AlertCircle } from 'lucide-react';

const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    riskLevel: "medium",
    alerts: [
      { id: 1, message: "Missed last medication dose", severity: "medium" }
    ],
    interventions: [
      { 
        id: 1, 
        date: "2024-03-15",
        type: "Medication Adjustment",
        notes: "Increased dosage of medication A from 10mg to 15mg",
        provider: "Dr. Smith"
      },
      {
        id: 2,
        date: "2024-03-10",
        type: "Blood Test",
        notes: "Comprehensive metabolic panel completed",
        provider: "Lab Tech Johnson"
      }
    ],
    upcomingFollowUps: [
      {
        id: 1,
        date: "2024-03-25",
        type: "Follow-up Call",
        provider: "Nurse Williams"
      }
    ]
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 62,
    riskLevel: "low",
    alerts: [],
    interventions: [
      {
        id: 1,
        date: "2024-03-18",
        type: "Patient Education",
        notes: "Completed diabetes management session",
        provider: "Nurse Edwards"
      }
    ],
    upcomingFollowUps: []
  },
  {
    id: "P003",
    name: "Robert Brown",
    age: 71,
    riskLevel: "high",
    alerts: [
      { id: 1, message: "Irregular heartbeat detected", severity: "high" },
      { id: 2, message: "Blood pressure above threshold", severity: "high" }
    ],
    interventions: [
      {
        id: 1,
        date: "2024-03-20",
        type: "Specialist Referral",
        notes: "Referred to cardiologist due to irregular heartbeat",
        provider: "Dr. Anderson"
      }
    ],
    upcomingFollowUps: [
      {
        id: 1,
        date: "2024-03-22",
        type: "Urgent Review",
        provider: "Dr. Anderson"
      }
    ]
  }
];

const PatientMonitoringDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Patient List Sidebar */}
      <div className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Patients</h2>
        </div>
        <div className="divide-y">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedPatient.id === patient.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">Age: {patient.age}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getRiskColor(patient.riskLevel)}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Patient Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{selectedPatient.name}</h1>
              <p className="text-gray-500">Patient ID: {selectedPatient.id}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-white ${getRiskColor(selectedPatient.riskLevel)}`}>
              {selectedPatient.riskLevel.toUpperCase()} RISK
            </div>
          </div>

          {/* Alerts Section */}
          {selectedPatient.alerts.length > 0 && (
            <div className="space-y-3">
              {selectedPatient.alerts.map((alert) => (
                <Alert key={alert.id} className={`border ${getSeverityColor(alert.severity)}`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Recent Interventions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Recent Interventions</h2>
              </div>
              <div className="space-y-4">
                {selectedPatient.interventions.map((intervention) => (
                  <div key={intervention.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{intervention.type}</h3>
                        <p className="text-sm text-gray-600 mt-1">{intervention.notes}</p>
                        <p className="text-sm text-gray-500 mt-2">Provider: {intervention.provider}</p>
                      </div>
                      <span className="text-sm text-gray-500">{intervention.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Follow-ups */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Upcoming Follow-ups</h2>
              </div>
              {selectedPatient.upcomingFollowUps.length > 0 ? (
                <div className="space-y-4">
                  {selectedPatient.upcomingFollowUps.map((followUp) => (
                    <div key={followUp.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{followUp.type}</h3>
                          <p className="text-sm text-gray-500 mt-1">Provider: {followUp.provider}</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{followUp.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming follow-ups scheduled</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientMonitoringDashboard;