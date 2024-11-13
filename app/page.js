import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Beaker, 
  Brain, 
  ClipboardList, 
  BookOpen, 
  BarChart,
  Users,
  AlertCircle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const HeartCarePath = () => {
  const menuItems = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "chatbot",
      description: "chatbot",
      alert: true,
      status: 'in_progress',
      path: '/chat'
    },{
      icon: <Heart className="w-6 h-6" />,
      title: "Patient Summary & Triage",
      description: "Current status and immediate care needs",
      alert: true,
      status: 'in_progress',
      path: '/summary'
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Medication Tracker",
      description: "Adherence and medication schedule",
      alert: false,
      status: 'done',
      path: '/tracker'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Vitals Monitor",
      description: "Blood pressure, weight, and symptoms",
      alert: true,
      status: 'pending',
      path: '/vitals'
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Lifestyle Metrics",
      description: "Diet, exercise, and daily activities",
      alert: false,
      status: 'done',
      path: '/lifestyle'
    },
    {
      icon: <Beaker className="w-6 h-6" />,
      title: "Lab Results",
      description: "Recent tests and diagnostics",
      alert: false,
      status: 'pending',
      path: '/labs'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Wellbeing Check",
      description: "Quality of life and mental health",
      alert: false,
      status: 'done',
      path: '/wellbeing'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics",
      description: "Trends and progress insights",
      alert: false,
      status: 'done',
      path: '/analytics'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Education Hub",
      description: "Resources and engagement tracking",
      alert: false,
      status: 'pending',
      path: '/edu'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Patient List",
      description: "Overview of all patients",
      alert: true,
      status: 'pending',
      path: '/patients'
    }, {
      icon: <Users className="w-6 h-6" />,
      title: "Follow up list",
      description: "Overview of all patients",
      alert: true,
      status: 'pending',
      path: '/followup'
    }
  ];

  const StatusIndicator = ({ status }) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Timer className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HeartCarePath</h1>
          <p className="text-gray-600">Comprehensive Heart Failure Management Portal</p>
        </div>

        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <a 
              key={index}
              href={item.path}
              className="block no-underline"
            >
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-blue-600 mt-1">
                      {item.icon}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <StatusIndicator status={item.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeartCarePath;