import React from 'react';
import { Equipment } from '../types';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './StatusBadge';
import { motion } from 'framer-motion';
import { PackageIcon } from 'lucide-react';
interface EquipmentCardProps {
  equipment: Equipment;
  onBorrow: (equipment: Equipment) => void;
  index?: number;
}
export function EquipmentCard({
  equipment,
  onBorrow,
  index = 0
}: EquipmentCardProps) {
  const isAvailable =
  equipment.status === 'Available' && equipment.quantityAvailable > 0;
  const getDepartmentColor = () => {
    switch (equipment.department) {
      case 'Chemistry':
        return 'bg-purple-100 text-purple-600';
      case 'Physics':
        return 'bg-blue-100 text-blue-600';
      case 'SOIT':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05
      }}
      whileHover={{
        y: -4,
        shadow:
        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
      className="h-full">
      
      <Card className="h-full flex flex-col overflow-hidden border-gray-200">
        <div
          className={`h-32 flex items-center justify-center ${getDepartmentColor()}`}>
          
          <PackageIcon className="w-12 h-12 opacity-50" />
        </div>

        <CardContent className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {equipment.name}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {equipment.id}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <StatusBadge status={equipment.status} />
            <span className="text-sm font-medium text-gray-700">
              Qty: {equipment.quantityAvailable}/{equipment.totalQuantity}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button
            fullWidth
            disabled={!isAvailable}
            onClick={() => onBorrow(equipment)}
            className={isAvailable ? 'bg-[#C8102E] hover:bg-[#A00D25]' : ''}>
            
            {isAvailable ? 'Borrow Equipment' : 'Unavailable'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>);

}