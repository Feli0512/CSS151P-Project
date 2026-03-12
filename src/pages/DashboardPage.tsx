import { PageState, User, Transaction } from '../types';
import { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { TransactionTable } from '../components/TransactionTable';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  PackageIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  CalendarIcon,
  InboxIcon } from
'lucide-react';
import { motion } from 'framer-motion';
import { RESERVATION_FORM_URL } from '../data/config';
interface DashboardPageProps {
  onNavigate: (page: PageState) => void;
  user: User;
}
export function DashboardPage({ onNavigate, user }: DashboardPageProps) {
  // State for dashboard data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [returnedThisMonth, setReturnedThisMonth] = useState(0);
  const [availableEquipment, setAvailableEquipment] = useState(0);
  const [upcomingReturns, setUpcomingReturns] = useState<Transaction[]>([]);

  // Fetch dashboard data when user changes
  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    console.log(`[DashboardPage] Fetching dashboard data for user ${user.id}`);
    fetch(`http://localhost/lab-bird/api/dashboard.php?user_id=${user.id}`)
      .then((res) => {
        console.log(`[Dashboard API] Response status:`, res.status);
        return res.json();
      })
      .then((data) => {
        console.log(`[Dashboard API] Response data:`, data);
        if (data.success) {
          setCurrentlyBorrowed(data.stats.currently_borrowed);
          setPendingRequests(data.stats.pending_requests);
          setReturnedThisMonth(data.stats.returned_this_month);
          setAvailableEquipment(data.stats.available_equipment);
          setTransactions(data.recent_transactions);
          setUpcomingReturns(data.upcoming_returns);
        }
      })
      .catch((err) => {
        console.error(`[Dashboard API] Fetch error:`, err);
      });
  }, [user]);
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
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

        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#C8102E]/5 to-transparent pointer-events-none"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name || 'Student'}!
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Here's an overview of your laboratory equipment activities.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Currently Borrowed"
          value={currentlyBorrowed}
          icon={<PackageIcon className="w-6 h-6" />}
          colorClass="bg-orange-500"
          delay={0.1} />

        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<ClockIcon className="w-6 h-6" />}
          colorClass="bg-blue-500"
          delay={0.2} />

        <StatsCard
          title="Returned This Month"
          value={returnedThisMonth}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          colorClass="bg-green-500"
          delay={0.3} />

        <StatsCard
          title="Available Equipment"
          value={availableEquipment}
          icon={<AlertTriangleIcon className="w-6 h-6" />}
          colorClass="bg-[#C8102E]"
          delay={0.4} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Transactions */}
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

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('borrow-return')}
                className="text-[#C8102E] hover:text-[#A00D25] hover:bg-red-50">

                View All <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {transactions.length > 0 ?
            <TransactionTable transactions={transactions} /> :

            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No transactions yet
                </h3>
                <p className="text-sm text-gray-500">
                  Your borrowing and return history will appear here.
                </p>
              </div>
            }
          </motion.div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Quick Actions */}
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

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  fullWidth
                  onClick={() => onNavigate('borrow-return')}
                  className="justify-start bg-[#C8102E] hover:bg-[#A00D25]">

                  <PackageIcon className="w-4 h-4 mr-3" />
                  Borrow Equipment
                </Button>
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => window.open(RESERVATION_FORM_URL, '_blank')}
                  className="justify-start">

                  <CalendarIcon className="w-4 h-4 mr-3" />
                  Reserve Equipment
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => onNavigate('borrow-return')}
                  className="justify-start">

                  <ClockIcon className="w-4 h-4 mr-3" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Returns */}
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Upcoming Returns</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingReturns.length > 0 ?
                <div className="space-y-3">
                  {upcomingReturns.map((item) =>
                  <div key={item.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.equipmentName}
                        </p>
                        {item.expectedReturn && (
                          <p className="text-xs text-gray-500">
                            Due: {new Date(item.expectedReturn).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                )}
                </div> :

                <div className="text-center py-6 text-gray-500 text-sm">
                  No upcoming returns due.
                </div>
                }
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);

}