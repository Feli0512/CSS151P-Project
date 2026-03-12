import { useState, useEffect } from 'react';
import { Department, Equipment } from '../types';
// equipmentData is only used for local development/fallback; real data comes from the PHP API
// import { equipmentData } from '../data/mockData';
import { EquipmentCard } from '../components/EquipmentCard';
import { Input } from '../components/ui/Input';
import {
  FlaskConicalIcon,
  AtomIcon,
  MonitorIcon,
  SearchIcon,
  FilterIcon,
  PackageIcon } from
'lucide-react';
import { motion } from 'framer-motion';

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
interface DepartmentPageProps {
  department: Department;
  onBorrow: (equipment: Equipment) => void;
}
export function DepartmentPage({ department, onBorrow }: DepartmentPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // equipment items loaded from the backend
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  // fetch data whenever the department prop changes
  useEffect(() => {
    const controller = new AbortController();

    console.log(`[DepartmentPage] Fetching equipment for ${department}`);
    fetch(`http://localhost/lab-bird/api/equipment.php?department=${department}`, {
      signal: controller.signal
    })
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
          setEquipmentList(normalized);
        } else {
          console.warn(`[Equipment API] No success or invalid data format`);
          setEquipmentList([]);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(`[Equipment API] Fetch error for ${department}:`, err);
          setEquipmentList([]);
        }
      });

    return () => controller.abort();
  }, [department]);

  // if the API returns filtered results, we can use them directly;
  // otherwise fallback to an empty array (or you could keep filtering mock data)
  const departmentEquipment = equipmentList;
  const filteredEquipment = departmentEquipment.filter((e) => {
    const matchesSearch =
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getDepartmentInfo = () => {
    switch (department) {
      case 'Chemistry':
        return {
          icon: <FlaskConicalIcon className="w-8 h-8 text-purple-600" />,
          bgColor: 'bg-purple-100',
          description:
          'Glassware, chemicals, and analytical instruments for chemical experiments.'
        };
      case 'Physics':
        return {
          icon: <AtomIcon className="w-8 h-8 text-blue-600" />,
          bgColor: 'bg-blue-100',
          description:
          'Measurement tools, circuit components, and mechanical apparatus for physics experiments.'
        };
      case 'SOIT':
        return {
          icon: <MonitorIcon className="w-8 h-8 text-emerald-600" />,
          bgColor: 'bg-emerald-100',
          description:
          'Networking equipment and fiber optic tools for IT laboratory exercises.'
        };
    }
  };
  const info = getDepartmentInfo();
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
          duration: 0.4
        }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">

        <div className={`p-4 rounded-xl ${info.bgColor}`}>{info.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {department} Laboratory
          </h1>
          <p className="text-gray-500 max-w-2xl">{info.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            {departmentEquipment.length} equipment items
          </p>
        </div>
      </motion.div>

      {/* Filters */}
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
          duration: 0.4,
          delay: 0.1
        }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">

        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search equipment by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth />

        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FilterIcon className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#C8102E] focus:border-[#C8102E] sm:text-sm rounded-md border">

            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </motion.div>

      {/* Equipment Grid */}
      {filteredEquipment.length > 0 ?
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((equipment, index) =>
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          onBorrow={onBorrow}
          index={index} />

        )}
        </div> :

      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <PackageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No equipment found
          </h3>
          <p className="mt-1 text-gray-500 max-w-sm mx-auto">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      }
    </div>);

}