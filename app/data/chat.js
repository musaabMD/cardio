// data/chat.js

import { Clock, AlertCircle, Pill, Calendar, Scale, Droplets, Stethoscope, Brain, Sun, Heart, Smile, Activity } from 'lucide-react';

const questionFlow = {
  initial: {
    category: "Initial Greeting & Adherence Check",
    questions: [
      {
        id: 'ready',
        text: "It's time for your health check-in. Ready to start?",
        answers: ["Yes", "No"],
        icon: Clock
      },
      {
        id: 'medication_adherence',
        text: "Have you been able to take all of your medications as prescribed?",
        answers: [
          "Yes, all as prescribed",
          "Missed a few doses",
          "Missed several doses",
          "Stopped taking one or more medications"
        ],
        icon: Pill
      },
      {
        id: 'adherence_difficulty',
        text: "Can you tell me more about why it’s been difficult?",
        answers: ["Side effects", "Cost concerns", "Forgetting to take them", "Other reasons"],
        icon: AlertCircle,
        conditional: (responses) => responses.medication_adherence !== "Yes, all as prescribed"
      }
    ]
  },
  medications: {
    category: "Medication Details",
    questions: [
      {
        id: 'side_effects',
        text: "Have you experienced any side effects from your medications?",
        answers: ["Yes", "No", "Describe side effects"],
        icon: AlertCircle
      },
      {
        id: 'med_changes',
        text: "Any recent changes to your medication regimen?",
        answers: ["Yes", "No", "Describe changes"],
        icon: Calendar
      },
      {
        id: 'med_timing',
        text: "Are you following the specific dose and timing for each medication?",
        answers: ["Yes", "No"],
        icon: Clock
      }
    ]
  },
  symptoms: {
    category: "Symptom Check",
    questions: [
      {
        id: 'symptoms',
        text: "Have you experienced any of the following symptoms: shortness of breath, swelling, fatigue, chest pain?",
        answers: ["Shortness of breath", "Swelling", "Fatigue", "Chest pain", "None"],
        icon: Stethoscope,
        multiple: true
      },
      {
        id: 'symptom_note',
        text: "Please let your healthcare provider know about new or worsening symptoms.",
        answers: [],
        icon: AlertCircle
      }
    ]
  },
  weight: {
    category: "Weight Check",
    questions: [
      {
        id: 'current_weight',
        text: "Could you tell me your current weight?",
        answers: ["Weight in lbs/kg", "Skip"],
        icon: Scale,
        input: true
      },
      {
        id: 'weight_check',
        text: "Are you weighing yourself regularly around the same time each day?",
        answers: ["Yes", "No"],
        icon: Calendar
      }
    ]
  },
  blood_pressure: {
    category: "Blood Pressure & Heart Rate Check",
    questions: [
      {
        id: 'bp_reading',
        text: "Could you share your most recent blood pressure reading?",
        answers: ["Systolic/Diastolic"],
        icon: Heart,
        input: true
      },
      {
        id: 'heart_rate',
        text: "What is your most recent heart rate?",
        answers: ["Heart rate in bpm"],
        icon: Heart,
        input: true
      }
    ]
  },
  diet: {
    category: "Dietary and Fluid Intake",
    questions: [
      {
        id: 'fluid_restriction',
        text: "Are you following any fluid restrictions?",
        answers: ["Yes", "No", "Challenges with fluid restriction"],
        icon: Droplets
      },
      {
        id: 'sodium_intake',
        text: "How about sodium intake? Are you managing it within recommended limits?",
        answers: ["Yes", "No", "Challenges with sodium intake"],
        icon: AlertCircle
      }
    ]
  },
  activity: {
    category: "Physical Activity & Exercise",
    questions: [
      {
        id: 'activity_level',
        text: "Have you been able to keep up with your recommended level of physical activity?",
        answers: ["Yes", "No"],
        icon: Activity
      },
      {
        id: 'activity_difficulties',
        text: "What types of difficulties are you experiencing with activity?",
        answers: ["Shortness of breath", "Fatigue during exertion", "Joint pain", "None"],
        icon: AlertCircle
      }
    ]
  },
  labs: {
    category: "Lab Results (Optional)",
    questions: [
      {
        id: 'recent_labs',
        text: "Do you have any recent lab results to share?",
        answers: ["Yes", "No", "Provide lab details if available"],
        icon: Calendar
      }
    ]
  },
  hospital_visits: {
    category: "Recent Hospitalizations or ER Visits",
    questions: [
      {
        id: 'hospital_visits',
        text: "Since our last check-in, have you had any hospital or ER visits?",
        answers: ["Yes", "No"],
        icon: AlertCircle
      },
      {
        id: 'visit_reason',
        text: "Could you briefly describe the reason for your visit?",
        answers: ["Describe reason"],
        icon: Calendar,
        input: true
      }
    ]
  },
  support: {
    category: "Psychological and Social Support",
    questions: [
      {
        id: 'mental_health',
        text: "How have you been feeling mentally and emotionally?",
        answers: ["Describe mental and emotional state", "None"],
        icon: Brain
      },
      {
        id: 'support_needed',
        text: "Do you have the support you need for managing medications and health routines?",
        answers: ["Yes", "No"],
        icon: Smile
      }
    ]
  },
  quality_of_life: {
    category: "Patient-Reported Outcomes & Quality of Life",
    questions: [
      {
        id: 'daily_tasks',
        text: "How would you rate your ability to complete daily tasks?",
        answers: ["Describe ability to complete tasks"],
        icon: Sun
      },
      {
        id: 'quality_of_life',
        text: "Overall, how is your quality of life right now?",
        answers: ["Describe quality of life"],
        icon: Sun
      }
    ]
  },
  follow_up: {
    category: "Follow-Up Reminders",
    questions: [
      {
        id: 'reminder_checkin',
        text: "Would you like a reminder to check in again?",
        answers: ["Yes", "No"],
        icon: Calendar
      },
      {
        id: 'reminder_frequency',
        text: "How often would you like to receive reminders?",
        answers: ["Daily", "Weekly", "Bi-weekly"],
        icon: Calendar
      }
    ]
  }
};

export default questionFlow;
