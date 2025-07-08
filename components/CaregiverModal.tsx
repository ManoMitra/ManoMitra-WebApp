
import React, { useState, useEffect } from 'react';
import { Caregiver } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caregiver: Caregiver) => void;
  onDelete: (id: string) => void;
  initialData: Caregiver | null;
}

const CaregiverModal: React.FC<CaregiverModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [contact, setContact] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setName(initialData.name);
            setRelation(initialData.relation);
            setContact(initialData.contact);
        } else {
            setName('');
            setRelation('');
            setContact('');
        }
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name || !relation || !contact) return;
    const caregiverData: Caregiver = {
        id: initialData?.id ?? `cg-${Date.now()}`,
        name,
        relation,
        contact
    };
    onSave(caregiverData);
  };
  
  const handleDelete = () => {
    if (initialData) {
      onDelete(initialData.id);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Caregiver' : 'Add Caregiver'}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
        
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" placeholder="e.g., Jane Doe" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="relation" className="block text-sm font-medium text-gray-700">Relation</label>
            <input type="text" id="relation" placeholder="e.g., Daughter" value={relation} onChange={e => setRelation(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" id="contact" placeholder="e.g., (123) 456-7890" value={contact} onChange={e => setContact(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center">
          {isEditing ? (
            <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
              <TrashIcon className="w-5 h-5"/>
            </button>
          ) : <div></div>}
          <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {isEditing ? 'Save Changes' : 'Add Caregiver'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverModal;
