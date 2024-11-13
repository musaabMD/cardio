// ChatBot component

"use client"

import React, { useState, useEffect, useRef } from 'react';
import questionFlow from '@/app/data/chat';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      category: 'Welcome',
      content: "👋 Welcome to your daily health check-in. I'll guide you through some questions about your health.",
      choices: ["Start Check-in", "View Previous Results"]
    }
  ]);

  const [currentSection, setCurrentSection] = useState('initial');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getCurrentQuestion = () => {
    const section = questionFlow[currentSection];
    if (section && section.questions[currentQuestionIndex]) {
      const question = section.questions[currentQuestionIndex];
      if (question.conditional && !question.conditional(responses)) {
        return null;
      }
      return {
        ...question,
        category: section.category
      };
    }
    return null;
  };

  const addMessage = (content, type = 'user', category = null, choices = null, icon = null, input = false) => {
    setMessages(prev => [...prev, { type, content, category, choices, icon, input }]);
  };

  const getFeedback = (response, questionId) => {
    const feedbackMap = {
      medication_adherence: {
        "Yes, all as prescribed": "✨ Excellent! Keeping up with your medications is crucial for managing your health.",
        default: "⚠️ I understand it can be challenging."
      },
      symptoms: {
        "None of these": "👍 Great to hear you're not experiencing symptoms.",
        default: "📝 I'll make sure to note these symptoms for your healthcare team."
      },
      weight: {
        default: "📊 Regular weight monitoring helps us track your condition better."
      },
      mental_health: {
        "Feeling good": "😊 Wonderful! Maintaining good mental health is important.",
        default: "💭 Remember, it's okay to ask for support when needed."
      }
    };

    const questionFeedback = feedbackMap[questionId];
    return questionFeedback ? questionFeedback[response] || questionFeedback.default : null;
  };

  const handleResponse = (response, questionId) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));

    addMessage(response);

    const feedback = getFeedback(response, questionId);
    if (feedback) {
      setTimeout(() => {
        addMessage(feedback, 'bot');
        // Add a follow-up suggestion if needed
        if (questionId === 'medication_adherence' && response !== "Yes, all as prescribed") {
          setTimeout(() => {
            addMessage("Would you like to discuss ways to help remember your medications?", 'bot', null, ["Yes", "No"]);
          }, 1000);
        }
      }, 500);
    }

    const moveToNextQuestion = () => {
      const currentSectionQuestions = questionFlow[currentSection].questions;
      if (currentQuestionIndex < currentSectionQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        return true;
      }
      const sections = Object.keys(questionFlow);
      const currentSectionIndex = sections.indexOf(currentSection);
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSection(sections[currentSectionIndex + 1]);
        setCurrentQuestionIndex(0);
        return true;
      }
      return false;
    };

    const hasNext = moveToNextQuestion();
    if (hasNext) {
      setTimeout(() => {
        const nextQuestion = getCurrentQuestion();
        if (nextQuestion) {
          addMessage(
            nextQuestion.text, 
            'bot', 
            nextQuestion.category, 
            nextQuestion.answers,
            nextQuestion.icon,
            nextQuestion.input
          );
        } else {
          handleResponse("SKIP", "SKIP");
        }
      }, 1000);
    } else {
      setTimeout(() => {
        addMessage("Thank you for completing your health check-in. I've saved all your responses.", 'bot');
        addMessage("Would you like to schedule your next check-in?", 'bot', null, [
          "Yes, schedule next check-in",
          "No, thank you"
        ]);
      }, 1000);
    }
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const currentQ = getCurrentQuestion();
      if (currentQ) {
        handleResponse(inputValue, currentQ.id);
        setInputValue('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-800 text-white py-6 px-8 flex items-center gap-3 sticky top-0 z-50">
        <Heart className="w-10 h-10" />
        <h1 className="text-4xl font-semibold">Heart Health Assessment</h1>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8 max-w-full">
        <div className="bg-white rounded-lg shadow-lg min-h-[calc(100vh-10rem)]">
          <div className="h-[calc(100vh-14rem)] px-8 py-6 overflow-y-auto">
            <div className="space-y-8 text-2xl">
              {messages.map((message, index) => (
                <div key={index} className="space-y-3">
                  {message.category && (
                    <div className="text-gray-500 text-3xl font-medium pt-4">
                      {message.category}
                    </div>
                  )}
                  
                  <div className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`rounded-lg px-6 py-5 shadow-sm w-full text-3xl ${
                      message.type === 'user'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 border border-gray-200'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                  
                  {message.choices && (
                    <div className="flex flex-wrap gap-4 py-3">
                      {message.choices.map((choice, choiceIndex) => {
                        const currentQ = getCurrentQuestion();
                        const isStartCheckIn = choice === "Start Check-in";
                        
                        return (
                          <Button
                            key={`${index}-${choiceIndex}`}
                            variant={isStartCheckIn ? "default" : "outline"}
                            size="lg"
                            className={`flex items-center gap-3 text-3xl px-8 py-6 ${
                              isStartCheckIn 
                                ? 'bg-gray-800 hover:bg-gray-700' 
                                : 'hover:bg-gray-200'
                            }`}
                            onClick={() => {
                              if (currentQ) {
                                handleResponse(choice, currentQ.id);
                              }
                            }}
                          >
                            {message.icon && <message.icon className="w-6 h-6" />}
                            {choice}
                            <ArrowRight className="w-6 h-6 ml-1" />
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          {getCurrentQuestion()?.input && (
            <div className="border-t bg-white px-8 py-6 sticky bottom-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-3xl"
                  placeholder="Type your response..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit();
                    }
                  }}
                />
                <Button 
                  className="bg-gray-800 hover:bg-gray-700 px-6 py-4 text-2xl"
                  onClick={handleInputSubmit}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
