"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Heart, Clock, AlertCircle, Pill, Calendar, Scale, 
         Droplets, Stethoscope, Brain, Sun, Smile, Activity } from 'lucide-react';
import questionFlow from '@/app/data/chat';

const IconMap = {
  Heart,
  Clock,
  AlertCircle,
  Pill,
  Calendar,
  Scale,
  Droplets,
  Stethoscope,
  Brain,
  Sun,
  Smile,
  Activity
};

const ChatBot = () => {
  const [currentSection, setCurrentSection] = useState('initial');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [messages, setMessages] = useState([]);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with first question
    if (messages.length === 0) {
      const firstQuestion = questionFlow[currentSection].questions[0];
      setMessages([{
        type: 'bot',
        content: firstQuestion.text,
        choices: firstQuestion.answers,
        iconName: firstQuestion.icon?.name || 'Heart',
        id: firstQuestion.id
      }]);
    }
  }, []);

  const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBPCategory = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return "Normal";
    if (systolic < 130 && diastolic < 80) return "Elevated";
    if (systolic < 140 || diastolic < 90) return "Stage 1 Hypertension";
    return "Stage 2 Hypertension";
  };

  const renderIcon = (iconName) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const renderInputControl = (questionId) => {
    if (questionId === 'bp_reading') {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 w-full">
          <div className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-700">Systolic: {systolic} mmHg</label>
              <Slider 
                defaultValue={[120]}
                min={70}
                max={200}
                step={1}
                value={[systolic]}
                onValueChange={([value]) => setSystolic(value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-700">Diastolic: {diastolic} mmHg</label>
              <Slider 
                defaultValue={[80]}
                min={40}
                max={130}
                step={1}
                value={[diastolic]}
                onValueChange={([value]) => setDiastolic(value)}
                className="mt-2"
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg">BP Category:</span>
                <span className="font-medium text-lg">{getBPCategory(systolic, diastolic)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (questionId === 'current_weight') {
      const bmi = calculateBMI(weight, height);
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 w-full">
          <div className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-700">Weight: {weight} kg</label>
              <Slider 
                defaultValue={[70]}
                min={30}
                max={200}
                step={0.5}
                value={[weight]}
                onValueChange={([value]) => setWeight(value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-700">Height: {height} cm</label>
              <Slider 
                defaultValue={[170]}
                min={120}
                max={220}
                step={1}
                value={[height]}
                onValueChange={([value]) => setHeight(value)}
                className="mt-2"
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg">BMI:</span>
                <span className="font-medium text-lg">{bmi} ({getBMICategory(bmi)})</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const moveToNextQuestion = () => {
    const currentSectionQuestions = questionFlow[currentSection].questions;
    if (currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return currentSectionQuestions[currentQuestionIndex + 1];
    }

    const sections = Object.keys(questionFlow);
    const currentSectionIndex = sections.indexOf(currentSection);
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];
      setCurrentSection(nextSection);
      setCurrentQuestionIndex(0);
      return questionFlow[nextSection].questions[0];
    }

    return null;
  };

  const handleResponse = (response, currentId) => {
    setResponses(prev => ({
      ...prev,
      [currentId]: response
    }));

    setMessages(prev => [...prev, {
      type: 'user',
      content: response,
      id: currentId
    }]);

    if (currentId === 'bp_reading') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `BP: ${systolic}/${diastolic} mmHg (${getBPCategory(systolic, diastolic)})`,
          category: "Results",
          iconName: 'Heart'
        }]);
      }, 500);
    } else if (currentId === 'current_weight') {
      const bmi = calculateBMI(weight, height);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Weight: ${weight}kg, Height: ${height}cm\nBMI: ${bmi} (${getBMICategory(bmi)})`,
          category: "Results",
          iconName: 'Scale'
        }]);
      }, 500);
    }

    setTimeout(() => {
      const nextQuestion = moveToNextQuestion();
      if (nextQuestion) {
        if (!nextQuestion.conditional || nextQuestion.conditional(responses)) {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: nextQuestion.text,
            choices: nextQuestion.answers,
            iconName: nextQuestion.icon?.name || 'Heart',
            id: nextQuestion.id,
            category: questionFlow[currentSection].category
          }]);
        } else {
          handleResponse("SKIP", nextQuestion.id);
        }
      }
    }, 1000);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Heart className="text-blue-500" />
          Health Check
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-6 py-4 max-w-3xl w-full ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-white shadow-sm'
            }`}>
              {message.category && (
                <div className="text-sm text-gray-500 mb-2">
                  {message.category}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {message.iconName && renderIcon(message.iconName)}
                <p className="text-lg">{message.content}</p>
              </div>
              
              {message.id && renderInputControl(message.id)}
              
              {message.choices && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {message.choices.map((choice, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="lg"
                      className="text-lg"
                      onClick={() => handleResponse(choice, message.id)}
                    >
                      {message.iconName && renderIcon(message.iconName)}
                      {choice}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatBot;