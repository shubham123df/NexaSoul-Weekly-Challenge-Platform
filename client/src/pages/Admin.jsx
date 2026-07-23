import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi, setAdminSecret } from '../api/client';
import { Eye, EyeOff } from 'lucide-react';

const emptyQuestion = {
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState('quizzes');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState(emptyQuestion);
  const [editQuiz, setEditQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);

  // Handle tab changes with data loading
  const handleTabChange = (newTab) => {
    if (newTab !== 'quizzes' && !selectedQuiz && quizzes.length > 0) {
      setSelectedQuiz(quizzes[0]);
    }
    
    setTab(newTab);
    
    // Load data when switching to specific tabs
    if (newTab === 'submissions' && selectedQuiz) {
      loadSubmissions(selectedQuiz.id);
    } else if (newTab === 'analytics' && selectedQuiz) {
      loadAnalytics(selectedQuiz.id);
    }
  };

  // Hide navbar and footer when viewing submission details
  useEffect(() => {
    if (selectedSubmission) {
      document.body.classList.add('admin-modal-open');
      document.documentElement.classList.add('admin-modal-open');
    } else {
      document.body.classList.remove('admin-modal-open');
      document.documentElement.classList.remove('admin-modal-open');
    }

    return () => {
      document.body.classList.remove('admin-modal-open');
      document.documentElement.classList.remove('admin-modal-open');
    };
  }, [selectedSubmission]);

  const loadQuizzes = async () => {
    try {
      const res = await adminApi.getQuizzes();
      setQuizzes(res.data);
    } catch {
      setMessage('Failed to load quizzes');
    }
  };

  useEffect(() => {
    if (authenticated) loadQuizzes();
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('🔐 Admin login attempt with secret:', secret);
    console.log('🔐 Secret length:', secret.length);
    console.log('🔐 Secret trimmed:', secret.trim());
    
    setAdminSecret(secret);
    adminApi.getQuizzes()
      .then((response) => {
        console.log('✅ Login successful!');
        setAuthenticated(true);
        setMessage('');
      })
      .catch((error) => {
        console.error('❌ Login failed:', error.response?.data);
        console.error('❌ Status:', error.response?.status);
        setMessage('Invalid admin secret');
      });
  };

  const handleToggle = async (id) => {
    try {
      await adminApi.toggleQuiz(id);
      loadQuizzes();
      setMessage('Quiz status updated');
    } catch {
      setMessage('Failed to toggle quiz');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz and all submissions?')) return;
    try {
      await adminApi.deleteQuiz(id);
      setSelectedQuiz(null);
      loadQuizzes();
      setMessage('Quiz deleted');
    } catch {
      setMessage('Failed to delete quiz');
    }
  };

  const loadAnalytics = async (quizId) => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics(quizId);
      setAnalytics(res.data);
    } catch {
      setMessage('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (quizId, format) => {
    try {
      const res = format === 'csv'
        ? await adminApi.exportCsv(quizId)
        : await adminApi.exportExcel(quizId);

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexasoul-submissions.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage('Export failed');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    // Validate question text is not empty
    if (!newQuestion.questionText.trim()) {
      setMessage('Question text cannot be empty');
      return;
    }

    // Validate all options are filled
    if (newQuestion.options.some(opt => !opt.trim())) {
      setMessage('All options must be filled');
      return;
    }

    // Validate maximum 20 questions
    if (selectedQuiz.questions && selectedQuiz.questions.length >= 20) {
      setMessage('Maximum 20 questions allowed per quiz');
      return;
    }

    try {
      await adminApi.addQuestion(selectedQuiz.id, newQuestion);
      setNewQuestion(emptyQuestion);
      const res = await adminApi.getQuizzes();
      setQuizzes(res.data);
      setSelectedQuiz(res.data.find((q) => q.id === selectedQuiz.id));
      setMessage('Question added');
    } catch {
      setMessage('Failed to add question');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createQuiz(editQuiz);
      setEditQuiz(null);
      loadQuizzes();
      setMessage('Quiz created');
    } catch {
      setMessage('Failed to create quiz');
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateQuiz(selectedQuiz.id, {
        title: selectedQuiz.title,
        description: selectedQuiz.description,
        durationMinutes: selectedQuiz.durationMinutes,
        submissionDeadline: selectedQuiz.submissionDeadline,
        leaderboardEnabled: selectedQuiz.leaderboardEnabled,
        posterUrl: selectedQuiz.posterUrl,
      });
      loadQuizzes();
      setMessage('Quiz updated');
    } catch {
      setMessage('Failed to update quiz');
    }
  };

  const loadSubmissions = async (quizId) => {
    setLoading(true);
    try {
      const res = await adminApi.getSubmissions(quizId);
      setSubmissions(res.data);
    } catch {
      setMessage('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!confirm('Delete this submission? This action cannot be undone.')) return;
    try {
      await adminApi.deleteSubmission(id);
      if (selectedQuiz) loadSubmissions(selectedQuiz._id);
      setMessage('Submission deleted');
    } catch {
      setMessage('Failed to delete submission');
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedSubmissions.length === 0) return;
    if (!confirm(`Delete ${selectedSubmissions.length} submissions? This action cannot be undone.`)) return;
    try {
      await adminApi.deleteMultipleSubmissions(selectedSubmissions);
      setSelectedSubmissions([]);
      if (selectedQuiz) loadSubmissions(selectedQuiz._id);
      setMessage(`${selectedSubmissions.length} submissions deleted`);
    } catch {
      setMessage('Failed to delete submissions');
    }
  };

  const toggleSelectSubmission = (id) => {
    setSelectedSubmissions(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleViewSubmission = async (id) => {
    try {
      const res = await adminApi.getSubmissionDetails(id);
      setSelectedSubmission(res.data);
    } catch {
      setMessage('Failed to load submission details');
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20">
          <h1 className="text-2xl font-bold text-black mb-2">Admin Login</h1>
          <p className="text-black text-sm mb-6">Enter admin secret to access the dashboard.</p>
          {message && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{message}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Admin Secret"
                className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-black text-sm">Manage quizzes, questions, and analytics</p>
        </div>
        <button
          onClick={() => setEditQuiz({ title: '', description: '', durationMinutes: 20, isActive: false, leaderboardEnabled: true })}
          className="btn-primary text-sm"
        >
          + Create Quiz
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-green-500/10 border-2 border-green-500/30 text-black text-sm">
          {message}
        </motion.div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['quizzes', 'questions', 'submissions', 'analytics'].map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
              tab === t
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white border-2 border-primary/30 text-black hover:bg-primary hover:text-white hover:border-primary/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {tab === 'quizzes' && (
          <motion.div key="quizzes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-black">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${quiz.isActive ? 'bg-green-500/20 text-green-600 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                      {quiz.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-black mt-1">
                    {quiz.questions?.length || 0} questions · {quiz.durationMinutes} min
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setSelectedQuiz(quiz); setTab('questions'); }} className="btn-secondary text-xs py-2 px-3">Edit Questions</button>
                  <button onClick={() => { setSelectedQuiz(quiz); loadSubmissions(quiz.id); setTab('submissions'); }} className="btn-secondary text-xs py-2 px-3">Submissions</button>
                  <button onClick={() => { setSelectedQuiz(quiz); loadAnalytics(quiz.id); setTab('analytics'); }} className="btn-secondary text-xs py-2 px-3">Analytics</button>
                  <button onClick={() => handleToggle(quiz.id)} className="btn-secondary text-xs py-2 px-3">
                    {quiz.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(quiz.id)} className="text-xs py-2 px-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10">Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'questions' && selectedQuiz && (
          <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 mb-6">
              <h2 className="font-bold text-black mb-4">Quiz Settings — <span className="text-black">{selectedQuiz.title}</span></h2>
              <form onSubmit={handleUpdateQuiz} className="grid sm:grid-cols-2 gap-4">
                <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" value={selectedQuiz.title} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, title: e.target.value })} placeholder="Title" />
                <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" type="number" value={selectedQuiz.durationMinutes} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, durationMinutes: parseInt(e.target.value) })} placeholder="Duration (min)" />
                <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500 sm:col-span-2" value={selectedQuiz.description} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, description: e.target.value })} placeholder="Description" />
                <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500 sm:col-span-2" value={selectedQuiz.posterUrl || ''} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, posterUrl: e.target.value })} placeholder="Weekly Poster URL (image link)" />
                <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" type="datetime-local" value={selectedQuiz.submissionDeadline ? new Date(selectedQuiz.submissionDeadline).toISOString().slice(0, 16) : ''} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, submissionDeadline: e.target.value })} />
                <label className="flex items-center gap-2 text-sm text-black">
                  <input type="checkbox" checked={selectedQuiz.leaderboardEnabled} onChange={(e) => setSelectedQuiz({ ...selectedQuiz, leaderboardEnabled: e.target.checked })} />
                  Leaderboard Enabled
                </label>
                <button type="submit" className="btn-primary sm:col-span-2">Save Settings</button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-black">Existing Questions ({selectedQuiz.questions?.length || 0}/20)</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  (selectedQuiz.questions?.length || 0) >= 20 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-600 border border-green-500/30'
                }`}>
                  {(selectedQuiz.questions?.length || 0) >= 20 ? 'Limit Reached' : `${20 - (selectedQuiz.questions?.length || 0)} remaining`}
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedQuiz.questions?.map((q, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="text-sm font-medium text-black">Q{i + 1}. {q.questionText}</div>
                    <div className="text-xs text-black mt-1">Correct: Option {String.fromCharCode(65 + q.correctAnswer)}</div>
                    <button
                      onClick={async () => {
                        await adminApi.deleteQuestion(selectedQuiz.id, i);
                        const res = await adminApi.getQuizzes();
                        setQuizzes(res.data);
                        setSelectedQuiz(res.data.find((qu) => qu.id === selectedQuiz.id));
                      }}
                      className="text-xs text-red-500 mt-2 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20">
              <h3 className="font-bold text-black mb-4">Add Question</h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <textarea 
                  className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" 
                  rows={2} 
                  value={newQuestion.questionText} 
                  onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} 
                  placeholder="Question text" 
                  required
                />
                {newQuestion.options.map((opt, i) => (
                  <input 
                    key={i} 
                    className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" 
                    value={opt} 
                    onChange={(e) => {
                      const opts = [...newQuestion.options];
                      opts[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: opts });
                    }} 
                    placeholder={`Option ${String.fromCharCode(65 + i)}`} 
                    required
                  />
                ))}
                <select className="input-field bg-white border-2 border-primary/30 text-black" value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}>
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>Correct: Option {String.fromCharCode(65 + i)}</option>
                  ))}
                </select>
                <textarea className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" rows={2} value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} placeholder="Explanation (for learning feature)" />
                
                {/* Inline validation message */}
                {(!newQuestion.questionText.trim() || newQuestion.options.some(opt => !opt.trim())) && (
                  <div className="p-3 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-red-500 text-sm">
                    {!newQuestion.questionText.trim() 
                      ? 'Question text cannot be empty' 
                      : 'All options must be filled'}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={
                    !newQuestion.questionText.trim() || 
                    newQuestion.options.some(opt => !opt.trim()) ||
                    (selectedQuiz.questions?.length || 0) >= 20
                  }
                >
                  {(selectedQuiz.questions?.length || 0) >= 20 
                    ? 'Maximum 20 questions reached' 
                    : 'Add Question'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {tab === 'submissions' && (
          <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!selectedQuiz ? (
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 text-center text-black">
                Select a quiz from the Quizzes tab to view submissions
              </div>
            ) : loading ? (
              <div className="text-center py-20 animate-pulse text-primary flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-black">Loading submissions...</span>
              </div>
            ) : (
              <div>
                {/* Top Performers Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 mb-6">
                  <h2 className="font-bold text-black mb-4 flex items-center gap-2">
                    🏆 Top Performers — {selectedQuiz.title}
                  </h2>
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 text-black">
                      No submissions yet
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-3 gap-4">
                      {submissions.slice(0, 3).map((sub, i) => (
                        <div
                          key={sub.id}
                          className={`p-4 rounded-xl border ${
                            i === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                            i === 1 ? 'bg-gray-400/10 border-gray-400/30' :
                            'bg-orange-500/10 border-orange-500/30'
                          }`}
                        >
                          <div className="text-2xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                          <div className="font-bold text-text">{sub.name}</div>
                          <div className="text-sm text-text-100">{sub.department}</div>
                          <div className="text-xl font-bold text-black mt-2">{sub.totalScore} pts</div>
                          <div className="text-xs text-text-100">{sub.accuracy}% accuracy</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Submissions */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-black">All Submissions ({submissions.length})</h3>
                    {selectedSubmissions.length > 0 && (
                      <button
                        onClick={handleDeleteMultiple}
                        className="text-sm px-4 py-2 rounded-xl bg-red-500/20 border-2 border-red-500/30 text-red-500 hover:bg-red-500/30 transition-colors"
                      >
                        Delete Selected ({selectedSubmissions.length})
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white rounded-xl p-4 border-2 border-primary/20 hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="checkbox"
                                checked={selectedSubmissions.includes(sub.id)}
                                onChange={() => toggleSelectSubmission(sub.id)}
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="font-semibold text-black">{sub.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                                {sub.uid}
                              </span>
                            </div>
                            <div className="text-sm text-black">
                              {sub.email} · {sub.department} · {sub.year}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-black">{sub.totalScore} pts</div>
                            <div className="text-xs text-black">{sub.accuracy}% · {Math.floor(sub.timeTakenSeconds / 60)}m {sub.timeTakenSeconds % 60}s</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleViewSubmission(sub._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                          >
                            View Answers
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(sub._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Submission Details Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Submission Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border-2 border-primary/20">
                  <div className="text-sm text-black">Name</div>
                  <div className="font-bold text-black">{selectedSubmission.name}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-primary/20">
                  <div className="text-sm text-black">Score</div>
                  <div className="font-bold text-black">{selectedSubmission.totalScore} pts</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-primary/20">
                  <div className="text-sm text-black">Accuracy</div>
                  <div className="font-bold text-black">{selectedSubmission.accuracy}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-primary/20">
                  <div className="text-sm text-black">Time</div>
                  <div className="font-bold text-black">{Math.floor(selectedSubmission.timeTakenSeconds / 60)}m {selectedSubmission.timeTakenSeconds % 60}s</div>
                </div>
              </div>

              <h3 className="font-bold text-black mb-4">Answers ({selectedSubmission.answers?.length || 0})</h3>
              <div className="space-y-3">
                {selectedSubmission.answers?.map((ans, i) => (
                  <div key={i} className={`rounded-xl p-4 border-2 ${
                    ans.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-black">Q{i + 1}</span>
                      <span className={`text-sm ${ans.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {ans.isCorrect ? '✓ Correct' : '✗ Wrong'}
                      </span>
                    </div>
                    <div className="text-sm text-black">
                      Selected: Option {String.fromCharCode(65 + ans.selectedOption)} · {ans.pointsEarned} pts
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {tab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!selectedQuiz ? (
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 text-center text-black">
                Select a quiz from the Quizzes tab and click Analytics
              </div>
            ) : loading ? (
              <div className="text-center py-20 animate-pulse text-primary flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <span className="text-black">Loading analytics...</span>
              </div>
            ) : analytics ? (
              <div>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total Participants', value: analytics.totalParticipants },
                    { label: 'Average Score', value: analytics.averageScore },
                    { label: 'Highest Score', value: analytics.highestScore },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 p-6 rounded-3xl border-2 border-primary/30 shadow-lg shadow-primary/20 text-center">
                      <div className="text-2xl font-bold text-black">{stat.value}</div>
                      <div className="text-black text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mb-6">
                  <button onClick={() => handleExport(selectedQuiz.id, 'csv')} className="btn-secondary text-sm">Export CSV</button>
                  <button onClick={() => handleExport(selectedQuiz.id, 'excel')} className="btn-secondary text-sm">Export Excel</button>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20">
                  <h3 className="font-bold text-black mb-4">Question-wise Accuracy</h3>
                  <div className="space-y-3">
                    {analytics.questionStats?.map((q) => (
                      <div key={q.questionNumber} className="bg-white rounded-xl p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div className="text-sm font-medium flex-1 text-black">Q{q.questionNumber}. {q.questionText}</div>
                          <span className={`text-sm font-bold ${q.accuracy >= 70 ? 'text-green-600' : q.accuracy >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                            {q.accuracy}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all" style={{ width: `${q.accuracy}%` }} />
                        </div>
                        <div className="text-xs text-black mt-1">{q.correct}/{q.attempted} correct</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {editQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-white to-gray-50 p-6 w-full max-w-md rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20">
            <h2 className="font-bold text-black mb-4">Create New Quiz</h2>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" value={editQuiz.title} onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })} placeholder="Quiz Title" required />
              <textarea className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" value={editQuiz.description} onChange={(e) => setEditQuiz({ ...editQuiz, description: e.target.value })} placeholder="Description" rows={2} />
              <input className="input-field bg-white border-2 border-primary/30 text-black placeholder-gray-500" type="number" value={editQuiz.durationMinutes} onChange={(e) => setEditQuiz({ ...editQuiz, durationMinutes: parseInt(e.target.value) })} placeholder="Duration (minutes)" />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">Create</button>
                <button type="button" onClick={() => setEditQuiz(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
