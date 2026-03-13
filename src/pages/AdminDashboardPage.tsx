import React from 'react';
import { PageState, User, Equipment, Transaction } from '../types';
import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/StatusBadge';
import {
  UsersIcon,
  PackageIcon,
  ClockIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  InboxIcon,
  CheckCircleIcon,
  HistoryIcon } from
'lucide-react';
import { motion } from 'framer-motion';
interface AdminDashboardPageProps {
  onNavigate: (page: PageState) => void;
  user: User;
  equipment: Equipment[];
  transactions: Transaction[];
  searchQuery: string;
}
export function AdminDashboardPage({
  onNavigate,
  user,
  equipment,
  transactions,
  searchQuery
}: AdminDashboardPageProps) {
  // Calculate Live Stats
  const totalEquipment = equipment.reduce(
    (sum, eq) => sum + eq.totalQuantity,
    0
  );
  const pendingRequests = transactions.filter(
    (t) => t.status === 'Pending'
  ).length;
  const itemsBorrowed = transactions.filter(
    (t) => t.status === 'Approved' && t.type === 'Borrow'
  ).length;
  const damagedOrMaintenance = equipment.filter(
    (eq) => eq.status === 'Damaged' || eq.status === 'Maintenance'
  ).length;
  const totalReturns = transactions.filter(
    (t) => t.type === 'Borrow' && t.status === 'Completed'
  ).length;
  // Apply search to recent requests
  const recentRequests = transactions.
  filter((t) => {
    const isPending = t.status === 'Pending';
    if (!searchQuery) return isPending;
    return (
      isPending && (
      t.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase())));

  }).
  slice(0, 5);
  // Recent returns (Completed borrow transactions)
  const recentReturns = transactions.
  filter((t) => {
    const isCompleted = t.type === 'Borrow' && t.status === 'Completed';
    if (!searchQuery) return isCompleted;
    return (
      isCompleted && (
      t.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase())));

  }).
  sort((a, b) => {
    const aDate = (a as any).returnedAt || a.date;
    const bDate = (b as any).returnedAt || b.date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).
  slice(0, 5);
  // Generate Alerts
  const lowStockAlerts = equipment.filter(
    (eq) => eq.quantityAvailable > 0 && eq.quantityAvailable <= 5
  );
  const overdueAlerts = transactions.filter((t) => {
    if (t.status !== 'Approved' || !t.expectedReturn) return false;
    return new Date(t.expectedReturn) < new Date();
  });
  return (
    <div className="space-y-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#1B2A4A]/5 to-transparent pointer-events-none"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Welcome back, {user.name}. Here is the overview of the laboratory
          system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Equipment"
          value={totalEquipment}
          icon={<PackageIcon className="w-6 h-6" />}
          colorClass="bg-blue-500"
          delay={0.1} />
        
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<ClockIcon className="w-6 h-6" />}
          colorClass="bg-orange-500"
          delay={0.2} />
        
        <StatsCard
          title="Items Borrowed"
          value={itemsBorrowed}
          icon={<ArrowRightIcon className="w-6 h-6" />}
          colorClass="bg-green-500"
          delay={0.3} />
        
        <StatsCard
          title="Total Returns"
          value={totalReturns}
          icon={<HistoryIcon className="w-6 h-6" />}
          colorClass="bg-purple-500"
          delay={0.4} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Borrow Requests */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.5
          }}>
          
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Borrow Requests</CardTitle>
              <button
                onClick={() => onNavigate('admin-requests')}
                className="text-sm text-[#C8102E] hover:underline font-medium">
                
                View All
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {recentRequests.length > 0 ?
                <div className="divide-y divide-gray-100">
                    {recentRequests.map((req) =>
                  <div
                    key={req.id}
                    className="py-3 flex justify-between items-center">
                    
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {req.equipmentName}{' '}
                            <span className="text-gray-500 font-normal">
                              (x{req.quantity})
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {req.userName} • {req.department}
                          </p>
                        </div>
                        <StatusBadge status="Pending" />
                      </div>
                  )}
                  </div> :

                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <InboxIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    No pending requests at the moment.
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Returns */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.6
          }}>
          
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Returns</CardTitle>
              <button
                onClick={() => onNavigate('admin-returns')}
                className="text-sm text-[#C8102E] hover:underline font-medium">
                
                View All
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {recentReturns.length > 0 ?
                <div className="divide-y divide-gray-100">
                    {recentReturns.map((ret) =>
                  <div
                    key={ret.id}
                    className="py-3 flex justify-between items-center">
                    
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {ret.equipmentName}{' '}
                            <span className="text-gray-500 font-normal">
                              (x{ret.quantity})
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {ret.userName} • {ret.department}
                          </p>
                          {(ret as any).returnedAt &&
                      <p className="text-xs text-green-600 mt-0.5">
                              Returned{' '}
                              {new Date(
                          (ret as any).returnedAt
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                            </p>
                      }
                        </div>
                        <StatusBadge status="Completed" />
                      </div>
                  )}
                  </div> :

                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    No returns recorded yet.
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5,
          delay: 0.7
        }}>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {lowStockAlerts.length === 0 && overdueAlerts.length === 0 ?
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  All systems normal. No alerts.
                </div> :

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowStockAlerts.slice(0, 3).map((eq) =>
                <div
                  key={`alert-${eq.id}`}
                  className="flex items-start p-3 bg-red-50 text-red-800 rounded-lg border border-red-100">
                  
                      <AlertTriangleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">Low Stock Alert</p>
                        <p className="text-xs mt-1 text-red-600">
                          {eq.name} in {eq.department} Lab is running low (
                          {eq.quantityAvailable} remaining).
                        </p>
                      </div>
                    </div>
                )}
                  {overdueAlerts.slice(0, 3).map((t) =>
                <div
                  key={`overdue-${t.id}`}
                  className="flex items-start p-3 bg-orange-50 text-orange-800 rounded-lg border border-orange-100">
                  
                      <ClockIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">Overdue Return</p>
                        <p className="text-xs mt-1 text-orange-600">
                          {t.equipmentName} ({t.id}) borrowed by {t.userName} is
                          overdue.
                        </p>
                      </div>
                    </div>
                )}
                </div>
              }
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>);

}
;'>';