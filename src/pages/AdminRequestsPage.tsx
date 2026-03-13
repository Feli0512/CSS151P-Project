import React from 'react';
import { Transaction } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { CheckIcon, XIcon, InboxIcon } from 'lucide-react';
interface AdminRequestsPageProps {
  transactions: Transaction[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  searchQuery: string;
}
export function AdminRequestsPage({
  transactions,
  onApprove,
  onReject,
  searchQuery
}: AdminRequestsPageProps) {
  const pendingRequests = transactions.filter((t) => {
    const isPending = t.status === 'Pending';
    if (!searchQuery) return isPending;
    const matchesSearch =
    t.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase());
    return isPending && matchesSearch;
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Borrow Requests</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {pendingRequests.length > 0 ?
          <div className="divide-y divide-gray-200">
              {pendingRequests.map((req) =>
            <div
              key={req.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
              
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-bold text-gray-900">
                        {req.equipmentName}{' '}
                        <span className="text-gray-500 font-normal">
                          (x{req.quantity})
                        </span>
                      </span>
                      <StatusBadge status="Pending" />
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-2 mt-2">
                      <span>
                        <strong className="text-gray-700">Student:</strong>{' '}
                        {req.userName} ({req.studentId})
                      </span>
                      <span>
                        <strong className="text-gray-700">Dept:</strong>{' '}
                        {req.department}
                      </span>
                      <span>
                        <strong className="text-gray-700">Needed:</strong>{' '}
                        {new Date(req.date).toLocaleDateString()}
                      </span>
                      {req.expectedReturn &&
                  <span>
                          <strong className="text-gray-700">Return By:</strong>{' '}
                          {new Date(req.expectedReturn).toLocaleDateString()}
                        </span>
                  }
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                  variant="outline"
                  onClick={() => onReject(req.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50">
                  
                      <XIcon className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button
                  onClick={() => onApprove(req.id)}
                  className="bg-green-600 hover:bg-green-700">
                  
                      <CheckIcon className="w-4 h-4 mr-2" /> Approve
                    </Button>
                  </div>
                </div>
            )}
            </div> :

          <div className="py-16 text-center">
              <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No pending requests
              </h3>
              <p className="text-gray-500 mt-1">
                All caught up! There are no borrow requests waiting for
                approval.
              </p>
            </div>
          }
        </CardContent>
      </Card>
    </div>);

}