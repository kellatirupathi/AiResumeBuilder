import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { resetPassword } from '@/Services/login';
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import logo from '/logo.svg';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValidToken, setIsValidToken] = useState(true);

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            setError("Invalid or missing reset token. Please request a new link.");
            setIsValidToken(false);
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, newPassword, confirmPassword });
            toast.success("Password Reset Successfully!", {
                description: "You can now sign in with your new password."
            });
            navigate('/auth/sign-in');
        } catch (err) {
            setError(err.message || "Failed to reset password. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="p-4">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">NxtResume</span>
                </Link>
            </header>
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Set New Password</h2>
                    
                    {!isValidToken ? (
                         <div className="text-center py-4">
                            <p className="text-red-600">{error}</p>
                            <Button variant="link" asChild className="mt-4"><Link to="/auth/sign-in">Back to Sign In</Link></Button>
                         </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div>
                                <label className="text-sm font-medium">New Password</label>
                                <div className="flex items-center border rounded-lg p-3 mt-1">
                                    <FaLock className="text-gray-400 mr-3" />
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                        className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <div className="flex items-center border rounded-lg p-3 mt-1">
                                    <FaLock className="text-gray-400 mr-3" />
                                    <Input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                        className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent"
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                           
                           {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                           <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3">
                                {loading ? <Loader2 className="animate-spin"/> : 'Reset Password'}
                           </Button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ResetPasswordPage;
