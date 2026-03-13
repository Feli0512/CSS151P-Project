import React from 'react';
import { Transaction } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PrinterIcon, BirdIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from './ui/Button';
interface BorrowReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}
export function BorrowReceipt({ transaction, onClose }: BorrowReceiptProps) {
  const handlePrint = () => {
    window.print();
  };
  const isReturned = transaction.status === 'Completed';
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm print:bg-white print:p-0"
        onClick={onClose}>
        
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          transition={{
            duration: 0.3,
            type: 'spring',
            bounce: 0.4
          }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative print:shadow-none print:rounded-none max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          
          {/* Top decorative bar */}
          <div className="h-2 w-full bg-[#C8102E] print:hidden"></div>

          {/* Header Actions */}
          <div className="absolute top-4 right-4 flex space-x-2 print:hidden z-10">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-[#C8102E] hover:bg-red-50 rounded-full transition-colors"
              title="Print Receipt">
              
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              title="Close">
              
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {/* Receipt Header */}
            <div className="flex flex-col items-center border-b-2 border-gray-100 pb-8 mb-8">
              <div className="bg-[#C8102E] p-3 rounded-xl mb-4 print:bg-transparent print:border-2 print:border-black">
                <BirdIcon className="w-8 h-8 text-white print:text-black" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">
                Lab Bird
              </h1>
              <p className="text-sm text-gray-500 font-medium tracking-widest uppercase mt-1">
                {isReturned ?
                'Official Return Receipt' :
                'Official Borrow Receipt'}
              </p>

              <div
                className={`mt-6 flex items-center justify-center space-x-2 px-4 py-2 rounded-full border print:border-black print:text-black print:bg-white ${isReturned ? 'bg-green-50 text-green-700 border-green-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                
                <CheckCircleIcon className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wide">
                  {isReturned ? 'Returned' : 'Approved'}
                </span>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-8">
              {/* Receipt Info */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    Receipt No.
                  </p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {transaction.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    Date Issued
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.approvedAt ?
                    new Date(transaction.approvedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    ) :
                    new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Student Details */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 print:bg-white print:border-black">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 print:border-black">
                  Borrower Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student Name</p>
                    <p className="font-semibold text-gray-900">
                      {transaction.userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="font-semibold text-gray-900 font-mono">
                      {transaction.studentId}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">
                      {transaction.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipment Details */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 print:bg-white print:border-black">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 print:border-black">
                  Equipment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">
                      Item Description
                    </p>
                    <p className="font-bold text-lg text-gray-900">
                      {transaction.equipmentName}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      ID: {transaction.equipmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Quantity</p>
                    <p className="font-semibold text-gray-900">
                      {transaction.quantity} Unit(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Purpose</p>
                    <p className="font-semibold text-gray-900">
                      {transaction.purpose || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date Borrowed</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {isReturned && (transaction as any).returnedAt ?
                  <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Date Returned
                      </p>
                      <p className="font-semibold text-green-700 print:text-black">
                        {new Date(
                        (transaction as any).returnedAt
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      </p>
                    </div> :

                  <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Expected Return
                      </p>
                      <p className="font-semibold text-[#C8102E] print:text-black">
                        {transaction.expectedReturn ?
                      new Date(
                        transaction.expectedReturn
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) :
                      'Not specified'}
                      </p>
                    </div>
                  }
                </div>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 grid grid-cols-2 gap-8 print:border-black">
              <div className="text-center">
                <div className="border-b border-gray-400 h-10 mb-2 print:border-black"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Signature
                </p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 h-10 mb-2 print:border-black"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Signature
                </p>
              </div>
            </div>

            <div className="mt-8 text-center print:hidden">
              <p className="text-xs text-gray-400 italic mb-6">
                Present this digital receipt to the laboratory administrator
                when claiming your equipment.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full sm:w-auto px-8 border-gray-300 text-gray-700 hover:bg-gray-50">
                
                <XIcon className="w-4 h-4 mr-2" />
                Close Receipt
              </Button>
            </div>
          </div>

          {/* Bottom decorative bar */}
          <div className="h-2 w-full bg-[#1B2A4A] print:hidden"></div>
        </motion.div>
      </div>
    </AnimatePresence>);

}
