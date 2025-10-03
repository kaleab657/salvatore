import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, Camera as CameraIcon, X as XIcon, User as UserIcon, Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, CheckCircle as CheckCircleIcon, Loader as LoaderIcon } from 'lucide-react';
import Button from '../components/common/Button';
import LocationSelector from '../components/common/LocationSelector';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../services/userService';
import { UserProfile } from '../services/userService';
const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [newProfileImageURL, setNewProfileImageURL] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    phoneNumber?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setFormData({
            displayName: profile.displayName,
            email: profile.email,
            phoneNumber: profile.phoneNumber || '',
            location: profile.location || '',
            bio: profile.bio || ''
          });
          setProfileImage(profile.photoURL || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [currentUser, navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  const handleLocationChange = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };
  const validateForm = () => {
    const newErrors: {
      displayName?: string;
      phoneNumber?: string;
    } = {};
    if (!formData.displayName) {
      newErrors.displayName = 'Full name is required';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !currentUser) return;
    setIsSubmitting(true);
    try {
      // If there's a new profile image, upload it
      let photoURL = profileImage;
      if (newProfileImage) {
        photoURL = await uploadProfilePicture(currentUser.uid, newProfileImage);
      }
      // Update user profile
      await updateUserProfile(currentUser.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        bio: formData.bio,
        photoURL
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setNewProfileImageURL(URL.createObjectURL(file));
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-6">
      <header className="bg-white px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/settings')} className="mr-3">
            <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
        </div>
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting} className="px-4">
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </header>
      {/* Success Message */}
      {showSuccess && <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 z-50 flex items-center justify-center">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          <span>Profile updated successfully</span>
        </div>}
      {/* Profile Image */}
      <div className="flex justify-center my-8">
        <div className="relative">
          <img src={newProfileImageURL || profileImage || 'https://via.placeholder.com/150?text=No+Image'} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
          <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-md border-2 border-white">
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              <CameraIcon className="w-4 h-4 text-white" />
            </label>
            <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </div>
      {/* Edit Form */}
      <div className="px-4">
        <form className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className={`w-full py-3 pl-10 pr-3 border ${errors.displayName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            {errors.displayName && <p className="mt-1 text-red-500 text-sm">{errors.displayName}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="email" name="email" value={formData.email} disabled className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg text-gray-500 bg-gray-50" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`w-full py-3 pl-10 pr-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            {errors.phoneNumber && <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <LocationSelector value={formData.location || ''} onChange={handleLocationChange} />
          </div>
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </form>
      </div>
    </div>;
};
export default EditProfile;