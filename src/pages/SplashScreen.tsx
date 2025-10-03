import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-32 h-32 mb-6">
        <img src="/icon.png" alt="Salvatore Marketplace Logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Salvatore Marketplace
      </h1>
      <p className="text-center text-gray-600">
        Ethiopia Marketplace for Buying and Selling Everything
      </p>
    </div>;
};
export default SplashScreen;