
import React from 'react';

type ActiveTab = 'reminders' | 'caregivers' | 'locations' | 'device-status';

interface HeaderProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const TabButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
    const activeClasses = 'border-blue-600 text-blue-600';
    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    return (
        <button
            onClick={onClick}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 py-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    M
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mano Mitra</h1>
                    <p className="text-sm text-gray-500">Memory aid for Alzheimer Patients</p>
                </div>
            </div>
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-6" aria-label="Main navigation">
                <TabButton isActive={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')}>
                    Your Calender/ Reminders
                </TabButton>
                <TabButton isActive={activeTab === 'caregivers'} onClick={() => setActiveTab('caregivers')}>
                    Your Care Givers
                </TabButton>
                <TabButton isActive={activeTab === 'locations'} onClick={() => setActiveTab('locations')}>
                    Your Locations
                </TabButton>
                 <TabButton isActive={activeTab === 'device-status'} onClick={() => setActiveTab('device-status')}>
                    Device Status
                </TabButton>
            </nav>
        </div>
      </div>
    </header>
  );
};