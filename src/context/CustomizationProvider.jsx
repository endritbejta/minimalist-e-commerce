import { useCallback, useMemo, useState } from 'react';
import { CustomizationContext } from './CustomizationContext';

/**
 * CustomizationProvider Component
 * Holds the customization (emblem, placement, sizing) being applied to a
 * product while the shopper configures it.
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Subtree with access to customization state.
 */
export const CustomizationProvider = ({ children }) => {
  const [customization, setCustomization] = useState(null);

  const updateCustomization = useCallback((patch) => {
    setCustomization((previous) => ({ ...previous, ...patch }));
  }, []);

  const clearCustomization = useCallback(() => setCustomization(null), []);

  const value = useMemo(
    () => ({ customization, setCustomization, updateCustomization, clearCustomization }),
    [customization, updateCustomization, clearCustomization]
  );

  return <CustomizationContext value={value}>{children}</CustomizationContext>;
};
