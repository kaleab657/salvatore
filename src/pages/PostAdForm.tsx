import React, { useEffect, useState, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera as CameraIcon, MapPin as MapPinIcon, Plus as PlusIcon, X as XIcon, Loader as LoaderIcon } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import Header from '../components/layout/Header';
import LocationSelector from '../components/common/LocationSelector';
import { categories } from '../utils/data';
import { useAuth } from '../contexts/AuthContext';
import { createListing, uploadListingImages } from '../services/listingService';
interface ImageUpload {
  id: string;
  file: File;
  url: string;
}
const PostAdForm: React.FC = () => {
  const {
    categoryId
  } = useParams<{
    categoryId: string;
  }>();
  const navigate = useNavigate();
  const {
    currentUser
  } = useAuth();
  const [category, setCategory] = useState<any>(null);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    description: '',
    price: '',
    location: '',
    sellerType: 'Individual',
    contactMethod: 'Both',
    phone: '',
    features: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (categoryId) {
      const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId));
      if (selectedCategory) {
        setCategory(selectedCategory);
        // Initialize features object with empty values
        const features: Record<string, any> = {};
        selectedCategory.fields.forEach((field: any) => {
          features[field.name] = '';
        });
        setFormData(prev => ({
          ...prev,
          features,
          phone: currentUser.phoneNumber || ''
        }));
      } else {
        navigate('/post-ad');
      }
    }
  }, [categoryId, navigate, currentUser]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    // Check if this is a feature field
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleLocationChange = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: ''
      }));
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImageUpload[] = [];
      Array.from(e.target.files).forEach(file => {
        // Check if we already have 10 images
        if (images.length + newImages.length >= 10) return;
        newImages.push({
          id: `img-${Date.now()}-${newImages.length}`,
          file,
          url: URL.createObjectURL(file)
        });
      });
      setImages(prev => [...prev, ...newImages]);
    }
  };
  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Revoke object URLs to prevent memory leaks
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return updated;
    });
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if ((formData.contactMethod === 'Both' || formData.contactMethod === 'Phone') && !formData.phone) {
      newErrors.phone = 'Phone number is required for the selected contact method';
    }
    // Check required category fields
    if (category && category.fields) {
      category.fields.forEach((field: any) => {
        if (field.required && !formData.features[field.name]) {
          newErrors[`features.${field.name}`] = `${field.label} is required`;
        }
      });
    }
    // Check if at least one image is uploaded
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }
    setIsSubmitting(true);
    try {
      // Create listing without images first
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: category.name,
        location: formData.location,
        sellerType: formData.sellerType,
        contactMethod: formData.contactMethod,
        phone: formData.phone,
        features: formData.features,
        isFeatured: false,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || 'Anonymous',
        userPhotoURL: currentUser.photoURL || '',
        images: [] // Will be updated after upload
      };
      const listingId = await createListing(listingData);
      // Upload images
      if (images.length > 0) {
        const imageFiles = images.map(img => img.file);
        const imageUrls = await uploadListingImages(currentUser.uid, listingId, imageFiles);
        // Update listing with image URLs
        await updateListing(listingId, {
          images: imageUrls
        });
      }
      // Show success message
      alert('Your ad has been posted successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error posting ad:', error);
      alert('Failed to post your ad. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!category) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20 relative">
      <Header showBack title={`Post in ${category.name}`} />
      <form onSubmit={handleSubmit} className="p-4">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium text-gray-900 mb-3">
            Add Photos (up to 10)
          </h3>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map(img => <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden">
                <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1" onClick={() => removeImage(img.id)}>
                  <XIcon className="w-3 h-3 text-white" />
                </button>
              </div>)}
            {images.length < 10 && <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer">
                <CameraIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>}
          </div>
          <p className="text-xs text-gray-500">
            First image will be the cover. Add at least one photo.
          </p>
          {errors.images && <p className="text-xs text-red-500 mt-1 error-message">
              {errors.images}
            </p>}
        </div>
        {/* Universal Fields */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Ad Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter a descriptive title" className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
              {errors.title && <p className="text-xs text-red-500 mt-1 error-message">
                  {errors.title}
                </p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your item in detail" className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg h-24`} />
              {errors.description && <p className="text-xs text-red-500 mt-1 error-message">
                  {errors.description}
                </p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (ETB)*
              </label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter price in ETB" className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
              {errors.price && <p className="text-xs text-red-500 mt-1 error-message">
                  {errors.price}
                </p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <LocationSelector value={formData.location} onChange={handleLocationChange} />
              {errors.location && <p className="text-xs text-red-500 mt-1 error-message">
                  {errors.location}
                </p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller Type*
              </label>
              <select name="sellerType" value={formData.sellerType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Method*
              </label>
              <select name="contactMethod" value={formData.contactMethod} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Both">Phone & In-App Chat</option>
                <option value="Phone">Phone Only</option>
                <option value="Chat">In-App Chat Only</option>
              </select>
            </div>
            {(formData.contactMethod === 'Both' || formData.contactMethod === 'Phone') && <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1 error-message">
                    {errors.phone}
                  </p>}
              </div>}
          </div>
        </div>
        {/* Category-specific Fields */}
        {category.fields && category.fields.length > 0 && <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {category.name} Details
            </h3>
            <div className="space-y-4">
              {category.fields.map((field: any) => <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required ? '*' : ''}
                  </label>
                  {field.type === 'select' ? <select name={`features.${field.name}`} value={formData.features[field.name] || ''} onChange={handleInputChange} className={`w-full p-2 border ${errors[`features.${field.name}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
                      <option value="">Select {field.label}</option>
                      {field.options.map((option: string) => <option key={option} value={option}>
                          {option}
                        </option>)}
                    </select> : <input type={field.type} name={`features.${field.name}`} value={formData.features[field.name] || ''} onChange={handleInputChange} placeholder={`Enter ${field.label.toLowerCase()}`} className={`w-full p-2 border ${errors[`features.${field.name}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />}
                  {errors[`features.${field.name}`] && <p className="text-xs text-red-500 mt-1 error-message">
                      {errors[`features.${field.name}`]}
                    </p>}
                </div>)}
            </div>
          </div>}
        {/* Spacer to ensure content doesn't get hidden behind the floating button */}
        <div className="h-24"></div>
      </form>
      {/* New Floating Circular Post Ad Button */}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="fixed bottom-24 right-6 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-sm
                 bg-gradient-to-r from-blue-500 to-purple-600 
                 shadow-lg shadow-blue-500/30
                 hover:shadow-xl hover:shadow-blue-500/40
                 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                 active:scale-95 transition-all duration-200
                 disabled:opacity-70 disabled:cursor-not-allowed" style={{
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
    }}>
        <div className="flex flex-col items-center justify-center">
          {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : <>
              <PlusIcon className="w-6 h-6 mb-0.5" />
              <span>Post Ad</span>
            </>}
        </div>
      </button>
      <BottomNavigation />
    </div>;
};
export default PostAdForm;