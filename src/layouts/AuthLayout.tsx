import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl text-white mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">TaskFlow Pro</h1>
          <p className="text-gray-600 mt-2">The ultimate SaaS project management platform.</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/20"
        >
          {children}
        </motion.div>
        
        <p className="text-center mt-8 text-sm text-gray-500">
          &copy; 2026 TaskFlow Pro Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};
