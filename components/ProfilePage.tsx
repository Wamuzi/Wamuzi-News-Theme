
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // This should ideally not be reached due to ProtectedRoute, but it's a good safeguard.
    return <div className="text-center p-8">You must be logged in to view this page.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8 border-b-2 border-brand-blue pb-4">
        <h1 className="text-4xl font-extrabold text-text-primary">
          My Profile
        </h1>
      </div>

      <div className="bg-light-surface p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center space-x-6">
           <div className="flex-shrink-0">
            <div className="relative inline-flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-200 rounded-full">
                <span className="font-medium text-3xl text-gray-600">{currentUser.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-text-primary">{currentUser.username}</h2>
            <p className="text-text-secondary">{currentUser.email}</p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-text-primary mb-4">
                Account Information
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-text-secondary">Username</dt>
                    <dd className="mt-1 text-sm text-text-primary">{currentUser.username}</dd>
                </div>
                 <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-text-secondary">Email address</dt>
                    <dd className="mt-1 text-sm text-text-primary">{currentUser.email}</dd>
                </div>
                 <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-text-secondary">User ID</dt>
                    <dd className="mt-1 text-sm text-text-primary">{currentUser.id}</dd>
                </div>
            </dl>
        </div>
      </div>

       <div className="mt-8 bg-light-surface p-8 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-text-primary mb-4">
              Your Activity
          </h3>
          <p className="text-text-secondary">
              This section would show your comment history and other interactions. (Feature coming soon!)
          </p>
      </div>
    </div>
  );
};

export default ProfilePage;
