import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '@/Services/adminApi';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, ArrowRight } from 'lucide-react';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin({ email, password });
      toast.success('Admin login successful!', {
        description: 'Redirecting to dashboard...'
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Login Failed', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Login card */}
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-2xl -z-10"></div>
          
          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-indigo-200 text-sm">Enter your credentials to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-indigo-200">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-300" />
                </div>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-indigo-300/70 focus:border-indigo-400 focus:ring focus:ring-indigo-400/20"
                />
              </div>
            </div>
            
            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-indigo-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300" />
                </div>
                <Input 
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-indigo-300/70 focus:border-indigo-400 focus:ring focus:ring-indigo-400/20"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
