import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useUiStore } from '@/stores/uiStore';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
      <Sidebar />
      <Navbar />

      <main 
        className="pt-24 pb-12 pr-6 min-h-screen transition-all duration-200"
        style={{ paddingLeft: sidebarCollapsed ? '88px' : '264px' }}
      >
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
