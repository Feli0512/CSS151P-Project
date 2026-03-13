import React from 'react';
import { Card, CardContent } from './ui/Card';
import { motion } from 'framer-motion';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  delay?: number;
}
export function StatsCard({
  title,
  value,
  icon,
  colorClass,
  delay = 0
}: StatsCardProps) {
  return (
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
        delay
      }}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2
        }
      }}>
      
      <Card className="overflow-hidden relative h-full">
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorClass}`}>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div
              className={`p-3 rounded-full bg-gray-50 ${colorClass.replace('bg-', 'text-')}`}>
              
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>);

}