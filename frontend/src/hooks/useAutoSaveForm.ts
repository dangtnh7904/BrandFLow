import { useState, useEffect, useCallback } from 'react';
import { useFormStore } from '@/store/useFormStore';

export function useAutoSaveForm<T>(formKey: string, defaultData: T) {
  const { forms, saveStatus, updateForm, initializeProject } = useFormStore();
  const [localData, setLocalData] = useState<T>(defaultData);

  // Initialize Project if needed
  useEffect(() => {
    initializeProject();
  }, [initializeProject]);

  // Load from Store when ready
  useEffect(() => {
    if (forms[formKey]) {
      setLocalData(forms[formKey]);
    }
  }, [forms, formKey]);

  // Debounce Auto Save
  useEffect(() => {
    const handler = setTimeout(() => {
      updateForm(formKey, localData);
    }, 1000);
    return () => clearTimeout(handler);
  }, [localData, formKey, updateForm]);

  // Helper cho việc update shallow state
  const updateField = useCallback((field: keyof T, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  }, []);

  return { localData, setLocalData, updateField, saveStatus };
}
