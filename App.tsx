
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Reminder, Caregiver, Location } from './types';
import CalendarView from './components/CalendarView';
import DayView from './components/DayView';
import ReminderModal from './components/ReminderModal';
import CaregiversView from './components/CaregiversView';
import CaregiverModal from './components/CaregiverModal';
import LocationsView from './components/LocationsView';
import LocationModal from './components/LocationModal';
import { Header } from './components/Header';
import { PlusIcon } from './components/Icons';
import DeviceStatusView from './components/DeviceStatusView';


type ActiveTab = 'reminders' | 'caregivers' | 'locations' | 'device-status';

const generateInitialReminders = (): Reminder[] => {
    const reminders: Reminder[] = [];
    const today = new Date();

    // 1. Recurring Medication Reminder for the next 7 days
    const medDescription = "Take the blue and white pills with a full glass of water. It's important for your health.";
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        reminders.push({
            id: `reminder-meds-${i}`,
            date: date.toISOString().split('T')[0],
            time: '08:00',
            title: 'Take Morning Medication',
            description: medDescription,
            reminderType: 'standard',
        });
        if (i > 0) { // Add evening meds for subsequent days
            reminders.push({
                 id: `reminder-evening-meds-${i}`,
                date: date.toISOString().split('T')[0],
                time: '20:00',
                title: 'Take Evening Medication',
                description: 'Time for your evening pills. The green one before bed.',
                reminderType: 'standard',
            });
        }
    }

    // 2. Doctor's Appointment tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    reminders.push({
        id: 'reminder-doctor',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        title: "Doctor's Appointment",
        description: 'Appointment with Dr. Sharma at AIIMS. Emily will drive you there.',
        reminderType: 'standard',
    });

    // 3. Lunch with family in 2 days
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);
     reminders.push({
        id: 'reminder-lunch',
        date: dayAfter.toISOString().split('T')[0],
        time: '12:30',
        title: 'Lunch with Emily',
        description: 'Emily is coming over for lunch today. Remember she loves your stories.',
        reminderType: 'standard',
    });

    // 4. Evening walk today
     reminders.push({
        id: 'reminder-walk',
        date: today.toISOString().split('T')[0],
        time: '18:00',
        title: 'Evening Walk',
        description: 'A gentle walk in Lodhi Garden if the weather is nice.',
        reminderType: 'standard',
    });

    return reminders;
};

const DUMMY_CAREGIVERS: Caregiver[] = [
    { id: 'cg-1', name: 'Emily Carter', relation: 'Daughter', contact: '123-456-7890' },
    { id: 'cg-2', name: 'John Doe', relation: 'Son', contact: '098-765-4321' },
    { id: 'cg-3', name: 'Maria Garcia', relation: 'Nurse', contact: '555-555-5555' },
];

const DUMMY_LOCATIONS: Location[] = [
    { id: 'loc-1', name: 'Home', address: 'Hauz Khas, New Delhi, Delhi', lat: 28.5493, lng: 77.2052 },
    { id: 'loc-2', name: 'Daughter\'s House', address: 'Vasant Kunj, New Delhi, Delhi', lat: 28.5222, lng: 77.1588 },
    { id: 'loc-3', name: 'Hospital', address: 'AIIMS, Ansari Nagar East, New Delhi', lat: 28.5668, lng: 77.2113 },
    { id: 'loc-4', name: 'Society Park', address: 'Lodhi Garden, New Delhi, Delhi', lat: 28.5931, lng: 77.2215 },
];


const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
        const saved = localStorage.getItem('manoMitraReminders');
        if (saved) {
            const parsed = JSON.parse(saved) as Reminder[];
            // Migrate old reminders to include reminderType
            return parsed.map(r => ({ ...r, reminderType: r.reminderType || 'standard' }));
        }
        return generateInitialReminders();
    } catch (error) {
        console.error("Failed to parse reminders from localStorage", error);
        return generateInitialReminders();
    }
  });
  
  const [caregivers, setCaregivers] = useState<Caregiver[]>(() => {
    try {
        const saved = localStorage.getItem('manoMitraCaregivers');
        return saved ? JSON.parse(saved) : DUMMY_CAREGIVERS;
    } catch (error) {
        console.error("Failed to parse caregivers from localStorage", error);
        return DUMMY_CAREGIVERS;
    }
  });
  
  const [locations, setLocations] = useState<Location[]>(() => {
    try {
        const saved = localStorage.getItem('manoMitraLocations');
        return saved ? JSON.parse(saved) : DUMMY_LOCATIONS;
    } catch (error) {
        console.error("Failed to parse locations from localStorage", error);
        return DUMMY_LOCATIONS;
    }
  });

  const [primaryCaregiverId, setPrimaryCaregiverId] = useState<string | null>(() => {
      const saved = localStorage.getItem('manoMitraPrimaryCaregiver');
      if (saved) return saved;
      const initialCaregivers = JSON.parse(localStorage.getItem('manoMitraCaregivers') || 'null') || DUMMY_CAREGIVERS;
      return initialCaregivers.length > 0 ? initialCaregivers[0].id : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('reminders');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal and Loading States
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderModalData, setReminderModalData] = useState<{ reminder?: Reminder, time?: string } | null>(null);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [caregiverModalData, setCaregiverModalData] = useState<Caregiver | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationModalData, setLocationModalData] = useState<Location | null>(null);


  const isSelectedDateInPast = useMemo(() => {
    const today = new Date();
    // Compare only the date part, ignoring time.
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return selectedStart < todayStart;
  }, [selectedDate]);

  const homeLocation = useMemo(() => {
    return locations.find(l => l.name.toLowerCase() === 'home');
  }, [locations]);


  // --- DATA PERSISTENCE EFFECTS ---
  useEffect(() => {
      localStorage.setItem('manoMitraReminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
      localStorage.setItem('manoMitraCaregivers', JSON.stringify(caregivers));
      if (!primaryCaregiverId && caregivers.length > 0) {
          setPrimaryCaregiverId(caregivers[0].id);
      }
      if (caregivers.length === 0) {
          setPrimaryCaregiverId(null);
      }
  }, [caregivers, primaryCaregiverId]);
  
  useEffect(() => {
      localStorage.setItem('manoMitraLocations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
      if (primaryCaregiverId) {
          localStorage.setItem('manoMitraPrimaryCaregiver', primaryCaregiverId);
      } else {
          localStorage.removeItem('manoMitraPrimaryCaregiver');
      }
  }, [primaryCaregiverId]);


  // --- REMINDER HANDLERS ---
  const handleAddOrUpdateReminder = (reminder: Omit<Reminder, 'id'> & { id?: string }, recurrence?: { days: number }) => {
    // For standard, recurring reminders being created
    if (recurrence && recurrence.days > 0 && !reminder.id && reminder.reminderType === 'standard') {
        const newReminders: Reminder[] = [];
        const startDate = new Date(reminder.date + 'T12:00:00'); 
        for (let i = 0; i < recurrence.days; i++) {
            const currentDayDate = new Date(startDate);
            currentDayDate.setDate(startDate.getDate() + i);
            newReminders.push({
                ...(reminder as Reminder),
                id: `reminder-${Date.now()}-${i}`,
                date: currentDayDate.toISOString().split('T')[0],
            });
        }
        setReminders(prev => [...prev, ...newReminders]);
    } else { 
        const finalReminder = {
            ...reminder,
            id: reminder.id || `reminder-${Date.now()}`,
        } as Reminder;

        setReminders(prev => {
            const existingIndex = prev.findIndex(r => r.id === finalReminder.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = finalReminder;
                return updated;
            } else {
                return [...prev, finalReminder];
            }
        });
    }
    setIsReminderModalOpen(false);
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    setIsReminderModalOpen(false);
  }

  const handleOpenReminderModalForNew = useCallback((time?: string) => {
    setReminderModalData({ time });
    setIsReminderModalOpen(true);
  }, []);

  const handleOpenReminderModalForEdit = useCallback((reminder: Reminder) => {
    setReminderModalData({ reminder });
    setIsReminderModalOpen(true);
  }, []);

  const remindersForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return reminders
      .filter(r => r.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reminders, selectedDate]);
  
  // --- CAREGIVER HANDLERS ---
  const handleAddOrUpdateCaregiver = (caregiver: Caregiver) => {
    setCaregivers(prev => {
        const existingIndex = prev.findIndex(c => c.id === caregiver.id);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = caregiver;
            return updated;
        } else {
            return [...prev, caregiver];
        }
    });
    setIsCaregiverModalOpen(false);
  };

  const handleDeleteCaregiver = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
    if (primaryCaregiverId === id) {
        setPrimaryCaregiverId(null);
    }
    setIsCaregiverModalOpen(false);
  };

  const handleOpenCaregiverModalForNew = () => {
    setCaregiverModalData(null);
    setIsCaregiverModalOpen(true);
  };

  const handleOpenCaregiverModalForEdit = (caregiver: Caregiver) => {
    setCaregiverModalData(caregiver);
    setIsCaregiverModalOpen(true);
  };
  
  // --- LOCATION HANDLERS ---
  const handleAddOrUpdateLocation = (locationData: Omit<Location, 'id'> & { id?: string }) => {
    setLocations(prev => {
        const isEditing = !!locationData.id;

        if (isEditing) {
            const updated = [...prev];
            const existingIndex = prev.findIndex(l => l.id === locationData.id);
            if (existingIndex > -1) {
                updated[existingIndex] = { ...prev[existingIndex], ...locationData } as Location;
                return updated;
            }
             return prev; // Should not happen if isEditing is true
        } else {
            const finalLocation: Location = {
                id: `loc-${Date.now()}`,
                ...locationData
            } as Location; // Cast needed because locationData is missing id, but we add it.
            return [...prev, finalLocation];
        }
    });
    setIsLocationModalOpen(false);
  };
  
  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    setIsLocationModalOpen(false);
  };

  const handleOpenLocationModalForNew = () => {
    setLocationModalData(null);
    setIsLocationModalOpen(true);
  };

  const handleOpenLocationModalForEdit = (location: Location) => {
    setLocationModalData(location);
    setIsLocationModalOpen(true);
  };

  
  const renderActiveTab = () => {
    switch (activeTab) {
        case 'reminders':
            return (
                <>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/2 xl:w-2/5">
                            <CalendarView 
                                selectedDate={selectedDate} 
                                onDateChange={setSelectedDate}
                                reminders={reminders}
                            />
                        </div>
                        <div className="lg:w-1/2 xl:w-3/5">
                            <DayView 
                                date={selectedDate}
                                reminders={remindersForSelectedDate}
                                onAddReminder={handleOpenReminderModalForNew}
                                onEditReminder={handleOpenReminderModalForEdit}
                                locations={locations}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => handleOpenReminderModalForNew()}
                        disabled={isSelectedDateInPast}
                        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        aria-label="Add new reminder"
                    >
                        <PlusIcon className="h-8 w-8" />
                    </button>
                </>
            );
        case 'caregivers':
            return (
                <CaregiversView
                    caregivers={caregivers}
                    primaryCaregiverId={primaryCaregiverId}
                    onAdd={handleOpenCaregiverModalForNew}
                    onEdit={handleOpenCaregiverModalForEdit}
                    onSetPrimary={setPrimaryCaregiverId}
                />
            );
        case 'locations':
            return (
                <LocationsView 
                    locations={locations}
                    onAdd={handleOpenLocationModalForNew}
                    onEdit={handleOpenLocationModalForEdit}
                    onDelete={handleDeleteLocation}
                    homeLocation={homeLocation}
                />
            );
        case 'device-status':
            return <DeviceStatusView />;
        default:
            return null;
    }
  }
  
  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderActiveTab()}
      </main>

      <ReminderModal 
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleAddOrUpdateReminder}
        onDelete={handleDeleteReminder}
        date={selectedDate}
        initialData={reminderModalData}
        locations={locations}
      />
      <CaregiverModal
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
        onSave={handleAddOrUpdateCaregiver}
        onDelete={handleDeleteCaregiver}
        initialData={caregiverModalData}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleAddOrUpdateLocation}
        onDelete={handleDeleteLocation}
        initialData={locationModalData}
        homeLocation={homeLocation}
       />
    </div>
  );
};

export default App;