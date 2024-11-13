"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskHeatMap = ({ patients }) => {
  const getColor = (risk) => {
    if (risk >= 75) return 'bg-red-500';
    if (risk >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {patients.map((patient, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg ${getColor(patient.riskScore)} text-white`}
        >
          <div className="text-sm font-medium">Patient {patient.id}</div>
          <div className="text-lg font-bold">{patient.riskScore}%</div>
          <div className="text-xs">
            Adherence: {patient.adherence}%
            <br />
            Symptoms: {patient.symptoms}
          </div>
        </div>
      ))}
    </div>
  );
};

const TrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="adherence" stroke="#8884d8" name="Adherence %" />
      <Line type="monotone" dataKey="symptoms" stroke="#82ca9d" name="Symptom Score" />
    </LineChart>
  </ResponsiveContainer>
);

const ComparisonChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="patientId" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="adherence" fill="#8884d8" name="Adherence %" />
      <Bar dataKey="symptoms" fill="#82ca9d" name="Symptom Score" />
    </BarChart>
  </ResponsiveContainer>
);

const AnalyticsDashboard = () => {
  const [filterCriteria, setFilterCriteria] = useState('all');
  
  // Sample data - replace with your actual data
  const allPatients = [
    { id: 1, riskScore: 80, adherence: 65, symptoms: 'High', trends: [
      { date: 'Jan', adherence: 70, symptoms: 3 },
      { date: 'Feb', adherence: 65, symptoms: 3 },
      { date: 'Mar', adherence: 60, symptoms: 4 },
      { date: 'Apr', adherence: 65, symptoms: 3 },
    ]},
    { id: 2, riskScore: 45, adherence: 85, symptoms: 'Low', trends: [
      { date: 'Jan', adherence: 80, symptoms: 1 },
      { date: 'Feb', adherence: 85, symptoms: 1 },
      { date: 'Mar', adherence: 90, symptoms: 1 },
      { date: 'Apr', adherence: 85, symptoms: 1 },
    ]},
    { id: 3, riskScore: 30, adherence: 95, symptoms: 'Low', trends: [
      { date: 'Jan', adherence: 90, symptoms: 1 },
      { date: 'Feb', adherence: 95, symptoms: 1 },
      { date: 'Mar', adherence: 95, symptoms: 1 },
      { date: 'Apr', adherence: 95, symptoms: 1 },
    ]},
    { id: 4, riskScore: 70, adherence: 70, symptoms: 'Medium', trends: [
      { date: 'Jan', adherence: 75, symptoms: 2 },
      { date: 'Feb', adherence: 70, symptoms: 2 },
      { date: 'Mar', adherence: 70, symptoms: 2 },
      { date: 'Apr', adherence: 70, symptoms: 2 },
    ]},
    { id: 5, riskScore: 90, adherence: 50, symptoms: 'High', trends: [
      { date: 'Jan', adherence: 60, symptoms: 4 },
      { date: 'Feb', adherence: 55, symptoms: 4 },
      { date: 'Mar', adherence: 50, symptoms: 5 },
      { date: 'Apr', adherence: 50, symptoms: 4 },
    ]},
  ];

  // Filter patients based on criteria
  const filteredPatients = useMemo(() => {
    switch (filterCriteria) {
      case 'high-risk':
        return allPatients.filter(p => p.riskScore >= 75);
      case 'low-adherence':
        return allPatients.filter(p => p.adherence < 70);
      default:
        return allPatients;
    }
  }, [filterCriteria]);

  // Calculate aggregated trend data based on filtered patients
  const aggregatedTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    return months.map(month => {
      const monthData = {
        date: month,
        adherence: 0,
        symptoms: 0
      };
      
      filteredPatients.forEach(patient => {
        const trend = patient.trends.find(t => t.date === month);
        monthData.adherence += trend.adherence;
        monthData.symptoms += trend.symptoms;
      });

      // Calculate averages
      monthData.adherence = Math.round(monthData.adherence / filteredPatients.length);
      monthData.symptoms = +(monthData.symptoms / filteredPatients.length).toFixed(1);
      
      return monthData;
    });
  }, [filteredPatients]);

  // Prepare comparison data
  const comparisonData = useMemo(() => 
    filteredPatients.map(p => ({
      patientId: `P${p.id}`,
      adherence: p.adherence,
      symptoms: parseInt(p.symptoms === 'High' ? '3' : p.symptoms === 'Medium' ? '2' : '1'),
    }))
  , [filteredPatients]);

  return (
    <>
    <Suspense>

    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Analytics Dashboard</h1>
        <Select value={filterCriteria} onValueChange={setFilterCriteria}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="high-risk">High Risk</SelectItem>
            <SelectItem value="low-adherence">Low Adherence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Risk Stratification Heat Map 
            {filterCriteria !== 'all' && (
              <span className="text-sm font-normal ml-2">
                ({filteredPatients.length} patients)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiskHeatMap patients={filteredPatients} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adherence & Symptom Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={aggregatedTrendData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonChart data={comparisonData} />
        </CardContent>
      </Card>
    </div>
     </Suspense>
     </>
  );
};

export default AnalyticsDashboard;