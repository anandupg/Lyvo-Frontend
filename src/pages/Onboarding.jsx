import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Heart, Home, Users, DollarSign, SkipForward } from "lucide-react";
import apiClient from "../utils/apiClient";

const QUESTIONS_API = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002/api/behaviour";
const USER_API = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002/api/user";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ budget: 8000 });
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const token = localStorage.getItem("authToken");
  const userRaw = localStorage.getItem("user");

  useEffect(() => {
    if (!token || !userRaw) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await apiClient.get(`/behaviour/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions || []);
      } catch (e) {
        const status = e?.response?.status;
        const msg = e?.response?.data?.message || e?.message || 'Failed to load questions. Please try again.';
        setError(msg);
        if (status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [navigate, token, userRaw]);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await apiClient.post(`/behaviour/answers`, { answers }, { headers: { Authorization: `Bearer ${token}` } });
      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...user, isNewUser: false, hasCompletedBehaviorQuestions: true }));
      
      // Show celebration animation
      setShowCelebration(true);
      
      // Wait for celebration animation, then redirect
      setTimeout(() => {
        if (user.role === 1) {
          navigate("/seeker-profile", { replace: true });
        } else {
          navigate(user.role === 3 ? "/owner-dashboard" : "/admin-dashboard", { replace: true });
        }
      }, 2000);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to submit. Please try again.';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  const getQuestionIcon = (questionText) => {
    if (questionText.toLowerCase().includes('budget') || questionText.toLowerCase().includes('price')) {
      return <DollarSign className="w-6 h-6" />;
    }
    if (questionText.toLowerCase().includes('roommate') || questionText.toLowerCase().includes('people')) {
      return <Users className="w-6 h-6" />;
    }
    if (questionText.toLowerCase().includes('home') || questionText.toLowerCase().includes('place')) {
      return <Home className="w-6 h-6" />;
    }
    return <Heart className="w-6 h-6" />;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Journey</h2>
          <p className="text-gray-600">Loading personalized questions...</p>
        </motion.div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
            className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            🎉 Amazing!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-8"
          >
            We've got everything we need to find your perfect match!
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center space-x-2 text-green-600"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="ml-2 text-sm">Redirecting...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = answers[currentQuestion?.id] !== undefined;

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Let's Find Your Perfect Match! 💕
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few quick questions and we'll personalize your roommate experience
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {getQuestionIcon(currentQuestion?.text)}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentQuestion?.text}
            </h2>
          </div>

          <div className="space-y-4">
            {!currentQuestion?.type && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentQuestion?.options?.map((opt, index) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange(currentQuestion.id, opt)}
                    className={`px-6 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                      answers[currentQuestion.id] === opt
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:shadow-md"
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            )}
            
            {currentQuestion?.type === 'range' && (
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-2xl p-6">
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    value={answers[currentQuestion.id] ?? currentQuestion.min}
                    onChange={(e) => handleChange(currentQuestion.id, Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #dc2626 100%)`
                    }}
                  />
                  <div className="text-center mt-4">
                    <span className="text-3xl font-bold text-red-600">
                      ₹{answers[currentQuestion.id] ?? currentQuestion.min}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">per month</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {questions.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : index < currentQuestionIndex
                    ? "bg-green-400"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </motion.button>

            <div className="flex space-x-3">
              {/* Skip Button */}
              {!isLastQuestion && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                >
                  <SkipForward className="w-5 h-5" />
                  <span>Skip</span>
                </motion.button>
              )}

              {/* Next/Complete Button */}
              {isLastQuestion ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!hasAnswer || isSubmitting}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                    !hasAnswer || isSubmitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={!hasAnswer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    !hasAnswer
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg"
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Onboarding;



