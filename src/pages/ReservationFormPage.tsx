import React, { useState } from 'react';
import { Reservation, User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon, FileTextIcon } from 'lucide-react';
interface ReservationFormPageProps {
  user: User;
  onSubmit: (
  reservation: Omit<Reservation, 'id' | 'status' | 'submittedAt'>)
  => void;
}
export function ReservationFormPage({
  user,
  onSubmit
}: ReservationFormPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    department: '',
    equipment: '',
    dateNeeded: '',
    timeNeeded: '',
    purpose: '',
    additionalNotes: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: '',
        equipment: '',
        dateNeeded: '',
        timeNeeded: '',
        purpose: '',
        additionalNotes: ''
      });
    }, 3000);
  };
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Make a Reservation</h1>
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
            Reservation submitted successfully! We will review your request.
          </motion.div>
        }
      </AnimatePresence>

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
        }}>
        
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-2 w-full bg-[#C8102E]"></div>
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-6">
            <div className="flex items-center space-x-3 mb-2">
              <FileTextIcon className="w-6 h-6 text-[#C8102E]" />
              <CardTitle className="text-2xl">
                Laboratory Equipment Reservation
              </CardTitle>
            </div>
            <p className="text-gray-600">
              Please fill out this form to reserve equipment in advance.
              Reservations must be made at least 24 hours prior to the needed
              date.
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Personal Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  1. Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                    }
                    required />
                  
                  <Input
                    label="Mapúa Email"
                    type="email"
                    placeholder="you@mymail.mapua.edu.ph"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                    }
                    required />
                  
                </div>
              </div>

              {/* Section 2: Equipment Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  2. Equipment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value
                      })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      required>
                      
                      <option value="">Select Department</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="SOIT">SOIT</option>
                    </select>
                  </div>
                  <Input
                    label="Specific Equipment Needed"
                    placeholder="e.g. Oscilloscope, Beaker (250ml)"
                    value={formData.equipment}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      equipment: e.target.value
                    })
                    }
                    required />
                  
                </div>
              </div>

              {/* Section 3: Schedule & Purpose */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  3. Schedule & Purpose
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Date Needed"
                    type="date"
                    value={formData.dateNeeded}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      dateNeeded: e.target.value
                    })
                    }
                    required />
                  
                  <Input
                    label="Time Needed"
                    type="time"
                    value={formData.timeNeeded}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeNeeded: e.target.value
                    })
                    }
                    required />
                  
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Purpose of Reservation{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2 mt-2">
                    {[
                    'Class Experiment',
                    'Thesis / Research',
                    'Make-up Lab',
                    'Other'].
                    map((option) =>
                    <div key={option} className="flex items-center">
                        <input
                        type="radio"
                        id={option}
                        name="purpose"
                        value={option}
                        checked={formData.purpose === option}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          purpose: e.target.value
                        })
                        }
                        className="h-4 w-4 text-[#C8102E] focus:ring-[#C8102E] border-gray-300"
                        required />
                      
                        <label
                        htmlFor={option}
                        className="ml-3 block text-sm font-medium text-gray-700">
                        
                          {option}
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                    placeholder="Any special requirements or details..."
                    value={formData.additionalNotes}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalNotes: e.target.value
                    })
                    } />
                  
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <Button type="submit" className="px-8">
                  Submit Reservation <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>);

}