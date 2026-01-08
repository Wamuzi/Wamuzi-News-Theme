
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { type User } from '../../../types';

const AdminUserManagement: React.FC = () => {
  const { currentUser, getAllUsers, updateUserRole, deleteUser } = useAuth();
  // We use state to force a re-render when the user list changes
  const [users, setUsers] = useState<User[]>(getAllUsers());

  const handleRoleChange = (userId: number, role: 'admin' | 'user') => {
    if (userId === currentUser?.id && role === 'user') {
        alert("You cannot demote yourself.");
        return;
    }
    updateUserRole(userId, role);
    setUsers(getAllUsers()); // Refresh user list
  };

  const handleDeleteUser = (userId: number) => {
    if (userId === currentUser?.id) {
        alert("You cannot delete your own account.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        deleteUser(userId);
        setUsers(getAllUsers()); // Refresh user list
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage user accounts and roles.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Username</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.username}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                      disabled={user.id === currentUser?.id}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-blue sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === currentUser?.id}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Delete<span className="sr-only">, {user.username}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
