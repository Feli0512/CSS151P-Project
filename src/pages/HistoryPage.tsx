import { useState } from 'react';
import { Transaction, User } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { BorrowReceipt } from '../components/BorrowReceipt';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HistoryIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FileTextIcon,
  CalendarIcon,
  PackageIcon } from
'lucide-react';
interface HistoryPageProps {
  transactions: Transaction[];
  user: User;
  searchQuery: string;
}
export function HistoryPage({
  transactions,
  user,
  searchQuery
}: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'borrowed' | 'returned'>(
    'all'
  );
  const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);
  // Filter transactions for this user
  const userTransactions = transactions.filter(
    (t) => t.studentId === user.studentId
  );
  // Apply search and tab filters
  const filteredTransactions = userTransactions.filter((t) => {
    // Search filter
    const matchesSearch =
    t.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    // Tab filter
    if (activeTab === 'borrowed') {
      return t.type === 'Borrow' && t.status === 'Approved';
    }
    if (activeTab === 'returned') {
      // Returned items are Borrow transactions that were completed (returned)
      return t.type === 'Borrow' && t.status === 'Completed';
    }
    return true;
  });
  // Sort by date descending
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  // Determine display info for a transaction
  const getTransactionDisplay = (transaction: Transaction) => {
    // Completed borrow = returned item
    if (transaction.type === 'Borrow' && transaction.status === 'Completed') {
      return {
        icon: <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />,
        label: 'Returned',
        bgClass: 'bg-green-50 border-green-100 text-green-500'
      };
    }
    // Active borrow
    if (transaction.type === 'Borrow') {
      return {
        icon: <ArrowRightIcon className="w-8 h-8 mx-auto mb-2" />,
        label: 'Borrow',
        bgClass: 'bg-orange-50 border-orange-100 text-orange-500'
      };
    }
    // Fallback
    return {
      icon: <ArrowRightIcon className="w-8 h-8 mx-auto mb-2" />,
      label: transaction.type,
      bgClass: 'bg-gray-50 border-gray-100 text-gray-500'
    };
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <HistoryIcon className="w-8 h-8 mr-3 text-[#C8102E]" />
            Transaction History
          </h1>
          <p className="text-gray-500 mt-1">
            View your past borrows, returns, and digital receipts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            
            All History
          </button>
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'borrowed' ? 'bg-white text-[#C8102E] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            
            Currently Borrowed
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'returned' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            
            Returned Items
          </button>
        </div>
      </div>

      {/* Timeline/List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.length > 0 ?
          sortedTransactions.map((transaction, index) => {
            const display = getTransactionDisplay(transaction);
            return (
              <motion.div
                key={transaction.id}
                initial={{
                  opacity: 0,
                  y: 20
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
                  duration: 0.3,
                  delay: index * 0.05
                }}>
                
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Icon/Type Indicator */}
                      <div
                      className={`p-6 flex items-center justify-center md:w-32 border-b md:border-b-0 md:border-r ${display.bgClass}`}>
                      
                        <div className="text-center">
                          {display.icon}
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {display.label}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6 flex-1 flex flex-col sm:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">
                                {transaction.equipmentName}
                                <span className="text-gray-500 text-sm font-normal ml-2">
                                  (x{transaction.quantity})
                                </span>
                              </h3>
                              <StatusBadge status={transaction.status} />
                            </div>
                            <p className="text-sm text-gray-500 flex items-center">
                              <PackageIcon className="w-4 h-4 mr-1.5" />
                              {transaction.department} Department
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 flex items-center mb-1">
                                <CalendarIcon className="w-4 h-4 mr-1.5" />
                                Date Borrowed
                              </p>
                              <p className="font-medium text-gray-900">
                                {new Date(transaction.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }
                              )}
                              </p>
                            </div>
                            {transaction.status === 'Completed' &&
                          transaction.returnedAt ?
                          <div>
                                <p className="text-gray-500 flex items-center mb-1">
                                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                                  Date Returned
                                </p>
                                <p className="font-medium text-green-700">
                                  {new Date(
                                transaction.returnedAt
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                                </p>
                              </div> :
                          transaction.expectedReturn ?
                          <div>
                                <p className="text-gray-500 flex items-center mb-1">
                                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                                  Expected Return
                                </p>
                                <p className="font-medium text-gray-900">
                                  {new Date(
                                transaction.expectedReturn
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                                </p>
                              </div> :
                          null}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 min-w-[140px]">
                          {transaction.type === 'Borrow' && (
                        transaction.status === 'Approved' ||
                        transaction.status === 'Completed') &&
                        <Button
                          variant="outline"
                          className="w-full border-[#C8102E] text-[#C8102E] hover:bg-red-50"
                          onClick={() =>
                          setSelectedTransaction(transaction)
                          }>
                          
                                <FileTextIcon className="w-4 h-4 mr-2" />
                                View Receipt
                              </Button>
                        }
                          <p className="text-xs text-gray-400 text-center mt-3 font-mono">
                            ID: {transaction.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>);

          }) :

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No history found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery ?
              `No transactions match your search "${searchQuery}".` :
              "You haven't made any borrow or return transactions yet."}
              </p>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Receipt Modal */}
      {selectedTransaction &&
      <BorrowReceipt
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)} />

      }
    </div>);

}
