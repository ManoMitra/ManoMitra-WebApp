
import React from 'react';
import { VideoCameraIcon, MicrophoneIcon, SpeakerWaveIcon, MapPinIcon } from './Icons';

interface StatusCardProps {
    icon: React.ReactNode;
    label: string;
    status: 'Running' | 'Offline';
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, status }) => {
    const isRunning = status === 'Running';
    const statusColor = isRunning ? 'text-green-600' : 'text-red-600';
    const bgColor = isRunning ? 'bg-green-100' : 'bg-red-100';
    const dotColor = isRunning ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`p-4 rounded-lg flex items-center gap-4 ${bgColor}`}>
            <div className="text-gray-700">{icon}</div>
            <div className="flex-grow">
                <p className="font-bold text-gray-800">{label}</p>
                <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                    <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
                </div>
            </div>
        </div>
    );
};


const DeviceStatusView: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Device Status Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatusCard icon={<VideoCameraIcon className="w-8 h-8"/>} label="Webcam" status="Running" />
                    <StatusCard icon={<MicrophoneIcon className="w-8 h-8"/>} label="Microphone" status="Running" />
                    <StatusCard icon={<SpeakerWaveIcon className="w-8 h-8"/>} label="Speaker" status="Running" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <VideoCameraIcon className="w-6 h-6"/>
                        Live Camera Feed
                    </h3>
                    <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center text-white/70 font-semibold shadow-inner text-center p-4">
                        Camera Not Found
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6"/>
                        Live Location
                    </h3>
                    <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold shadow-inner text-center p-4">
                        Location not found
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceStatusView;
