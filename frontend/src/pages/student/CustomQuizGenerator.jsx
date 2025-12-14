import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Target, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { quizService } from '../../services/quizService';
import toast from 'react-hot-toast';

const CustomQuizGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    
    try {
      const quiz = await quizService.generateCustomQuiz(formData.topic, formData.difficulty);
      sessionStorage.setItem('customQuiz', JSON.stringify(quiz));
      navigate('/quiz-take', { state: { quiz, isCustom: true } });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(`Failed to generate quiz: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'EASY', label: 'Easy', icon: '🟢', description: 'Basic concepts and simple questions' },
    { value: 'MEDIUM', label: 'Medium', icon: '🟡', description: 'Moderate difficulty with some challenges' },
    { value: 'HARD', label: 'Hard', icon: '🔴', description: 'Advanced concepts and complex problems' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Custom Quiz Generator</h1>
          <p className="text-gray-600">Create personalized quizzes with artificial intelligence</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Quiz Generation</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter any topic and difficulty level. Our AI will generate a personalized quiz just for you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Brain className="inline h-4 w-4 mr-2" />
              What topic would you like to learn about?
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., JavaScript, Machine Learning, History, Biology..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Target className="inline h-4 w-4 mr-2" />
              Choose your difficulty level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficultyOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                    formData.difficulty === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={option.value}
                    checked={formData.difficulty === option.value}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                  {formData.difficulty === option.value && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center text-yellow-800">
              <Zap className="h-5 w-5 mr-2" />
              <span className="font-semibold">Reward: 100 XP</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Complete this custom quiz to earn 100 experience points!
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate & Start Quiz</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomQuizGenerator;