import React, { useState } from 'react';
import { Reservation } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  XIcon,
  InboxIcon,
  TrashIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon } from
'lucide-react';
interface AdminReservationsPageProps {
  reservations: Reservation[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}
export function AdminReservationsPage({
  reservations,
  onApprove,
  onReject,
  onDelete,
  searchQuery
}: AdminReservationsPageProps) {
  const [filter, setFilter] = useState<
    'All' | 'Pending' | 'Approved' | 'Rejected'>(
    'All');
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || res.status === filter;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-6 h-6 mr-3 text-[#C8102E]" />
          Equipment Reservations
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full sm:w-48 py-2 pl-3 pr-10 text-sm border-gray-300 focus:outline-none focus:ring-[#C8102E] focus:border-[#C8102E] rounded-md border">
                
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredReservations.length > 0 ?
              filteredReservations.map((res) =>
              <motion.div
                key={res.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95
                }}
                transition={{
                  duration: 0.2
                }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                
                    <div className="p-6 flex flex-col lg:flex-row gap-6">
                      {/* Left: Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                          <h3 className="text-lg font-bold text-gray-900">
                            {res.equipment}
                          </h3>
                          <StatusBadge status={res.status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 flex items-center mb-1">
                              <UserIcon className="w-4 h-4 mr-1.5" />
                              Requested By
                            </p>
                            <p className="font-medium text-gray-900">
                              {res.name}
                            </p>
                            <p className="text-gray-500 text-xs">{res.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 flex items-center mb-1">
                              <CalendarIcon className="w-4 h-4 mr-1.5" />
                              Needed For
                            </p>
                            <p className="font-medium text-gray-900">
                              {new Date(res.dateNeeded).toLocaleDateString()} at{' '}
                              {res.timeNeeded}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {res.department} Dept
                            </p>
                          </div>
                          <div className="sm:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Purpose
                            </p>
                            <p className="text-gray-900">{res.purpose}</p>
                            {res.additionalNotes &&
                        <>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-1">
                                  Notes
                                </p>
                                <p className="text-gray-700 italic text-sm">
                                  {res.additionalNotes}
                                </p>
                              </>
                        }
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          ID: {res.id} • Submitted:{' '}
                          {new Date(res.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 min-w-[140px]">
                        {res.status === 'Pending' &&
                    <>
                            <Button
                        onClick={() => onApprove(res.id)}
                        className="bg-green-600 hover:bg-green-700 w-full">
                        
                              <CheckIcon className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button
                        variant="outline"
                        onClick={() => onReject(res.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 w-full">
                        
                              <XIcon className="w-4 h-4 mr-2" /> Reject
                            </Button>
                          </>
                    }
                        <Button
                      variant="ghost"
                      onClick={() => onDelete(res.id)}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 w-full">
                      
                          <TrashIcon className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
              ) :

              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                
                  <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No reservations found
                  </h3>
                  <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                    {searchQuery ?
                  `No reservations match your search "${searchQuery}".` :
                  filter !== 'All' ?
                  `There are no ${filter.toLowerCase()} reservations.` :
                  'There are no equipment reservations yet.'}
                  </p>
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>);

}