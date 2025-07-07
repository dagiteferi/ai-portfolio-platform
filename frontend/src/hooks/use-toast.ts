import React from 'react';

const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`Toast: ${type} - ${message}`);
    // In a real application, you would integrate a toast library here
  };

  return { showToast };
};

export { useToast };
