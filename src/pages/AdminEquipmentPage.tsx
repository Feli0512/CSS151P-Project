import React, { useState } from 'react';
import { Equipment, Department, EquipmentStatus } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/StatusBadge';
import { SearchIcon, PlusIcon, FilterIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface AdminEquipmentPageProps {
  equipment: Equipment[];
  onAdd: (eq: Equipment) => void;
  onUpdate: (eq: Equipment) => void;
  onDelete: (id: string) => void;
}
export function AdminEquipmentPage({
  equipment,
  onAdd,
  onUpdate,
  onDelete
}: AdminEquipmentPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({
    id: '',
    name: '',
    department: 'Chemistry',
    status: 'Available',
    quantityAvailable: 1,
    totalQuantity: 1
  });
  const filteredEquipment = equipment.filter((e) => {
    const matchesSearch =
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
    departmentFilter === 'All' || e.department === departmentFilter;
    return matchesSearch && matchesDept;
  });
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      id: `NEW-${Math.floor(Math.random() * 1000)}`,
      name: '',
      department: 'Chemistry',
      status: 'Available',
      quantityAvailable: 1,
      totalQuantity: 1
    });
    setIsModalOpen(true);
  };
  const handleOpenEdit = (eq: Equipment) => {
    setEditingId(eq.id);
    setFormData(eq);
    setIsModalOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(formData as Equipment);
    } else {
      onAdd(formData as Equipment);
    }
    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Equipment</h1>
        <Button
          className="bg-[#1B2A4A] hover:bg-[#121C32]"
          onClick={handleOpenAdd}>
          
          <PlusIcon className="w-4 h-4 mr-2" /> Add New Equipment
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />
              
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-48">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 text-sm border-gray-300 focus:outline-none focus:ring-[#C8102E] focus:border-[#C8102E] rounded-md border">
                
                <option value="All">All Departments</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="SOIT">SOIT</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((item) =>
                <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantityAvailable} / {item.totalQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-[#C8102E] hover:text-[#A00D25] mr-3">
                      
                        Edit
                      </button>
                      <button
                      onClick={() => onDelete(item.id)}
                      className="text-gray-400 hover:text-red-600">
                      
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredEquipment.length === 0 &&
            <div className="p-8 text-center text-sm text-gray-500 bg-gray-50">
                No equipment found matching your criteria.
              </div>
            }
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? 'Edit Equipment' : 'Add Equipment'}
                </h2>
                <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600">
                
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                label="Equipment ID"
                value={formData.id}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  id: e.target.value
                })
                }
                disabled={!!editingId}
                required />
              
                <Input
                label="Equipment Name"
                value={formData.name}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
                }
                required />
              
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                  value={formData.department}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as Department
                  })
                  }
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]">
                  
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="SOIT">SOIT</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                  value={formData.status}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as EquipmentStatus
                  })
                  }
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]">
                  
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Available Qty"
                  type="number"
                  min="0"
                  value={formData.quantityAvailable?.toString()}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityAvailable: parseInt(e.target.value)
                  })
                  }
                  required />
                
                  <Input
                  label="Total Qty"
                  type="number"
                  min="1"
                  value={formData.totalQuantity?.toString()}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalQuantity: parseInt(e.target.value)
                  })
                  }
                  required />
                
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}>
                  
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Save Changes' : 'Add Equipment'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}