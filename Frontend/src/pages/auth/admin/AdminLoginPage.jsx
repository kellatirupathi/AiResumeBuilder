import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '@/Services/adminApi';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

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
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Login Failed', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Admin Portal</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="bg-gray-700 border-gray-600 text-white"
          />
          <div className="relative">
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="bg-gray-700 border-gray-600 text-white"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-indigo-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
