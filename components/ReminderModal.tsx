import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Reminder, ReminderType, Location } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, 'id'> & { id?: string }, recurrence?: { days: number }) => void;
  onDelete: (id: string) => void;
  date: Date;
  initialData: { reminder?: Reminder, time?: string } | null;
  locations: Location[];
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSave, onDelete, date, initialData, locations }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');
  const [isEditing, setIsEditing] = useState(false);
  const [reminderId, setReminderId] = useState('');
  const [reminderType, setReminderType] = useState<ReminderType>('standard');
  
  // Standard reminder fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState('7');

  // Timed Location fields
  const [locationId, setLocationId] = useState<string>('');
  const [maxTime, setMaxTime] = useState('60'); // in minutes

  const resetForm = (timeStr?: string) => {
    setTitle('');
    setDescription('');
    setTime(timeStr || '09:00');
    setReminderId('');
    setIsEditing(false);
    setIsRecurring(false);
    setRecurrenceDays('7');
    setReminderType('standard');
    setLocationId('');
    setMaxTime('60');
  }

  useEffect(() => {
    if (initialData) {
        if (initialData.reminder) { // Editing existing reminder
            const { reminder } = initialData;
            setTitle(reminder.title);
            setDescription(reminder.description);
            setTime(reminder.time);
            setReminderId(reminder.id);
            setReminderType(reminder.reminderType || 'standard');
            setIsEditing(true);

            if (reminder.reminderType === 'timed-location') {
                setLocationId(reminder.locationId || '');
                setMaxTime(reminder.maxTime?.toString() || '60');
            } else {
                setLocationId('');
                setMaxTime('60');
            }
            setIsRecurring(false);
        } else { // Creating new reminder
            resetForm(initialData.time);
        }
    }
  }, [initialData]);

  const handleLocationChange = (newLocationId: string) => {
    setLocationId(newLocationId);
    if(newLocationId) {
        const selectedLocation = locations.find(l => l.id === newLocationId);
        if (selectedLocation) {
            setTitle(`Visit to ${selectedLocation.name}`);
        }
    } else {
        setTitle('');
    }
  }

  const isSaveDisabled = useMemo(() => {
    // A title is always required.
    if (!title) {
      return true;
    }

    // For timed location reminders, a location and valid time are required.
    if (reminderType === 'timed-location') {
      if (!locationId || !maxTime || parseInt(maxTime, 10) <= 0) {
        return true;
      }
    }

    return false;
  }, [title, reminderType, locationId, maxTime]);

  const handleSave = () => {
    if (isSaveDisabled) return;
    
    let reminderData: Omit<Reminder, 'id'> & { id?: string };

    if (reminderType === 'timed-location') {
        reminderData = {
            id: isEditing ? reminderId : '',
            date: date.toISOString().split('T')[0],
            time,
            title,
            description,
            reminderType: 'timed-location',
            locationId: locationId,
            maxTime: parseInt(maxTime, 10)
        };
        onSave(reminderData);
    } else { // standard
        reminderData = {
            id: isEditing ? reminderId : '',
            date: date.toISOString().split('T')[0],
            time,
            title,
            description,
            reminderType: 'standard',
        };
        const recurrence = !isEditing && isRecurring ? { days: parseInt(recurrenceDays, 10) || 1 } : undefined;
        onSave(reminderData, recurrence);
    }
  };
  
  const handleDelete = () => {
    if (isEditing) {
      onDelete(reminderId);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Reminder' : 'Add Reminder'}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <p className="text-gray-500 mt-1">{date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="px-6 pb-6 space-y-4">
            {!isEditing && (
                <div className="border-b border-gray-200 pb-4">
                    <label className="block text-sm font-medium text-gray-700">Reminder Type</label>
                    <div className="mt-2 flex gap-6">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" value="standard" checked={reminderType === 'standard'} onChange={() => setReminderType('standard')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-800">Standard</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" value="timed-location" checked={reminderType === 'timed-location'} onChange={() => setReminderType('timed-location')} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                            <span className="ml-2 text-sm text-gray-800">Timed Location</span>
                        </label>
                    </div>
                </div>
            )}

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>

          {reminderType === 'standard' ? (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" id="title" placeholder="e.g., Take morning pills" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea id="description" rows={3} placeholder="Add more details here..." value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              {!isEditing && (
                <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center mt-4">
                        <input id="recurring" type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                        <label htmlFor="recurring" className="ml-3 block text-sm font-medium text-gray-700">Recurring reminder</label>
                    </div>
                    {isRecurring && (
                        <div className="mt-3 pl-7 animate-fade-in">
                            <label htmlFor="recurrenceDays" className="text-sm text-gray-600">Repeat for the next</label>
                            <input type="number" id="recurrenceDays" value={recurrenceDays} onChange={(e) => setRecurrenceDays(e.target.value)} className="mx-2 w-20 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500" min="1"/>
                            <span className="text-sm text-gray-600">days.</span>
                        </div>
                    )}
                </div>
              )}
            </>
          ) : (
             <>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <select id="location" value={locationId} onChange={e => handleLocationChange(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                        <option value="">Select a location</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700">Maximum Time (in minutes)</label>
                    <input type="number" id="maxTime" value={maxTime} onChange={e => setMaxTime(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" min="1" />
                    <p className="mt-1 text-xs text-gray-500">This is the maximum time after which you will be asked if assistance is needed.</p>
                </div>
                 <div>
                    <label htmlFor="title-loc" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="title-loc" placeholder="Auto-filled from location" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                </div>
                <div>
                    <label htmlFor="description-loc" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea id="description-loc" rows={2} placeholder="Add any notes for this visit..." value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"></textarea>
                </div>
             </>
          )}

        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center">
          {isEditing && (
            <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
              <TrashIcon className="w-5 h-5"/>
            </button>
          )}
          <div className="flex-grow"></div>
          <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaveDisabled}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isEditing ? 'Save Changes' : 'Add Reminder'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;