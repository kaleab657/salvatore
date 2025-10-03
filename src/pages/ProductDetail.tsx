import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart as HeartIcon, Share2 as Share2Icon, Flag as FlagIcon, MapPin as MapPinIcon, Clock as ClockIcon, Tag as TagIcon, Phone as PhoneIcon, MessageSquare as MessageSquareIcon, ChevronRight as ChevronRightIcon, Star as StarIcon, Loader as LoaderIcon, AlertCircle as AlertCircleIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import ImageCarousel from '../components/common/ImageCarousel';
import Button from '../components/common/Button';
import BottomNavigation from '../components/layout/BottomNavigation';
import { getListingById, Listing } from '../services/listingService';
import { getUserProfile } from '../services/userService';
import { UserProfile } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { createOrGetChat } from '../services/messageService';
const ProductDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    currentUser,
    isGuest
  } = useAuth();
  const [product, setProduct] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await getListingById(id);
        if (productData) {
          setProduct(productData);
          // Fetch seller information
          const sellerData = await getUserProfile(productData.userId);
          setSeller(sellerData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);
  const toggleFavorite = () => {
    if (isGuest) {
      navigate('/login', {
        state: {
          from: `/product/${id}`,
          message: 'Please sign in to save items to your wishlist'
        }
      });
      return;
    }
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to the user's favorites in Firestore
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Check out this product',
        text: product?.description || 'I found this great product on Salvatore Marketplace',
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  const handleReport = () => {
    if (isGuest) {
      navigate('/login', {
        state: {
          from: `/product/${id}`,
          message: 'Please sign in to report listings'
        }
      });
      return;
    }
    // In a real app, you would implement a reporting system
    alert('Thank you for your report. We will review this listing.');
  };
  const handleContactSeller = async () => {
    if (isGuest) {
      navigate('/login', {
        state: {
          from: `/product/${id}`,
          message: 'Please sign in to contact sellers'
        }
      });
      return;
    }
    if (!currentUser || !product) return;
    try {
      // Create or get chat with seller
      const chatId = await createOrGetChat(currentUser.uid, product.userId);
      // Navigate to chat screen
      navigate('/chat', {
        state: {
          chatId,
          otherUserId: product.userId,
          product: {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'
          }
        }
      });
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Failed to start chat. Please try again.');
    }
  };
  const handleCallSeller = () => {
    if (isGuest) {
      navigate('/login', {
        state: {
          from: `/product/${id}`,
          message: 'Please sign in to contact sellers'
        }
      });
      return;
    }
    if (!product?.phone) {
      alert('Seller phone number is not available');
      return;
    }
    window.location.href = `tel:${product.phone}`;
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading product details...</p>
      </div>;
  }
  if (error || !product) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircleIcon className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 text-center mb-6">
          {error || 'Product not found'}
        </p>
        <Button variant="primary" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </div>;
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      <Header showBack />
      <div className="bg-white">
        {/* Product Images */}
        <ImageCarousel images={product.images} />
        {/* Action Buttons */}
        <div className="px-4 py-3 flex justify-between">
          <div className="flex space-x-4">
            <button onClick={toggleFavorite} className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full ${isFavorite ? 'bg-red-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </div>
              <span className="text-xs text-gray-600 mt-1">Save</span>
            </button>
            <button onClick={handleShare} className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Share2Icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-600 mt-1">Share</span>
            </button>
          </div>
          <button onClick={handleReport} className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <FlagIcon className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600 mt-1">Report</span>
          </button>
        </div>
      </div>
      {/* Product Info */}
      <div className="bg-white mt-2 p-4">
        <h1 className="text-xl font-semibold text-gray-900">{product.title}</h1>
        <p className="text-2xl font-bold text-blue-600 mt-1">
          {product.price.toLocaleString()} ETB
        </p>
        <div className="flex flex-wrap items-center mt-3 text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{formatDate(product.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <TagIcon className="w-4 h-4 mr-1" />
            <span>{product.category}</span>
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="bg-white mt-2 p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {product.description}
        </p>
      </div>
      {/* Product Features */}
      {Object.keys(product.features).length > 0 && <div className="bg-white mt-2 p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product.features).map(([key, value]) => <div key={key} className="flex flex-col">
                <span className="text-sm text-gray-500">{key}</span>
                <span className="text-gray-900">{value || 'N/A'}</span>
              </div>)}
          </div>
        </div>}
      {/* Seller Info */}
      <div className="bg-white mt-2 p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Seller Information
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <img src={seller?.photoURL || 'https://via.placeholder.com/48?text=User'} alt={seller?.displayName || 'Seller'} className="w-12 h-12 rounded-full object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full px-1 py-0.5 border border-white">
                <div className="flex items-center">
                  <StarIcon className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-800">4.8</span>
                </div>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">
                {seller?.displayName || product.userDisplayName}
              </h3>
              <p className="text-sm text-gray-500">{product.sellerType}</p>
            </div>
          </div>
          <button onClick={() => navigate(`/user/${product.userId}`)} className="flex items-center text-blue-600 text-sm font-medium">
            View Profile
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      {/* Contact Buttons */}
      <div className="bg-white mt-2 p-4">
        <div className="grid grid-cols-2 gap-3">
          {(product.contactMethod === 'Both' || product.contactMethod === 'Chat') && <Button variant="outline" className="flex items-center justify-center" onClick={handleContactSeller}>
              <MessageSquareIcon className="w-5 h-5 mr-2" />
              Message
            </Button>}
          {(product.contactMethod === 'Both' || product.contactMethod === 'Phone') && product.phone && <Button variant="primary" className="flex items-center justify-center" onClick={handleCallSeller}>
                <PhoneIcon className="w-5 h-5 mr-2" />
                Call
              </Button>}
        </div>
      </div>
      <BottomNavigation />
    </div>;
};
export default ProductDetail;