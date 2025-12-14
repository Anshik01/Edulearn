import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser, refreshUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCustomQuiz, setIsCustomQuiz] = useState(false);

  useEffect(() => {
    // Check if this is a custom quiz from location state or session storage
    if (location.state?.isCustom && location.state?.quiz) {
      setQuiz(location.state.quiz);
      setIsCustomQuiz(true);
      setLoading(false);
    } else {
      const customQuiz = sessionStorage.getItem('customQuiz');
      if (customQuiz && !id) {
        setQuiz(JSON.parse(customQuiz));
        setIsCustomQuiz(true);
        setLoading(false);
        sessionStorage.removeItem('customQuiz');
      } else if (id) {
        fetchQuiz();
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, location.state]);

  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizById(id);
      setQuiz(response);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      if (isCustomQuiz) {
        // Handle custom quiz completion
        let correctAnswers = 0;
        quiz.questions.forEach(question => {
          const selectedOption = question.options.find(opt => opt.id === answers[question.id]);
          if (selectedOption && selectedOption.isCorrect) {
            correctAnswers++;
          }
        });
        
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        const xpEarned = Math.round((score / 100) * quiz.xpReward); // XP based on score
        
        // Submit custom quiz completion to backend
        const updatedUser = await quizService.completeCustomQuiz(score, xpEarned);
        updateUser(updatedUser);
        
        toast.success(`Custom Quiz completed! You earned ${xpEarned} XP (Score: ${score}%)`);
        navigate('/dashboard');
      } else {
        // Handle regular quiz submission
        const attemptData = {
          quizId: parseInt(id),
          answers: quiz.questions.map(question => ({
            questionId: question.id,
            selectedOptionId: answers[question.id]
          }))
        };

        const result = await quizService.submitQuizAttempt(attemptData);
        
        updateUser({ xp: result.xpEarned + (JSON.parse(localStorage.getItem('user'))?.xp || 0) });
        
        toast.success(`Quiz completed! You earned ${result.xpEarned} XP`);
        navigate('/quizzes');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 mx-auto text-red-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz not found</h3>
        <p className="text-gray-600">The quiz you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isCustomQuiz ? 'bg-gradient-to-r from-purple-100 to-blue-100' : 'bg-primary-100'
            }`}>
              {isCustomQuiz ? (
                <Sparkles className="h-6 w-6 text-purple-600" />
              ) : (
                <BookOpen className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                {isCustomQuiz && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
                    AI Generated
                  </span>
                )}
              </div>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{quiz.xpReward} XP</div>
            <div className="text-sm text-gray-500">Reward</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-primary-600 text-white'
                  : answers[quiz.questions[index].id]
                  ? 'bg-success-100 text-success-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQ.questionText}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQ.id] === option.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={option.id}
                  checked={answers[currentQ.id] === option.id}
                  onChange={() => handleAnswerSelect(currentQ.id, option.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQ.id] === option.id
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQ.id] === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-900">{option.optionText}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                answers[question.id]
                  ? 'bg-success-100 text-success-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Answered: {Object.keys(answers).length} / {quiz.questions.length}
        </div>
      </div>
    </div>
  );
};

export default QuizTake;