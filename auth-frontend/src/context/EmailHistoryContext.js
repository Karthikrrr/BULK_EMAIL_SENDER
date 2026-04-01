import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { emailHistoryApi } from '../services/emailHistoryApi';
import { useAuth } from './AuthContext';

const EmailHistoryContext = createContext();

export const useEmailHistory = () => {
  const context = useContext(EmailHistoryContext);
  if (!context) {
    throw new Error('useEmailHistory must be used within an EmailHistoryProvider');
  }
  return context;
};

export const EmailHistoryProvider = ({ children }) => {
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchEmailHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setEmailHistory([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const history = await emailHistoryApi.getEmailHistory();
      setEmailHistory(history);
    } catch (err) {
      console.error('Email history fetch error:', err);
      setError('Failed to fetch email history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchEmailHistory();
  }, [fetchEmailHistory]); 

  const addToHistory = (newHistoryItem) => {
    setEmailHistory(prev => [newHistoryItem, ...prev]);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    emailHistory,
    loading,
    error,
    fetchEmailHistory,
    addToHistory,
    clearError,
  };

  return (
    <EmailHistoryContext.Provider value={value}>
      {children}
    </EmailHistoryContext.Provider>
  );
};