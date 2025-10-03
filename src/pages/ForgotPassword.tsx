import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail as MailIcon, AlertCircle as AlertCircleIcon, CheckCircle as CheckCircleIcon, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    resetPassword
  } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };
  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBack = () => {
    navigate('/login');
  };
  return <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Forgot Password</h1>
      </header>
      <div className="flex flex-col items-center px-6 pt-8 pb-6 flex-1">
        {!isSuccess ? <>
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <MailIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="email" value={email} onChange={handleChange} placeholder="Email Address" className={`w-full py-3 pl-10 pr-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                </div>
                {error && <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircleIcon className="w-4 h-4 mr-1" />
                    <span>{error}</span>
                  </div>}
              </div>
              <Button variant="primary" fullWidth size="lg" className="mt-6" onClick={handleSubmit}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </> : <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 text-center mb-8">
              We've sent a password reset link to
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <Button variant="outline" fullWidth size="lg" onClick={handleBack}>
              Back to Login
            </Button>
          </div>}
      </div>
    </div>;
};
export default ForgotPassword;