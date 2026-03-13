import React, { useState } from 'react';
import { AdminUser, User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  UsersIcon,
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  ClockIcon } from
'lucide-react';
import { motion } from 'framer-motion';
interface AdminUsersPageProps {
  adminUsers: AdminUser[];
  currentUser: User;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRevoke: (id: string) => void;
}
export function AdminUsersPage({
  adminUsers,
  currentUser,
  onApprove,
  onReject,
  onRevoke
}: AdminUsersPageProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const pendingUsers = adminUsers.filter((u) => u.status === 'pending');
  const activeUsers = adminUsers.filter((u) => u.status === 'approved');
  const filteredPending = pendingUsers.filter(
    (u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredActive = activeUsers.filter(
    (u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Admin Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Approve new admin requests and manage existing administrator access.
          </p>
        </div>
      </div>

      <Card>
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              
              Pending Requests
              {pendingUsers.length > 0 &&
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {pendingUsers.length}
                </span>
              }
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              
              Active Admins
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeUsers.length}
              </span>
            </button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-6 relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            
          </div>

          {activeTab === 'pending' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}>
            
              {filteredPending.length > 0 ?
            <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="pb-3 font-medium">User Details</th>
                        <th className="pb-3 font-medium">Employee ID</th>
                        <th className="pb-3 font-medium">Requested On</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPending.map((user) =>
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors">
                    
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3">
                                {user.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {user.employeeId}
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            <div className="flex items-center text-orange-600">
                              <ClockIcon className="w-4 h-4 mr-1.5" />
                              {formatDate(user.requestedAt)}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          
                                <XCircleIcon className="w-4 h-4 mr-1.5" />
                                Reject
                              </Button>
                              <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onApprove(user.id)}
                          className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-500">
                          
                                <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                                Approve
                              </Button>
                            </div>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div> :

            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No pending requests
                  </h3>
                  <p className="text-gray-500 mt-1">
                    All admin signup requests have been processed.
                  </p>
                </div>
            }
            </motion.div>
          }

          {activeTab === 'active' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}>
            
              {filteredActive.length > 0 ?
            <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="pb-3 font-medium">User Details</th>
                        <th className="pb-3 font-medium">Employee ID</th>
                        <th className="pb-3 font-medium">Approved By</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredActive.map((user) =>
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors">
                    
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                {user.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                  {user.email === currentUser.email &&
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                            }
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {user.employeeId}
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {user.approvedBy ?
                      <div>
                                <p>{user.approvedBy}</p>
                                {user.approvedAt &&
                        <p className="text-xs text-gray-400">
                                    {formatDate(user.approvedAt)}
                                  </p>
                        }
                              </div> :

                      <span className="text-gray-400 italic">
                                System Default
                              </span>
                      }
                          </td>
                          <td className="py-4 text-right">
                            {user.email !== currentUser.email &&
                      user.email !== 'admin@gmail.com' &&
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                          window.confirm(
                            `Are you sure you want to revoke admin access for ${user.name}?`
                          ))
                          {
                            onRevoke(user.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        
                                  <ShieldAlertIcon className="w-4 h-4 mr-1.5" />
                                  Revoke Access
                                </Button>
                      }
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div> :

            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No active admins found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search query.
                  </p>
                </div>
            }
            </motion.div>
          }
        </CardContent>
      </Card>
    </div>);

}