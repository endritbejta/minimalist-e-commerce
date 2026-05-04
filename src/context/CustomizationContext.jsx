import React, { createContext, useContext, useState } from 'react';

const CustomizationContext = createContext();

/**
 * CustomizationProvider Component
 * Manages the state of product customizations (emblems, positions, etc.) during selection.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Subtree with access to customization state.
 */
export const CustomizationProvider = ({ children }) => {
  const [customization, setCustomization] = useState(null);

  // Helper to update specific parts of the customization
  const updateCustomization = (newData) => {
    setCustomization(prev => ({
      ...prev,
      ...newData
    }));
  };

  const clearCustomization = () => {
    setCustomization(null);
  };

  return (
    <CustomizationContext.Provider 
      value={{ 
        customization, 
        setCustomization, 
        updateCustomization, 
        clearCustomization 
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
