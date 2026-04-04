import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { calculateScore } from '../lib/quizHelpers';
import { databases } from '../lib/appwrite';
import { ID } from 'appwrite';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Award, XCircle, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    useEffect(() => {
        const saveResult = async () => {
            if (user) {
                try {
                    await databases.createDocument(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID,
                        import.meta.env.VITE_APPWRITE_COLLECTION_RESULTS,
                        ID.unique(),
                        {
                            userId: user.$id,
                            quizId: quizId || '',
                            score: score !== undefined ? score : 0,
                            total: total !== undefined ? total : 0,
                            cheatingDetected: cheatWarning ? true : false
                        }
                    );
                } catch (error) {
                    console.error("Failed to save result:", error);
                }
            }
        };
        if (state) saveResult();
    }, [state, user]);

    // Handle direct access or missing state
    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-gray-600" />
                    </div>
                    <h2 className="text-xl mb-4">No Result Found</h2>
                    <Button onClick={() => navigate('/dashboard')} variant="secondary">Go Home</Button>
                </div>
            </div>
        );
    }

    const { answers, questions, cheatWarning, quizId } = state;
    const score = cheatWarning ? 0 : calculateScore(answers, questions);
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // Grade message
    const getGradeMessage = () => {
        if (cheatWarning) return { text: 'Quiz terminated due to cheating', color: 'text-red-400', sub: 'Your score has been zeroed.' };
        if (percentage >= 80) return { text: 'Excellent Work!', color: 'text-green-400', sub: 'You have a strong grasp of this material.' };
        if (percentage >= 60) return { text: 'Good Effort!', color: 'text-blue-400', sub: 'Solid performance, room for improvement.' };
        if (percentage >= 40) return { text: 'Keep Practicing!', color: 'text-amber-400', sub: 'Review the material and try again.' };
        return { text: 'Needs Improvement', color: 'text-red-400', sub: 'Consider revisiting the topic material.' };
    };
    const grade = getGradeMessage();

    // Circular progress
    const circumference = 2 * Math.PI * 54;
    const strokeOffset = circumference - (percentage / 100) * circumference;

    const getRingColor = () => {
        if (cheatWarning) return '#ef4444';
        if (percentage >= 80) return '#22c55e';
        if (percentage >= 60) return '#3b82f6';
        if (percentage >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="bg-decoration">
                <div className="bg-blob bg-blob-1" style={{ opacity: 0.08, background: getRingColor() }}></div>
                <div className="bg-blob bg-blob-2"></div>
            </div>
            <div className="bg-blob-grid"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card inner-glow rounded-2xl shadow-2xl p-6 sm:p-8 text-center">

                    {cheatWarning ? (
                        <div className="mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">Disqualified</h1>
                            <p className="text-gray-400 text-sm">Cheating detected: {cheatWarning}</p>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-float">
                                <Award className="w-8 h-8 text-green-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                                Quiz Completed!
                            </h1>
                            <p className="text-gray-400 text-sm">Great effort!</p>
                        </div>
                    )}

                    {/* Score Ring */}
                    <div className="flex justify-center items-center py-6">
                        <div className="score-ring">
                            <svg viewBox="0 0 120 120">
                                <circle
                                    className="score-ring__bg"
                                    cx="60" cy="60" r="54"
                                />
                                <motion.circle
                                    className="score-ring__fill"
                                    cx="60" cy="60" r="54"
                                    stroke={getRingColor()}
                                    strokeDasharray={circumference}
                                    animate={{
                                        strokeDashoffset: animated ? strokeOffset : circumference
                                    }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                />
                            </svg>
                            <div className="score-ring__text">
                                <span className="text-2xl font-bold">{percentage}%</span>
                                <span className="text-xs text-gray-500">{score}/{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Grade message */}
                    <div className={`text-lg font-semibold mb-8 ${grade.color}`}>
                        {grade.text}
                    </div>
                    <p className="text-gray-500 text-sm -mt-6 mb-8">{grade.sub}</p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <Button onClick={() => navigate('/dashboard')} className="w-full">
                            <span className="flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                Back to Dashboard
                            </span>
                        </Button>
                        {!cheatWarning && (
                            <Button
                                onClick={() => navigate(`/quiz/${quizId}`)}
                                variant="secondary"
                                className="w-full"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Retake Quiz
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Result;
