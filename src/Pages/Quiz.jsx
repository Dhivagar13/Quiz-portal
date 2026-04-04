import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { shuffleArray } from '../lib/quizHelpers';
import { databases } from '../lib/appwrite';
import { Query } from 'appwrite';
import { AlertTriangle, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

const Quiz = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cheatWarning, setCheatWarning] = useState(null);
    const [error, setError] = useState(null);

    // Anti-Cheat Callback
    const handleCheat = (reason) => {
        if (!cheatWarning) {
            setCheatWarning(reason);
        }
    };

    useAntiCheat(handleCheat);

    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_QUESTIONS,
                    [
                        Query.equal('quizId', sectionId)
                    ]
                );

                if (response.documents.length === 0) {
                    setError("No questions found for this section.");
                } else {
                    const shuffled = shuffleArray(response.documents);
                    setQuestions(shuffled);
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
                setError("Failed to load quiz. Please check your internet connection.");
            }
            setLoading(false);
        };
        loadQuestions();
    }, [sectionId]);

    const handleAnswer = (option) => {
        const newAnswers = [...answers, {
            questionId: questions[currentQuestionIndex].$id,
            selectedOption: option
        }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = async (finalAnswers) => {
        navigate('/result', { state: { answers: finalAnswers, questions, cheatWarning, quizId: sectionId } });
    };

    // Cheat warning screen
    if (cheatWarning) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 relative overflow-hidden">
                <div className="bg-blob" style={{ background: '#ef4444', opacity: 0.15, filter: 'blur(150px)', width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', position: 'absolute' }}></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md relative z-10"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-red-500 mb-3">Cheating Detected</h1>
                    <p className="text-gray-300 mb-2">Reason: {cheatWarning}</p>
                    <p className="text-gray-500 mb-8 text-sm">Your quiz has been terminated. Score marked as 0.</p>
                    <Button onClick={() => navigate('/dashboard')} variant="secondary" className="w-full sm:w-auto">
                        Return to Dashboard
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 text-center">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">{error}</h2>
                <Button onClick={() => navigate('/dashboard')} variant="secondary">Return to Dashboard</Button>
            </div>
        </div>
    );

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="bg-decoration">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-3"></div>
            </div>
            <div className="bg-blob-grid"></div>

            <div className="relative z-10 flex flex-col items-center px-4 py-4 sm:py-6">

                {/* Header - sticky on mobile */}
                <div className="w-full max-w-2xl mb-6">
                    {/* Question info bar */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs sm:text-sm glass-light rounded-lg px-3 py-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-gray-300">
                                    <span className="text-white font-semibold">{currentQuestionIndex + 1}</span>
                                    <span className="text-gray-500"> / {questions.length}</span>
                                </span>
                            </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 font-medium truncate ml-2 max-w-[200px] sm:max-w-none">
                            {sectionId}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar">
                        <motion.div
                            className="progress-bar__fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Question card */}
                <div className="w-full max-w-2xl mt-2">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card p-5 sm:p-8 rounded-2xl shadow-xl"
                        >
                            <h2 className="text-lg sm:text-2xl font-semibold mb-6 sm:mb-8 leading-snug">
                                {currentQuestion.text}
                            </h2>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(55, 65, 81, 1)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(option)}
                                        className="quiz-option"
                                    >
                                        <span className="quiz-option__letter">
                                            {optionLetters[index] || index + 1}
                                        </span>
                                        <span className="flex-1">{option}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation hint */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-gray-600 text-xs">
                            {currentQuestionIndex < questions.length - 1
                                ? 'Select to continue to next question'
                                : 'Select to finish the quiz'}
                        </p>
                        {currentQuestionIndex > 0 && (
                            <button
                                onClick={() => {
                                    setCurrentQuestionIndex(prev => prev - 1);
                                    setAnswers(prev => prev.slice(0, -1));
                                }}
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
