// src/pages/Admin/DashboardComponents/ErrorAlert.jsx

import React from 'react';
import { FiActivity } from 'react-icons/fi';

const ErrorAlert = ({ message }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
    <FiActivity className="text-yellow-600 mr-3" />
    <span className="text-yellow-800">{message}</span>
  </div>
);

export default ErrorAlert;