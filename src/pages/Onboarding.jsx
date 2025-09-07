import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QUESTIONS_API = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002/api/behaviour";
const USER_API = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002/api/user";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ budget: 8000 });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  const userRaw = localStorage.getItem("user");

  useEffect(() => {
    if (!token || !userRaw) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${QUESTIONS_API}/questions`, {
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

  const handleSubmit = async () => {
    try {
      setError(null);
      await axios.post(`${QUESTIONS_API}/answers`, { answers }, { headers: { Authorization: `Bearer ${token}` } });
      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...user, isNewUser: false, hasCompletedBehaviorQuestions: true }));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to submit. Please try again.';
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tell us about you</h1>
          <p className="text-gray-600">This helps us personalize your roommate matches.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="">
              <label className="block text-sm font-medium text-gray-800 mb-3">{q.text}</label>
              {!q.type && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange(q.id, opt)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        answers[q.id] === opt ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-800 border-gray-300 hover:border-red-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === 'range' && (
                <div className="mt-2">
                  <input type="range" min={q.min} max={q.max} value={answers[q.id] ?? q.min} onChange={(e) => handleChange(q.id, Number(e.target.value))} className="w-full" />
                  <div className="text-sm text-gray-700 mt-1">₹ {answers[q.id] ?? q.min}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


