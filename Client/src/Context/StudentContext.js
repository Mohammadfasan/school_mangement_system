import React, { createContext, useState, useContext } from 'react';
// We'll use the same initial data
import { studentsData } from '../assets/images/assert';

// 1. Create the Context
const StudentContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useStudents = () => {
  return useContext(StudentContext);
};

// 3. Create the Provider Component
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(studentsData.students);

  // Function to add a student
  const addStudent = (student) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  // Function to delete a student
  const deleteStudent = (studentName) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.name !== studentName)
    );
  };
  
  // Function to update a student
  const updateStudent = (updatedStudent, originalName) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.name === originalName ? updatedStudent : student
      )
    );
  };

  // The value that will be available to all consumer components
  const value = {
    students,
    addStudent,
    deleteStudent,
    updateStudent,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};