import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { completeProfile } from '@/Services/login';
import { addUserData } from '@/features/user/userFeatures';
import { Loader2, ArrowRight, X, AlertCircle } from 'lucide-react';
import { FaIdBadge } from 'react-icons/fa';

function CompleteProfilePage() {
    const [niatId, setNiatId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Auto-hide error after 2 seconds
    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                // Clear error after animation completes
                setTimeout(() => setError(''), 300);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowError(false);

        const niatIdRegex = /^N24H01[A-Z]\d{4}$/;
        if (!niatIdRegex.test(niatId)) {
            setError("Invalid NIAT ID format. Correct format is N24H01X####.");
            return;
        }
        
        setLoading(true);
        try {
            const response = await completeProfile({ niatId });
            dispatch(addUserData(response.data));
            toast.success("Profile complete!", {
                description: "Welcome! Redirecting you to the dashboard..."
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Failed to update profile. Please check the NIAT ID and try again.");
            toast.error("Update failed", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setShowError(false);
        setTimeout(() => setError(''), 300);
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4 relative">
            {/* Top-right error notification */}
            {error && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ease-in-out ${
                    showError ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
                }`}>
                    <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                        <button
                            onClick={handleCloseError}
                            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">One Last Step</h2>
                    <p className="text-gray-600">To complete your registration, please provide your NIAT ID.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="niatId" className="block text-sm font-medium text-gray-700">
                            NIAT ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaIdBadge className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="niatId"
                                type="text"
                                className="pl-10 h-12 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., N24H01B1234"
                                value={niatId}
                                onChange={(e) => setNiatId(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 h-12 text-base font-medium transition-all duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Completing...
                            </>
                        ) : (
                            <>
                                Complete Profile 
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Need help? Contact support for assistance with your NIAT ID.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CompleteProfilePage;
