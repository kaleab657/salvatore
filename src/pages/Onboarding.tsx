import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart as ShoppingCartIcon, Tag as TagIcon, MessageCircle as MessageCircleIcon, CreditCard as CreditCardIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { onboardingSlides } from '../utils/data';
const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-cart':
        return <ShoppingCartIcon className="w-12 h-12 text-blue-600" />;
      case 'tag':
        return <TagIcon className="w-12 h-12 text-blue-600" />;
      case 'message-circle':
        return <MessageCircleIcon className="w-12 h-12 text-blue-600" />;
      case 'credit-card':
        return <CreditCardIcon className="w-12 h-12 text-blue-600" />;
      default:
        return null;
    }
  };
  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/home');
    }
  };
  const handleSkip = () => {
    navigate('/home');
  };
  const slide = onboardingSlides[currentSlide];
  return <div className="flex flex-col min-h-screen bg-white px-6">
      <div className="flex justify-end py-4">
        <button className="text-gray-500 text-sm font-medium" onClick={handleSkip}>
          Skip
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-blue-100">
          {getIcon(slide.icon)}
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          {slide.title}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xs">
          {slide.description}
        </p>
      </div>
      <div className="mb-8">
        <div className="flex justify-center mb-8">
          {onboardingSlides.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full mx-1 ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`} />)}
        </div>
        <Button variant="primary" fullWidth size="lg" onClick={handleNext}>
          {currentSlide < onboardingSlides.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </div>
    </div>;
};
export default Onboarding;