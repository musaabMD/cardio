"use client"
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, AlertTriangle, User, Heart, Droplets, Activity } from 'lucide-react';
import { Suspense } from 'react';
// Clinical thresholds
const CLINICAL_THRESHOLDS = {
  RAPID_WEIGHT_GAIN: 2, // kg in 5 days
  DAILY_WEIGHT_GAIN: 0.5, // kg per day
  BP_THRESHOLDS: {
    SYSTOLIC: { LOW: 90, HIGH: 130 },
    DIASTOLIC: { LOW: 60, HIGH: 85 }
  },
  HR_THRESHOLDS: {
    BRADYCARDIA: 60,
    TACHYCARDIA: 100
  }
};

// Sample data with symptom progression
const patientsData = {
  "john-doe": {
    name: "John Doe",
    age: 45,
    weightData: [
      { date: '2024-03-01', weight: 70 },
      { date: '2024-03-02', weight: 70.2 },
      { date: '2024-03-03', weight: 70.8 },
      { date: '2024-03-04', weight: 71.5 },
      { date: '2024-03-05', weight: 72.1 },
    ],
    bpData: [
      { date: '2024-03-01', systolic: 122, diastolic: 82, heartRate: 72 },
      { date: '2024-03-02', systolic: 128, diastolic: 84, heartRate: 75 },
      { date: '2024-03-03', systolic: 125, diastolic: 80, heartRate: 68 },
      { date: '2024-03-04', systolic: 130, diastolic: 85, heartRate: 80 },
      { date: '2024-03-05', systolic: 135, diastolic: 88, heartRate: 82 },
    ],
    symptoms: [
      { 
        id: 1, 
        name: 'Shortness of Breath', 
        severity: 'moderate', 
        isNew: true,
        trend: 'worsening',
        history: ['mild', 'moderate'],
        lastReported: '2024-03-05'
      },
      { 
        id: 2, 
        name: 'Ankle Swelling', 
        severity: 'severe', 
        isNew: false,
        trend: 'worsening',
        history: ['mild', 'moderate', 'severe'],
        lastReported: '2024-03-05'
      },
    ]
  },
  // ... [Previous patient data for Jane and Robert remains the same]
};

const VitalsMonitoringDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState("john-doe");
  const vitalsData = patientsData[selectedPatient];

  // Clinical Assessment Functions
  const assessFluidRetention = (weightData) => {
    const dailyChanges = weightData.slice(1).map((day, index) => ({
      date: day.date,
      change: day.weight - weightData[index].weight
    }));
    
    const totalChange = weightData[weightData.length - 1].weight - weightData[0].weight;
    const hasRapidGain = totalChange >= CLINICAL_THRESHOLDS.RAPID_WEIGHT_GAIN;
    const hasDailyGain = dailyChanges.some(day => day.change >= CLINICAL_THRESHOLDS.DAILY_WEIGHT_GAIN);
    
    return {
      hasRapidGain,
      hasDailyGain,
      totalChange,
      dailyChanges
    };
  };

  const assessVitals = (bpData) => {
    const latest = bpData[bpData.length - 1];
    return {
      hypotension: latest.systolic < CLINICAL_THRESHOLDS.BP_THRESHOLDS.SYSTOLIC.LOW,
      hypertension: latest.systolic > CLINICAL_THRESHOLDS.BP_THRESHOLDS.SYSTOLIC.HIGH,
      tachycardia: latest.heartRate > CLINICAL_THRESHOLDS.HR_THRESHOLDS.TACHYCARDIA,
      bradycardia: latest.heartRate < CLINICAL_THRESHOLDS.HR_THRESHOLDS.BRADYCARDIA
    };
  };

  const assessSymptoms = (symptoms) => {
    return {
      newSymptoms: symptoms.filter(s => s.isNew),
      worseningSymptoms: symptoms.filter(s => s.trend === 'worsening'),
      severeSymptoms: symptoms.filter(s => s.severity === 'severe')
    };
  };

  // Get clinical assessments
  const fluidStatus = assessFluidRetention(vitalsData.weightData);
  const vitalsStatus = assessVitals(vitalsData.bpData);
  const symptomsStatus = assessSymptoms(vitalsData.symptoms);

  return (
    <>
    <Suspense>

  
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4 bg-gray-50">
      {/* Patient Selector [Same as before] */}

      {/* Clinical Alerts Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fluid Retention Alert */}
        {fluidStatus.hasRapidGain && (
          <Alert variant="destructive" className="animate-pulse">
            <Droplets className="h-5 w-5" />
            <AlertDescription className="font-semibold">
              Possible Fluid Retention: {fluidStatus.totalChange.toFixed(1)}kg gain in 5 days
              {fluidStatus.hasDailyGain && " (>0.5kg/day)"}
            </AlertDescription>
          </Alert>
        )}

        {/* Cardiac Status Alert */}
        {(vitalsStatus.hypotension || vitalsStatus.tachycardia || vitalsStatus.bradycardia) && (
          <Alert variant="destructive" className="animate-pulse">
            <Heart className="h-5 w-5" />
            <AlertDescription className="font-semibold">
              {vitalsStatus.hypotension && "Hypotension Alert! "}
              {vitalsStatus.tachycardia && "Tachycardia Alert! "}
              {vitalsStatus.bradycardia && "Bradycardia Alert! "}
            </AlertDescription>
          </Alert>
        )}

        {/* Worsening Symptoms Alert */}
        {symptomsStatus.worseningSymptoms.length > 0 && (
          <Alert variant="destructive" className="animate-pulse">
            <Activity className="h-5 w-5" />
            <AlertDescription className="font-semibold">
              {symptomsStatus.worseningSymptoms.length} worsening symptoms detected!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Weight Trends with Fluid Retention Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Weight & Fluid Status
            </div>
            <Badge 
              variant={fluidStatus.hasRapidGain ? "destructive" : "default"}
              className="flex items-center gap-1"
            >
              {fluidStatus.hasRapidGain ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(fluidStatus.totalChange).toFixed(1)} kg
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalsData.weightData}>
                <defs>
                  <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={vitalsData.weightData[0].weight + CLINICAL_THRESHOLDS.RAPID_WEIGHT_GAIN} 
                  label="Fluid Retention Threshold" 
                  stroke="red" 
                  strokeDasharray="3 3" 
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  fill="url(#weightColor)" 
                  name="Weight (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure and Heart Rate with Clinical Thresholds */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Cardiovascular Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsData.bpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {/* Systolic Thresholds */}
                <ReferenceLine 
                  y={CLINICAL_THRESHOLDS.BP_THRESHOLDS.SYSTOLIC.HIGH} 
                  label="Systolic High" 
                  stroke="red" 
                  strokeDasharray="3 3" 
                />
                <ReferenceLine 
                  y={CLINICAL_THRESHOLDS.BP_THRESHOLDS.SYSTOLIC.LOW} 
                  label="Systolic Low" 
                  stroke="orange" 
                  strokeDasharray="3 3" 
                />
                {/* Heart Rate Thresholds */}
                <ReferenceLine 
                  y={CLINICAL_THRESHOLDS.HR_THRESHOLDS.TACHYCARDIA} 
                  label="Tachycardia" 
                  stroke="red" 
                  strokeDasharray="3 3" 
                />
                <ReferenceLine 
                  y={CLINICAL_THRESHOLDS.HR_THRESHOLDS.BRADYCARDIA} 
                  label="Bradycardia" 
                  stroke="orange" 
                  strokeDasharray="3 3" 
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  name="Diastolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  name="Heart Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Symptoms Tracking */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Symptom Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vitalsData.symptoms.map((symptom) => (
              <div 
                key={symptom.id} 
                className={`
                  p-4 border rounded-lg bg-white
                  ${symptom.trend === 'worsening' ? 'border-red-500' : 'border-gray-200'}
                  ${symptom.isNew ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{symptom.name}</span>
                    {symptom.isNew && (
                      <Badge variant="default" className="animate-pulse">New</Badge>
                    )}
                    {symptom.trend === 'worsening' && (
                      <Badge variant="destructive">Worsening</Badge>
                    )}
                  </div>
                  <Badge 
                    variant={
                      symptom.severity === 'severe' ? 'destructive' : 
                      symptom.severity === 'moderate' ? 'default' : 
                      'secondary'
                    }
                    className="capitalize"
                  >
                    {symptom.severity}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Progression: {symptom.history.join(' → ')}
                </div>
                <div className="text-sm text-gray-500">
                  Last reported: {symptom.lastReported}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </Suspense>
    </>
  );
};

// Custom tooltip component [Same as before]
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
       <>
       
       <Suspense>
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
        </Suspense>
        </>
    );
  }
  return null;
};

export default VitalsMonitoringDashboard;