import { useState, useEffect } from 'react';
import { Shield, ShieldOff, Trash2, UserCheck, UserX } from 'lucide-react';
import { User } from '../types';
import { loadUsers, saveUsers } from '../utils/storage';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (userId: string, isActive: boolean) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive } : user
    ));
  };

  const toggleAdminStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleUserStatus(user.id, !user.isActive)}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAdminStatus(user.id)}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.isAdmin ? (
                      <>
                        <Shield className="w-4 h-4 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <ShieldOff className="w-4 h-4 mr-1" />
                        User
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}