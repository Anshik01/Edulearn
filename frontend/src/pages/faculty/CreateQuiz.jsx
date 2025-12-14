import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { Plus, Trash2, BookOpen, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    xpReward: 100,
    questions: [
      {
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }
    ]
  });

  const handleQuizChange = (field, value) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              options: q.options.map((o, oIndex) => 
                oIndex === optionIndex ? { ...o, [field]: value } : o
              )
            }
          : q
      )
    }));
  };

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (quiz.questions.length === 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== questionIndex)
    }));
  };

  const addOption = (questionIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? {
              ...q,
              options: [...q.options, { optionText: '', isCorrect: false }]
            }
          : q
      )
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const question = quiz.questions[questionIndex];
    if (question.options.length === 2) {
      toast.error('Question must have at least two options');
      return;
    }

    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              options: q.options.filter((_, oIndex) => oIndex !== optionIndex)
            }
          : q
      )
    }));
  };

  const setCorrectAnswer = (questionIndex, optionIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              options: q.options.map((o, oIndex) => ({
                ...o,
                isCorrect: oIndex === optionIndex
              }))
            }
          : q
      )
    }));
  };

  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      toast.error('Quiz title is required');
      return false;
    }
    
    if (!quiz.description.trim()) {
      toast.error('Quiz description is required');
      return false;
    }

    if (quiz.xpReward < 1) {
      toast.error('XP reward must be at least 1');
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      
      if (!question.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return false;
      }

      const validOptions = question.options.filter(o => o.optionText.trim());
      if (validOptions.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return false;
      }

      const correctAnswers = question.options.filter(o => o.isCorrect);
      if (correctAnswers.length !== 1) {
        toast.error(`Question ${i + 1} must have exactly one correct answer`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }

    setLoading(true);
    try {
      // Filter out empty options
      const cleanedQuiz = {
        ...quiz,
        questions: quiz.questions.map(q => ({
          ...q,
          options: q.options.filter(o => o.optionText.trim())
        }))
      };

      await quizService.createQuiz(cleanedQuiz);
      toast.success('Quiz created successfully!');
      navigate('/my-quizzes');
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-1">Design an engaging quiz for your students</p>
        </div>
        <button
          onClick={() => navigate('/my-quizzes')}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => handleQuizChange('title', e.target.value)}
                className="input-field"
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                XP Reward *
              </label>
              <input
                type="number"
                value={quiz.xpReward}
                onChange={(e) => handleQuizChange('xpReward', parseInt(e.target.value) || 0)}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={quiz.description}
              onChange={(e) => handleQuizChange('description', e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Describe what this quiz covers"
              required
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quiz.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {questionIndex + 1}
                </h3>
                {quiz.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text *
                </label>
                <textarea
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                  className="input-field"
                  rows="2"
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options *
                </label>
                
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={option.isCorrect}
                        onChange={() => setCorrectAnswer(questionIndex, optionIndex)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <label className="ml-2 text-sm text-gray-600">Correct</label>
                    </div>
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'optionText', e.target.value)}
                      className="flex-1 input-field"
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Another Question</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/my-quizzes')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Create Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;