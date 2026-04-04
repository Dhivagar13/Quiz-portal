import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await signup(formData.email, formData.password, formData.name);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden relative">
            {/* Background decoration */}
            <div className="bg-decoration">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
                <div className="bg-blob bg-blob-3"></div>
            </div>
            <div className="bg-blob-grid"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-6 sm:p-8 relative z-10"
            >
                <div className="glass-card inner-glow shadow-2xl p-6 sm:p-8">
                    {/* Logo / Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm sm:text-base">Join us and start challenging yourself</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
                            {loading ? 'Creating Account...' : (
                                <>
                                    Sign Up
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
