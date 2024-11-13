"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Clock, Filter, Pill, Calendar, Activity, Weight, Heart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from 'react';
const PatientTriageDashboard = () => {
    const [patients, setPatients] = useState([
      {
        id: 1,
        name: "John Doe",
        age: 65,
        diagnosisDate: "2024-01-15",
        gdmtPhase: "Initiation",
        riskLevel: "high",
        lastCheckIn: {
          date: "2024-03-10",
          missedDoses: true,
          weightGain: true,
          symptoms: ["shortness of breath"],
          bp: "110/70",
          medications: [
            { name: "Lisinopril", status: "missed", dose: "10mg" },
            { name: "Metoprolol", status: "taken", dose: "25mg" }
          ]
        }
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 58,
        diagnosisDate: "2023-11-20",
        gdmtPhase: "Optimization",
        riskLevel: "moderate",
        lastCheckIn: {
          date: "2024-03-12",
          missedDoses: false,
          weightGain: false,
          symptoms: [],
          bp: "120/80",
          medications: [
            { name: "Carvedilol", status: "taken", dose: "12.5mg" },
            { name: "Entresto", status: "taken", dose: "24/26mg" }
          ]
        }
      },
      {
        id: 3,
        name: "Robert Brown",
        age: 72,
        diagnosisDate: "2024-02-05",
        gdmtPhase: "Maintenance",
        riskLevel: "high",
        lastCheckIn: {
          date: "2024-03-14",
          missedDoses: true,
          weightGain: false,
          symptoms: ["fatigue"],
          bp: "115/75",
          medications: [
            { name: "Spironolactone", status: "missed", dose: "25mg" },
            { name: "Metoprolol", status: "taken", dose: "50mg" }
          ]
        }
      },
      {
        id: 4,
        name: "Emily White",
        age: 60,
        diagnosisDate: "2023-09-30",
        gdmtPhase: "Optimization",
        riskLevel: "moderate",
        lastCheckIn: {
          date: "2024-03-16",
          missedDoses: false,
          weightGain: true,
          symptoms: ["swelling"],
          bp: "125/80",
          medications: [
            { name: "Entresto", status: "taken", dose: "49/51mg" },
            { name: "Aspirin", status: "taken", dose: "81mg" }
          ]
        }
      },
      {
        id: 5,
        name: "Michael Green",
        age: 67,
        diagnosisDate: "2022-10-10",
        gdmtPhase: "Initiation",
        riskLevel: "high",
        lastCheckIn: {
          date: "2024-03-20",
          missedDoses: true,
          weightGain: true,
          symptoms: ["shortness of breath", "fatigue"],
          bp: "130/85",
          medications: [
            { name: "Carvedilol", status: "missed", dose: "6.25mg" },
            { name: "Hydrochlorothiazide", status: "taken", dose: "12.5mg" }
          ]
        }
      },
      {
        id: 6,
        name: "Linda Davis",
        age: 53,
        diagnosisDate: "2024-01-20",
        gdmtPhase: "Optimization",
        riskLevel: "low",
        lastCheckIn: {
          date: "2024-03-17",
          missedDoses: false,
          weightGain: false,
          symptoms: [],
          bp: "118/78",
          medications: [
            { name: "Lisinopril", status: "taken", dose: "10mg" },
            { name: "Metoprolol", status: "taken", dose: "25mg" }
          ]
        }
      },
      {
        id: 7,
        name: "David Wilson",
        age: 70,
        diagnosisDate: "2023-12-12",
        gdmtPhase: "Maintenance",
        riskLevel: "high",
        lastCheckIn: {
          date: "2024-03-15",
          missedDoses: true,
          weightGain: true,
          symptoms: ["shortness of breath", "swelling"],
          bp: "135/90",
          medications: [
            { name: "Spironolactone", status: "missed", dose: "50mg" },
            { name: "Entresto", status: "taken", dose: "24/26mg" }
          ]
        }
      },
      {
        id: 8,
        name: "Sarah Miller",
        age: 63,
        diagnosisDate: "2023-08-10",
        gdmtPhase: "Initiation",
        riskLevel: "moderate",
        lastCheckIn: {
          date: "2024-03-19",
          missedDoses: false,
          weightGain: true,
          symptoms: ["fatigue"],
          bp: "122/82",
          medications: [
            { name: "Carvedilol", status: "taken", dose: "6.25mg" },
            { name: "Lisinopril", status: "taken", dose: "5mg" }
          ]
        }
      },
      {
        id: 9,
        name: "James Johnson",
        age: 68,
        diagnosisDate: "2024-02-01",
        gdmtPhase: "Optimization",
        riskLevel: "low",
        lastCheckIn: {
          date: "2024-03-11",
          missedDoses: false,
          weightGain: false,
          symptoms: [],
          bp: "119/79",
          medications: [
            { name: "Entresto", status: "taken", dose: "49/51mg" },
            { name: "Aspirin", status: "taken", dose: "81mg" }
          ]
        }
      },
      {
        id: 10,
        name: "Patricia Brown",
        age: 59,
        diagnosisDate: "2023-05-15",
        gdmtPhase: "Maintenance",
        riskLevel: "moderate",
        lastCheckIn: {
          date: "2024-03-13",
          missedDoses: true,
          weightGain: false,
          symptoms: ["swelling"],
          bp: "125/85",
          medications: [
            { name: "Hydrochlorothiazide", status: "missed", dose: "12.5mg" },
            { name: "Carvedilol", status: "taken", dose: "12.5mg" }
          ]
        }
      }
    ]);

  const [selectedRisk, setSelectedRisk] = useState("all");

  const filteredPatients = patients.filter(patient => 
    selectedRisk === "all" || patient.riskLevel === selectedRisk
  );

  const getRiskBadge = (risk) => {
    const styles = {
      high: "bg-red-500 hover:bg-red-600",
      moderate: "bg-yellow-500 hover:bg-yellow-600",
      low: "bg-green-500 hover:bg-green-600"
    };

    return (
      <Badge className={`${styles[risk]} text-white font-medium`}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  const getStatusIcon = (condition) => {
    return condition ? (
      <AlertCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Check className="h-5 w-5 text-green-500" />
    );
  };

  const MedicationStatus = ({ status }) => {
    const styles = {
      taken: "bg-green-100 text-green-800 border-green-300",
      missed: "bg-red-100 text-red-800 border-red-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };

    return (
        <>
        
        <Suspense>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      
      </Suspense>

      </>
    );
  };

  return (

    <>
    
    <Suspense>
        
    <div className="space-y-6 p-6 bg-blue-300 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Patient Triage Dashboard</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="moderate">Moderate Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="relative hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="border-b bg-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{patient.name}</CardTitle>
                  <p className="text-sm text-gray-600">Age: {patient.age}</p>
                </div>
                {getRiskBadge(patient.riskLevel)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm font-medium">Diagnosis Date</p>
                  </div>
                  <p className="text-sm">
                    {new Date(patient.diagnosisDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Activity className="h-4 w-4" />
                    <p className="text-sm font-medium">GDMT Phase</p>
                  </div>
                  <p className="text-sm">{patient.gdmtPhase}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium">Last Check-in:</p>
                  <p className="text-sm text-gray-600">
                    {new Date(patient.lastCheckIn.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Weight className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">
                      Weight: {getStatusIcon(!patient.lastCheckIn.weightGain)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Heart className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">BP: {patient.lastCheckIn.bp}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Pill className="h-4 w-4" />
                    <p className="text-sm font-medium">Medications</p>
                  </div>
                  <div className="grid gap-2">
                    {patient.lastCheckIn.medications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">
                          {med.name} ({med.dose})
                        </span>
                        <MedicationStatus status={med.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {patient.lastCheckIn.symptoms.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      Reported Symptoms: {patient.lastCheckIn.symptoms.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
     </Suspense>
     </>
  );
};

export default PatientTriageDashboard;