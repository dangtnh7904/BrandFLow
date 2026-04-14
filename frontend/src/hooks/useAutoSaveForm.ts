import { useState, useEffect, useCallback, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';

export function useAutoSaveForm<T>(formKey: string, defaultData: T) {
  const { forms, saveStatus, updateForm, initializeProject } = useFormStore();
  const [localData, setLocalData] = useState<T>(defaultData);
  // Track whether user has explicitly changed data (vs initial load)
  const userHasEdited = useRef(false);
  const isInitialLoad = useRef(true);

  // Initialize Project if needed
  useEffect(() => {
    initializeProject();
  }, [initializeProject]);

  // Load from Store when ready
  useEffect(() => {
    if (forms[formKey]) {
      // DB already has data → use it
      setLocalData(forms[formKey]);
      isInitialLoad.current = false;
    } else {
      // No DB data → stay with defaultData but DON'T auto-save it
      isInitialLoad.current = false;
    }
  }, [forms, formKey]);

  // Debounce Auto Save — ONLY when user has explicitly edited
  useEffect(() => {
    if (!userHasEdited.current) return;

    const handler = setTimeout(() => {
      updateForm(formKey, localData);
    }, 1000);
    return () => clearTimeout(handler);
  }, [localData, formKey, updateForm]);

  // Helper cho việc update shallow state — marks as user-edited
  const updateField = useCallback((field: keyof T, value: any) => {
    userHasEdited.current = true;
    setLocalData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Wrapped setLocalData that marks as user-edited
  const setLocalDataWithEdit = useCallback((dataOrUpdater: T | ((prev: T) => T)) => {
    userHasEdited.current = true;
    setLocalData(dataOrUpdater);
  }, []);

  return { localData, setLocalData: setLocalDataWithEdit, updateField, saveStatus };
}
