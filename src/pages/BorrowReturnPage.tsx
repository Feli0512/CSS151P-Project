import React, { useState } from 'react';
import { Equipment, Department, Transaction, User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  PackageIcon,
  InboxIcon } from
'lucide-react';
interface BorrowReturnPageProps {
  preselectedEquipment?: Equipment | null;
  equipment: Equipment[];
  transactions: Transaction[];
  user: User;
  onBorrowSubmit: (transaction: Omit<Transaction, 'id' | 'status'>) => void;
  onReturnSubmit: (transactionId: string) => void;
}
export function BorrowReturnPage({
  preselectedEquipment,
  equipment,
  transactions,
  user,
  onBorrowSubmit,
  onReturnSubmit
}: BorrowReturnPageProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>(
    preselectedEquipment ? 'borrow' : 'borrow'
  );
  const [selectedDept, setSelectedDept] = useState<Department | ''>(
    preselectedEquipment?.department || ''
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [borrowForm, setBorrowForm] = useState({
    equipmentId: preselectedEquipment?.id || '',
    quantity: '1',
    purpose: '',
    dateNeeded: new Date().toISOString().split('T')[0],
    expectedReturn: ''
  });
  // Filter equipment based on selected department
  const availableEquipment = equipment.filter(
    (e) =>
    (selectedDept === '' || e.department === selectedDept) &&
    e.status === 'Available' &&
    e.quantityAvailable > 0
  );
  // Get user's currently borrowed items
  const borrowedItems = transactions.filter(
    (t) =>
    t.type === 'Borrow' &&
    t.status === 'Approved' &&
    t.studentId === user.studentId
  );
  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEq = equipment.find((eq) => eq.id === borrowForm.equipmentId);
    if (!selectedEq) return;
    onBorrowSubmit({
      equipmentId: selectedEq.id,
      equipmentName: selectedEq.name,
      department: selectedEq.department,
      date: borrowForm.dateNeeded,
      expectedReturn: borrowForm.expectedReturn,
      type: 'Borrow',
      userName: user.name,
      studentId: user.studentId,
      quantity: parseInt(borrowForm.quantity),
      purpose: borrowForm.purpose
    });
    setSuccessMessage(
      'Borrow request submitted successfully! Waiting for approval.'
    );
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setBorrowForm({
        equipmentId: '',
        quantity: '1',
        purpose: '',
        dateNeeded: new Date().toISOString().split('T')[0],
        expectedReturn: ''
      });
      setSelectedDept('');
    }, 3000);
  };
  const handleReturnSubmit = (transactionId: string) => {
    onReturnSubmit(transactionId);
    setSuccessMessage('Equipment returned successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Borrow & Return</h1>
      </div>

      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-full max-w-md">
        <button
          onClick={() => setActiveTab('borrow')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'borrow' ? 'bg-white text-[#C8102E] shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>
          
          Borrow Equipment
        </button>
        <button
          onClick={() => setActiveTab('return')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'return' ? 'bg-white text-[#C8102E] shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>
          
          Return Equipment
        </button>
      </div>

      <AnimatePresence>
        {showSuccess &&
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -20
          }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center text-green-800">
          
            <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500" />
            {successMessage}
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'borrow' ?
        <motion.div
          key="borrow"
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: 20
          }}
          transition={{
            duration: 0.3
          }}>
          
            <Card className="border-0 shadow-md">
              <div className="h-1 w-full bg-[#C8102E]"></div>
              <CardHeader>
                <CardTitle>Equipment Request Form</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Fill out the details below to request laboratory equipment.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBorrowSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select
                      value={selectedDept}
                      onChange={(e) => {
                        setSelectedDept(e.target.value as Department);
                        setBorrowForm({
                          ...borrowForm,
                          equipmentId: ''
                        });
                      }}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                      required>
                      
                        <option value="">Select Department</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="SOIT">SOIT</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Equipment
                      </label>
                      <select
                      value={borrowForm.equipmentId}
                      onChange={(e) =>
                      setBorrowForm({
                        ...borrowForm,
                        equipmentId: e.target.value
                      })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] disabled:bg-gray-100"
                      required
                      disabled={!selectedDept && !preselectedEquipment}>
                      
                        <option value="">
                          {selectedDept ?
                        'Select Equipment' :
                        'Select a department first'}
                        </option>
                        {availableEquipment.map((eq) =>
                      <option key={eq.id} value={eq.id}>
                            {eq.name} (Available: {eq.quantityAvailable})
                          </option>
                      )}
                      </select>
                    </div>

                    <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={borrowForm.quantity}
                    onChange={(e) =>
                    setBorrowForm({
                      ...borrowForm,
                      quantity: e.target.value
                    })
                    }
                    required />
                  

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Purpose of Borrowing
                      </label>
                      <select
                      value={borrowForm.purpose}
                      onChange={(e) =>
                      setBorrowForm({
                        ...borrowForm,
                        purpose: e.target.value
                      })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                      required>
                      
                        <option value="">Select Purpose</option>
                        <option value="Class Experiment">
                          Class Experiment
                        </option>
                        <option value="Research Project">
                          Research Project
                        </option>
                        <option value="Thesis">Thesis</option>
                        <option value="Personal Practice">
                          Personal Practice
                        </option>
                      </select>
                    </div>

                    <Input
                    label="Date Needed"
                    type="date"
                    value={borrowForm.dateNeeded}
                    onChange={(e) =>
                    setBorrowForm({
                      ...borrowForm,
                      dateNeeded: e.target.value
                    })
                    }
                    required />
                  

                    <Input
                    label="Expected Return Date"
                    type="date"
                    value={borrowForm.expectedReturn}
                    onChange={(e) =>
                    setBorrowForm({
                      ...borrowForm,
                      expectedReturn: e.target.value
                    })
                    }
                    required />
                  
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto px-8">
                      Submit Request <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div> :

        <motion.div
          key="return"
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          transition={{
            duration: 0.3
          }}
          className="space-y-6">
          
            {borrowedItems.length > 0 ?
          borrowedItems.map((item) =>
          <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-orange-50 p-6 flex items-center justify-center md:w-48 border-b md:border-b-0 md:border-r border-orange-100">
                      <PackageIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {item.equipmentName}{' '}
                              <span className="text-gray-500 text-sm font-normal">
                                (x{item.quantity})
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.department} Department
                            </p>
                          </div>
                          <StatusBadge status="Borrowed" />
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                          Borrowed on:{' '}
                          <span className="font-medium">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-end justify-between">
                        <div className="w-full sm:w-1/2 space-y-1.5">
                          <label className="text-xs font-medium text-gray-700">
                            Condition upon return
                          </label>
                          <select className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]">
                            <option value="good">Good Condition</option>
                            <option value="damaged">
                              Damaged / Needs Repair
                            </option>
                            <option value="missing_parts">Missing Parts</option>
                          </select>
                        </div>
                        <Button
                    onClick={() => handleReturnSubmit(item.id)}
                    className="w-full sm:w-auto bg-[#1B2A4A] hover:bg-[#121C32]">
                    
                          Return Item
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
          ) :

          <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No borrowed equipment
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Items you've borrowed will appear here for easy return
                    processing.
                  </p>
                  <Button
                variant="outline"
                className="mt-6"
                onClick={() => setActiveTab('borrow')}>
                
                    Borrow Equipment
                  </Button>
                </CardContent>
              </Card>
          }
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}