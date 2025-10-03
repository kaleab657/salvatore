import React, { useEffect, useState, createElement } from 'react';
import { Settings as SettingsIcon, ShoppingBag as ShoppingBagIcon, Heart as HeartIcon, CreditCard as CreditCardIcon, LogOut as LogOutIcon, MessageSquare as MessageSquareIcon, Star as StarIcon, MapPin as MapPinIcon, Phone as PhoneIcon, Mail as MailIcon, Loader as LoaderIcon } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { getUserListings } from '../services/listingService';
import { UserProfile } from '../services/userService';
import { Listing } from '../services/listingService';
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    isGuest
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  // Check if in guest mode and redirect to login
  useEffect(() => {
    if (isGuest) {
      navigate('/login', {
        state: {
          from: '/profile',
          message: 'Please sign in to view your profile'
        }
      });
    }
  }, [isGuest, navigate]);
  // Mock reviews - in a real app, this would come from the database
  const reviews = [{
    id: 1,
    author: 'Sara Tesfaye',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    text: 'Great seller! Very responsive and the product was exactly as described.'
  }, {
    id: 2,
    author: 'Dawit Haile',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    rating: 4,
    date: '1 month ago',
    text: 'Good experience overall. Shipping was a bit delayed but the product was in excellent condition.'
  }, {
    id: 3,
    author: 'Tigist Alemu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    rating: 5,
    date: '2 months ago',
    text: 'Excellent service! Would definitely buy from this seller again.'
  }];
  // Fetch user profile and listings
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        // Fetch user profile
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
        // Fetch user listings
        const listings = await getUserListings(currentUser.uid);
        setUserListings(listings);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);
  const handleContactSeller = () => {
    navigate('/chat');
  };
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try {
        await logout();
        // Show logout success message with timeout
        const message = document.createElement('div');
        message.className = 'fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 z-50';
        message.textContent = 'Successfully logged out';
        document.body.appendChild(message);
        setTimeout(() => {
          document.body.removeChild(message);
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out. Please try again.');
      }
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>;
  }
  if (!currentUser || !userProfile) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile.
          </p>
          <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        <button onClick={handleSettingsClick}>
          <SettingsIcon className="w-6 h-6 text-gray-800" />
        </button>
      </header>

      {/* User Info */}
      <div className="bg-white p-4 shadow-sm mb-4">
        <div className="flex items-start">
          <div className="relative">
            <img src={userProfile.photoURL || 'https://via.placeholder.com/150?text=No+Image'} alt="Profile" className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-100" />
            <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full px-1.5 py-0.5 border border-white">
              <div className="flex items-center">
                <StarIcon className="w-3 h-3 text-yellow-500 mr-0.5" />
                <span className="text-xs font-medium text-gray-800">4.8</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userProfile.displayName}
                </h2>
                <p className="text-sm text-gray-600">
                  Member since{' '}
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-blue-50 px-2 py-1 rounded-md">
                <span className="text-xs font-medium text-blue-700">
                  {reviews.length} reviews
                </span>
              </div>
            </div>
            <p className="mt-2 text-gray-700 text-sm">
              {userProfile.bio || 'No bio provided yet.'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" fullWidth className="flex items-center justify-center" onClick={handleContactSeller}>
            <MessageSquareIcon className="w-4 h-4 mr-1.5" />
            Message
          </Button>
          <Button variant="primary" fullWidth className="flex items-center justify-center" onClick={() => window.location.href = `tel:${userProfile.phoneNumber}`}>
            <PhoneIcon className="w-4 h-4 mr-1.5" />
            Call
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span>{userProfile.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span>
              {userProfile.phoneNumber || 'Phone number not provided'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span>{userProfile.email}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mb-4">
        <div className="flex border-b border-gray-200">
          <button className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === 'listings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('listings')}>
            Listings ({userListings.length})
          </button>
          <button className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('reviews')}>
            Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'listings' && <>
            {userListings.length === 0 ? <div className="bg-white rounded-xl p-6 text-center">
                <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No listings yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start selling by creating your first listing
                </p>
                <Button variant="primary" onClick={() => navigate('/post-ad')} className="px-6">
                  Post an Ad
                </Button>
              </div> : <div className="grid grid-cols-2 gap-3 mb-6">
                {userListings.map(listing => <ProductCard key={listing.id} id={listing.id!} title={listing.title} price={listing.price} location={listing.location} category={listing.category} image={listing.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} date={new Date(listing.createdAt).toLocaleDateString()} isFeatured={listing.isFeatured} />)}
              </div>}
          </>}

        {activeTab === 'reviews' && <div className="space-y-4 mb-6">
            {reviews.map(review => <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full object-cover mr-2" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {review.author}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />)}
                      <span className="text-xs text-gray-500 ml-1">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>)}
          </div>}
      </div>

      {/* Profile Menu */}
      <div className="bg-white rounded-xl shadow-sm mb-4 mx-4">
        <div className="p-4 border-b border-gray-100 flex items-center cursor-pointer" onClick={() => navigate('/my-listings')}>
          <ShoppingBagIcon className="w-6 h-6 text-blue-600 mr-3" />
          <span className="font-medium text-gray-800">My Listings</span>
        </div>
        <div className="p-4 border-b border-gray-100 flex items-center cursor-pointer" onClick={() => navigate('/wishlist')}>
          <HeartIcon className="w-6 h-6 text-blue-600 mr-3" />
          <span className="font-medium text-gray-800">My Wishlist</span>
        </div>
        <div className="p-4 flex items-center cursor-pointer" onClick={() => navigate('/payments')}>
          <CreditCardIcon className="w-6 h-6 text-blue-600 mr-3" />
          <span className="font-medium text-gray-800">Payments</span>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4">
        <button className="flex items-center justify-center w-full py-3 text-red-600 font-medium bg-white rounded-xl shadow-sm" onClick={handleLogout}>
          <LogOutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>;
};
export default Profile;