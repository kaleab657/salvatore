import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User as UserIcon, Mail as MailIcon, Lock as LockIcon, Phone as PhoneIcon, Eye as EyeIcon, EyeOff as EyeOffIcon, AlertCircle as AlertCircleIcon, Camera as CameraIcon, X as XIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signup,
    signInWithGoogle,
    currentUser,
    updateUserProfile,
    continueAsGuest
  } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Get message from location state if redirected
  const message = location.state?.message || null;
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Create user with email and password
      await signup(formData.email, formData.password, formData.fullName);
      // If there's a profile image, upload it
      if (profileImage && currentUser) {
        const storageRef = ref(storage, `users/${currentUser.uid}/profile.${profileImage.name.split('.').pop()}`);
        await uploadBytes(storageRef, profileImage);
        const photoURL = await getDownloadURL(storageRef);
        // Update user profile with phone and photo URL
        await updateUserProfile({
          phoneNumber: formData.phone,
          photoURL
        });
      } else {
        // Update user profile with just the phone number
        await updateUserProfile({
          phoneNumber: formData.phone
        });
      }
      navigate('/home');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrors({
        general: error.message || 'Failed to create an account.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setErrors({
        general: error.message || 'Failed to sign in with Google.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageURL(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setProfileImage(null);
    setProfileImageURL(null);
  };
  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/home');
  };
  return <div className="min-h-screen bg-white pb-6">
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create Account
        </h1>
        <p className="text-gray-600">Join Salvatore Marketplace</p>
      </div>

      {/* Error Message */}
      {errors.general && <div className="mx-6 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center text-red-600">
            <AlertCircleIcon className="w-5 h-5 mr-2" />
            <span>{errors.general}</span>
          </div>
        </div>}

      {/* Profile Image Upload */}
      <div className="flex justify-center mb-8">
        {profileImageURL ? <div className="relative">
            <img src={profileImageURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <XIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div> : <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center cursor-pointer border-4 border-gray-100">
              <CameraIcon className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Add Photo</span>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>}
      </div>

      {/* Sign Up Form */}
      <div className="px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={`w-full py-3 pl-10 pr-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            {errors.fullName && <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-1" />
                <span>{errors.fullName}</span>
              </div>}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full py-3 pl-10 pr-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            {errors.email && <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-1" />
                <span>{errors.email}</span>
              </div>}
          </div>

          {/* Phone */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={`w-full py-3 pl-10 pr-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            {errors.phone && <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-1" />
                <span>{errors.phone}</span>
              </div>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`w-full py-3 pl-10 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
              <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? <EyeOffIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-1" />
                <span>{errors.password}</span>
              </div>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className={`w-full py-3 pl-10 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
              <button type="button" onClick={toggleShowConfirmPassword} className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showConfirmPassword ? <EyeOffIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.confirmPassword && <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-1" />
                <span>{errors.confirmPassword}</span>
              </div>}
          </div>

          {/* Sign Up Button */}
          <Button variant="primary" fullWidth size="lg" className="mt-6" onClick={handleSubmit}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Google Sign Up */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button type="button" onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-gray-700">
              Sign up with Google
            </span>
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600">
                Sign In
              </Link>
            </p>
          </div>

          {/* Continue as Guest button at the bottom */}
          <div className="p-6">
            <button onClick={handleGuestAccess} className="w-full py-3 text-gray-700 font-medium border border-gray-300 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default SignUp;