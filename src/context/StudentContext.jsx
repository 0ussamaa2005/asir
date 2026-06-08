import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('asir_visa_profile');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: false, // Tracks if they created an account
      user: { fullName: '', email: '', phone: '' },
      selectedDestination: '', // 'Italy', 'Poland', or 'Other Europe'
      degreeLevel: '', // 'Bachelor' or 'Master'
      languageScores: { reading: '', listening: '' },
      hasPaid: false // Gate for premium content/CCP upload
    };
  });

  useEffect(() => {
    localStorage.setItem('asir_visa_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  const updateProfile = (fields) => {
    setStudentProfile(prev => ({ ...prev, ...fields }));
  };

  const logout = () => {
    localStorage.removeItem('asir_visa_profile');
    setStudentProfile({
      isLoggedIn: false,
      user: { fullName: '', email: '', phone: '' },
      selectedDestination: '',
      degreeLevel: '',
      languageScores: { reading: '', listening: '' },
      hasPaid: false
    });
  };

  return (
    <StudentContext.Provider value={{ studentProfile, updateProfile, logout }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);