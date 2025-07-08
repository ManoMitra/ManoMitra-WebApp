import React from 'react';
import { Caregiver } from '../types';
import { UserPlusIcon, StarIcon, CameraIcon, PencilIcon } from './Icons';

interface CaregiversViewProps {
  caregivers: Caregiver[];
  primaryCaregiverId: string | null;
  onAdd: () => void;
  onEdit: (caregiver: Caregiver) => void;
  onSetPrimary: (id: string) => void;
}

const CaregiversView: React.FC<CaregiversViewProps> = ({ caregivers, primaryCaregiverId, onAdd, onEdit, onSetPrimary }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Care Givers</h2>
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Add Caregiver</span>
        </button>
      </div>
      {caregivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {caregivers.map(caregiver => {
            const isPrimary = caregiver.id === primaryCaregiverId;
            return (
              <div key={caregiver.id} className={`rounded-lg p-4 border flex flex-col justify-between transition-shadow hover:shadow-md ${isPrimary ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold shrink-0">
                                {caregiver.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                            <h3 className="text-lg font-bold text-gray-900">{caregiver.name}</h3>
                            <p className="text-sm text-gray-600">{caregiver.relation}</p>
                            <p className="text-sm text-gray-500 font-mono">{caregiver.contact}</p>
                            </div>
                        </div>
                        {isPrimary && (
                            <div className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full shrink-0">
                                <StarIcon className="w-4 h-4" />
                                <span>Primary</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                   <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                        <CameraIcon className="w-5 h-5"/>
                        Add 10-15 photos for facial recognition
                    </button>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onSetPrimary(caregiver.id)}
                            disabled={isPrimary}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <StarIcon className="w-4 h-4"/>
                            Set as Primary
                        </button>
                        <button 
                            onClick={() => onEdit(caregiver)}
                            className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                            aria-label={`Edit ${caregiver.name}`}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5M3 4v5H8m13 0v5h-5M3 20v-5h5" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No caregivers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new caregiver.</p>
        </div>
      )}
    </div>
  );
};

export default CaregiversView;
