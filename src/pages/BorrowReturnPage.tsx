import { useState, useEffect } from 'react';
import { Equipment, Department, Transaction, User } from '../types';
// mockData is only used for development/fallback; the real app should hit the API
// import { equipmentData } from '../data/mockData';
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

type RawEquipmentData = {
  id: string;
  name: string;
  department: string;
  status: string;
  quantityAvailable?: number;
  quantity_available?: number;
  totalQuantity?: number;
  quantity_total?: number;
};

type RawTransactionData = {
  id: string;
  type: 'Borrow' | 'Return';
  date: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  equipment_name: string;
  equipment_id: string;
  department: string;
  quantity?: number;
};

interface BorrowReturnPageProps {
  preselectedEquipment?: Equipment | null;
  user?: User | null;
}
export function BorrowReturnPage({
  preselectedEquipment,
  user
}: BorrowReturnPageProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>(
    preselectedEquipment ? 'borrow' : 'borrow'
  );
  const [selectedDept, setSelectedDept] = useState<Department | ''>(
    preselectedEquipment?.department || ''
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Borrow Form State
  const [borrowForm, setBorrowForm] = useState({
    equipmentId: preselectedEquipment?.id || '',
    quantity: '1',
    purpose: '',
    dateNeeded: new Date().toISOString().split('T')[0],
    expectedReturn: ''
  });
  // PHP API Integration:
  // GET /api/equipment.php?department={dept}&status=Available
  // Response: { success: boolean, data: Equipment[] }
  //
  // GET /api/transactions.php?user_id={id}&type=Borrow&status=Approved
  // Response: { success: boolean, data: Transaction[] }

  // fetch the available equipment list when department is chosen
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (!selectedDept) {
      setAvailableEquipment([]);
      return;
    }

    const controller = new AbortController();

    console.log(`[BorrowReturnPage] Fetching available equipment for ${selectedDept}`);
    fetch(
      `http://localhost/lab-bird/api/equipment.php?department=${selectedDept}&status=Available`,
      { signal: controller.signal }
    )
      .then((res) => {
        console.log(`[Equipment API] Response status:`, res.status);
        return res.json();
      })
      .then((data) => {
        console.log(`[Equipment API] Response data:`, data);
        if (data.success && data.data && Array.isArray(data.data)) {
          // Deduplicate by id
          const seen = new Set<string>();
          const normalized: Equipment[] = data.data
            .filter((e: RawEquipmentData) => {
              if (seen.has(e.id)) return false;
              seen.add(e.id);
              return true;
            })
            .map((e: RawEquipmentData) => ({
              ...e,
              quantityAvailable: Number(e.quantityAvailable ?? e.quantity_available ?? 0),
              totalQuantity: Number(e.totalQuantity ?? e.quantity_total ?? 0)
            }));
          console.log(`[Equipment API] Normalized data:`, normalized);
          setAvailableEquipment(normalized);
        } else {
          console.warn(`[Equipment API] No success or invalid data format`);
          setAvailableEquipment([]);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(`[Equipment API] Fetch error for ${selectedDept}:`, err);
          setAvailableEquipment([]);
        }
      });

    return () => controller.abort();
  }, [selectedDept]);

  // Borrowed items will come from your PHP API
  const [borrowedItems, setBorrowedItems] = useState<Transaction[]>([]);

  // load user's approved borrow transactions
  useEffect(() => {
    if (!user || !user.id) {
      setBorrowedItems([]);
      return;
    }
    console.log(`[BorrowReturnPage] Loading approved borrows for user ${user.id}`);
    fetch(
      `http://localhost/lab-bird/api/transactions.php?user_id=${user.id}&type=Borrow&status=Approved`
    )
      .then((res) => {
        console.log(`[Transactions API] Response status:`, res.status);
        return res.json();
      })
      .then((data) => {
        console.log(`[Transactions API] Response data:`, data);
        if (data.success && data.data) {
          // Normalize field names from snake_case to camelCase
          const normalized = data.data.map((item: RawTransactionData) => ({
            id: item.id,
            type: item.type,
            date: item.date,
            status: item.status,
            equipmentName: item.equipment_name,
            equipmentId: item.equipment_id,
            department: item.department,
            quantity: item.quantity
          }));
          console.log(`[Transactions API] Normalized data:`, normalized);
          setBorrowedItems(normalized);
        }
      })
      .catch((err) => {
        console.error(`[Transactions API] Fetch error:`, err);
        setBorrowedItems([]);
      });
  }, [user]);  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!user) {
      setSuccessMessage('You must be logged in to borrow equipment.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    if (!borrowForm.equipmentId) {
      setSuccessMessage('Please select equipment to borrow.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    console.log('[BorrowSubmit] User data:', user);
    console.log('[BorrowSubmit] Form data:', borrowForm);
    
    try {
      const payload = {
        user_id: user.id,
        equipment_id: borrowForm.equipmentId,
        quantity: parseInt(borrowForm.quantity, 10),
        purpose: borrowForm.purpose,
        date_needed: borrowForm.dateNeeded,
        expected_return: borrowForm.expectedReturn
      };
      
      console.log('[BorrowSubmit] Sending payload:', payload);
      
      const response = await fetch('http://localhost/lab-bird/api/borrow.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('[BorrowSubmit] Response status:', response.status);
      
      const data = await response.json();
      console.log('[BorrowSubmit] Response data:', data);
      
      if (data.success) {
        setSuccessMessage('Borrow request submitted successfully! Waiting for approval.');
        setShowSuccess(true);
        // refetch the approved borrow transactions in case the new request appears
        if (user && user.id) {
          fetch(
            `http://localhost/lab-bird/api/transactions.php?user_id=${user.id}&type=Borrow&status=Approved`
          )
            .then((res) => res.json())
            .then((d) => {
              if (d.success) {
                setBorrowedItems(d.data);
              }
            })
            .catch((err) => console.error('Error refreshing borrowed items:', err));
        }
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
      } else {
        setSuccessMessage(data.message || 'Failed to submit borrow request.');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err) {
      console.error('[BorrowSubmit] Error:', err);
      if (err instanceof Error) {
        setSuccessMessage(`Network error: ${err.message}`);
      } else {
        setSuccessMessage('Network error submitting borrow request.');
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReturnSubmit = (transactionId: string) => {
    const item = borrowedItems.find(i => i.id === transactionId);
    if (!item || !user) {
      setSuccessMessage('Error: Could not find item or user.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    console.log('[ReturnSubmit] Submitting return for transaction:', transactionId);
    
    // Get the condition from the select element (we need to find which card this is)
    // For now, we'll just mark it as completed
    try {
      const payload = {
        equipment_id: item.equipmentId,
        user_id: user.id
      };
      
      console.log('[ReturnSubmit] Sending payload:', payload);
      
      fetch('http://localhost/lab-bird/api/return.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          console.log('[ReturnSubmit] Response status:', res.status);
          return res.json();
        })
        .then((data) => {
          console.log('[ReturnSubmit] Response data:', data);
          if (data.success) {
            setSuccessMessage('Equipment returned successfully!');
            setShowSuccess(true);
            
            // Refetch the borrowed items list
            if (user && user.id) {
              fetch(
                `http://localhost/lab-bird/api/transactions.php?user_id=${user.id}&type=Borrow&status=Approved`
              )
                .then((res) => res.json())
                .then((d) => {
                  if (d.success && d.data) {
                    const normalized = d.data.map((item: RawTransactionData) => ({
                      id: item.id,
                      type: item.type,
                      date: item.date,
                      status: item.status,
                      equipmentName: item.equipment_name,
                      equipmentId: item.equipment_id,
                      department: item.department,
                      quantity: item.quantity
                    }));
                    setBorrowedItems(normalized);
                  }
                })
                .catch((err) => console.error('Error refreshing borrowed items:', err));
            }
            
            setTimeout(() => setShowSuccess(false), 3000);
          } else {
            setSuccessMessage(data.message || 'Failed to return equipment.');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }
        })
        .catch((err) => {
          console.error('[ReturnSubmit] Error:', err);
          setSuccessMessage('Network error: ' + err.message);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        });
    } catch (err) {
      console.error('[ReturnSubmit] Error:', err);
      setSuccessMessage('Error submitting return.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Borrow & Return</h1>
      </div>

      {/* Tabs */}
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

      {/* Success Message */}
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

      {/* Content */}
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
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
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
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-100"
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
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      required>

                        <option value="">Select Purpose</option>
                        <option value="Class Experiment">
                          Class Experiment
                        </option>
                        <option value="Graded Laboratory Activity">
                          Graded Laboratory Activity
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
                              {item.equipmentName}
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