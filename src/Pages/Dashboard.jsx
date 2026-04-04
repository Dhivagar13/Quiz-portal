import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { databases } from '../lib/appwrite';
import { motion } from 'framer-motion';
import { LogOut, Play, BarChart3, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_QUIZZES
                );
                setQuizzes(response.documents);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="bg-decoration">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
            </div>
            <div className="bg-blob-grid"></div>

            {/* Sticky Header */}
            <nav className="sticky top-0 z-50 glass-dark">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                                Quiz Dashboard
                            </h1>
                            <p className="text-gray-400 text-xs">Hello, {user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="badge hidden sm:flex">
                            <BarChart3 className="w-3 h-3" />
                            {quizzes.length}{quizzes.length === 1 ? ' quiz' : ' quizzes'}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-gray-300 hover:text-white transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center py-20"
                    >
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz, index) => (
                                <motion.div
                                    key={quiz.$id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="relative group overflow-hidden rounded-xl"
                                >
                                    <div className="p-6 glass-card card-glow h-full flex flex-col justify-between">
                                        <div>
                                            {/* Card top bar with icon */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                                                    <Play className="w-4 h-4 text-blue-400 ml-0.5" />
                                                </div>
                                                <h3 className="text-lg font-semibold">{quiz.name}</h3>
                                            </div>
                                            {quiz.description && (
                                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                                    {quiz.description.slice(0, 100)}
                                                    {quiz.description.length > 100 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <Button onClick={() => navigate(`/quiz/${quiz.slug}`)} className="w-full text-sm py-2.5">
                                            Start Quiz
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-16 px-4 glass-card rounded-xl border-dashed"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                                    <BarChart3 className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">No quizzes available</h3>
                                <p className="text-gray-500 text-sm">Check back later for new quizzes!</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
