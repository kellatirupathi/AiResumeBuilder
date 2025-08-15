import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/Services/login';
import { Loader2, Mail, Check, AlertCircle } from 'lucide-react';

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setIsFocused(false);
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    // Validate email before submitting
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await requestPasswordReset({ email });
      setIsSubmitted(true);
    } catch (err) {
      toast.error("Request Failed", {
        description: err.message || "Something went wrong. Please try again."
      });
    } finally {
        setLoading(false);
    }
  };

  const closeModalAndReset = () => {
    onClose();
    setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setEmailError('');
        setLoading(false);
        setIsFocused(false);
    }, 300); // Delay to allow animation
  };

  const isValidEmail = email && validateEmail(email);
  const showError = emailError && !isFocused;
  const showSuccess = email && isValidEmail && !isFocused;

  return (
    <Dialog open={isOpen} onOpenChange={closeModalAndReset}>
      <DialogContent className="sm:max-w-md bg-white p-8 rounded-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-indigo-600">Forgot Password</DialogTitle>
          <DialogDescription className="text-center text-gray-500 pt-2">
            {isSubmitted 
              ? "Check your inbox for the reset link." 
              : "Enter your registered email address to receive a password reset link."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
            <div className="text-center py-6">
                <Mail className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                <p className="text-gray-700">A password reset link has been sent to <span className="font-semibold">{email}</span>. Please check your inbox and spam folder.</p>
                <Button onClick={closeModalAndReset} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700">Close</Button>
            </div>
        ) : (
            <form onSubmit={handleRequestReset} className="space-y-6 pt-4">
                <div className="space-y-2">
                    <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className={`
                            flex items-center border rounded-lg p-3 transition-all duration-200
                            ${isFocused 
                                ? 'ring-2 ring-indigo-500 border-indigo-300' 
                                : showError 
                                    ? 'ring-2 ring-red-300 border-red-300' 
                                    : showSuccess
                                        ? 'ring-2 ring-green-300 border-green-300'
                                        : 'border-gray-300 hover:border-gray-400'
                            }
                        `}>
                            <Mail className={`
                                mr-3 h-5 w-5 transition-colors duration-200
                                ${isFocused 
                                    ? 'text-indigo-500' 
                                    : showError 
                                        ? 'text-red-400' 
                                        : showSuccess
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                }
                            `} />
                            <Input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={handleEmailBlur}
                                placeholder="Enter your email address"
                                required
                                className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent"
                                autoComplete="email"
                            />
                            {showSuccess && (
                                <Check className="h-5 w-5 text-green-500 ml-2" />
                            )}
                            {showError && (
                                <AlertCircle className="h-5 w-5 text-red-400 ml-2" />
                            )}
                        </div>
                        
                        {/* Error message */}
                        {showError && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {emailError}
                            </p>
                        )}
                        
                        {/* Success message */}
                        {showSuccess && (
                            <p className="mt-1 text-sm text-green-600 flex items-center">
                                
                            </p>
                        )}
                    </div>
                </div>
            
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={loading || !isValidEmail}
                        className={`
                            w-full py-3 transition-all duration-200
                            ${loading || !isValidEmail 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Sending...
                            </div>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordModal;
