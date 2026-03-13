import React, { useState } from 'react';
import { Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/StatusBadge';
import { StatsCard } from '../components/StatsCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HistoryIcon,
  CheckCircleIcon,
  SearchIcon,
  PackageIcon,
  CalendarIcon,
  UserIcon,
  InboxIcon } from
'lucide-react';
interface AdminReturnsPageProps {
  transactions: Transaction[];
  searchQuery: string;
}
export function AdminReturnsPage({
  transactions,
  searchQuery
}: AdminReturnsPageProps) {
  const [localSearch, setLocalSearch] = useState('');
  // Get all completed/returned transactions
  const returnedTransactions = transactions.filter(
    (t) => t.type === 'Borrow' && t.status === 'Completed'
  );
  // Apply search (combine global searchQuery and local search)
  const activeSearch = searchQuery || localSearch;
  const filteredReturns = returnedTransactions.
  filter((t) => {
    if (!activeSearch) return true;
    const query = activeSearch.toLowerCase();
    return (
      t.equipmentName.toLowerCase().includes(query) ||
      t.userName.toLowerCase().includes(query) ||
      t.studentId.toLowerCase().includes(query) ||
      t.department.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query));

  }).
  sort((a, b) => {
    const aDate = (a as any).returnedAt || a.date;
    const bDate = (b as any).returnedAt || b.date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
  const totalReturns = returnedTransactions.length;
  const totalItemsReturned = returnedTransactions.reduce(
    (sum, t) => sum + t.quantity,
    0
  );
  // Unique students who returned
  const uniqueStudents = new Set(returnedTransactions.map((t) => t.studentId)).
  size;
  // Departments breakdown
  const departmentCounts = returnedTransactions.reduce(
    (acc, t) => {
      acc[t.department] = (acc[t.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topDepartment =
  Object.entries(departmentCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
  'N/A';
  return (
    <div className="space-y-8">
      {/* Header */}
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
        }}>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <HistoryIcon className="w-8 h-8 mr-3 text-[#C8102E]" />
              Return History
            </h1>
            <p className="text-gray-500 mt-1">
              Complete record of all equipment returns by students.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Returns"
          value={totalReturns}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          colorClass="bg-green-500"
          delay={0.1} />
        
        <StatsCard
          title="Items Returned"
          value={totalItemsReturned}
          icon={<PackageIcon className="w-6 h-6" />}
          colorClass="bg-blue-500"
          delay={0.2} />
        
        <StatsCard
          title="Students"
          value={uniqueStudents}
          icon={<UserIcon className="w-6 h-6" />}
          colorClass="bg-purple-500"
          delay={0.3} />
        
        <StatsCard
          title="Top Department"
          value={topDepartment}
          icon={<PackageIcon className="w-6 h-6" />}
          colorClass="bg-orange-500"
          delay={0.4} />
        
      </div>

      {/* Search */}
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
          delay: 0.3
        }}>
        
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, ID, equipment, or department..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent" />
              
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Returns Table */}
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
          delay: 0.4
        }}>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              All Returns
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredReturns.length}{' '}
                {filteredReturns.length === 1 ? 'record' : 'records'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReturns.length > 0 ?
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Equipment
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Department
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Borrow Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Return Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredReturns.map((transaction, index) =>
                    <motion.tr
                      key={transaction.id}
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      exit={{
                        opacity: 0
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.03
                      }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {transaction.id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.userName}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {transaction.studentId}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">
                              {transaction.equipmentName}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">
                              {transaction.department}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">
                              {transaction.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">
                              {new Date(transaction.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }
                          )}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {(transaction as any).returnedAt ?
                        <span className="text-green-700 font-medium">
                                {new Date(
                            (transaction as any).returnedAt
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                              </span> :

                        <span className="text-gray-400 italic">—</span>
                        }
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status="Completed" />
                          </td>
                        </motion.tr>
                    )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div> :

            <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <InboxIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No returns found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {activeSearch ?
                `No return records match "${activeSearch}".` :
                'No equipment has been returned yet. Returns will appear here once students return borrowed items.'}
                </p>
              </div>
            }
          </CardContent>
        </Card>
      </motion.div>
    </div>);

}