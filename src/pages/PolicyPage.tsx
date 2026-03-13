
import { motion } from 'framer-motion';
import {
  ShieldAlertIcon,
  AlertTriangleIcon,
  FlaskConicalIcon,
  AtomIcon,
  MonitorIcon,
  MessageSquareIcon,
  BookOpenIcon,
  InfoIcon } from
'lucide-react';
import { Equipment } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
interface PolicyPageProps {
  equipment: Equipment[];
}
const PRICING_MAP: Record<string, number> = {
  // Chemistry
  Beaker: 150,
  Cylinder: 200,
  'Filter Paper': 50,
  Condenser: 1500,
  Burette: 800,
  'Conical Flask': 180,
  Pipette: 120,
  'Water Bath': 3500,
  'Volumetric Flask': 250,
  Funnel: 100,
  'Separating Funnel': 600,
  'Iron Stand': 350,
  'Tripod Stand': 300,
  Spatula: 80,
  'Stirring Rod': 60,
  'Whatman Paper': 75,
  'Litmus Paper': 50,
  Conductometer: 2500,
  'Weighing Machine': 4000,
  'Physical Balance': 3000,
  'Mixture Bottle': 120,
  Lid: 40,
  'Iodometric Flask': 300,
  Burner: 250,
  Split: 80,
  'China Dish': 150,
  Crucible: 200,
  'Test Tube': 50,
  // Physics
  Resistors: 30,
  Multimeter: 1200,
  Voltmeter: 800,
  Ammeter: 800,
  'Battery Eliminator': 1500,
  'Meter Bridge': 2000,
  Magnet: 150,
  Prism: 500,
  'Optical Lens': 600,
  'Glass Slab': 400,
  'Optical Bench': 3500,
  Pendulum: 350,
  'Spring Balance': 250,
  'Meter Scale': 100,
  // SOIT
  'Fiber Optic Theory Kit': 5000,
  'Fiber Optic Cabling Kit': 4500,
  'Copper Network Cabling Kit': 3500
};
const containerVariants = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};
export function PolicyPage({ equipment }: PolicyPageProps) {
  // Group equipment by department
  const chemistryEq = equipment.filter((e) => e.department === 'Chemistry');
  const physicsEq = equipment.filter((e) => e.department === 'Physics');
  const soitEq = equipment.filter((e) => e.department === 'SOIT');
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'TBA';
    return `₱${price.toLocaleString()}`;
  };
  const renderEquipmentTable = (items: Equipment[]) =>
  <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Equipment Name</th>
            <th className="px-4 py-3 font-semibold text-right">
              Replacement Cost
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item, index) =>
        <tr
          key={item.id}
          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
          
              <td className="px-4 py-3 font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-4 py-3 text-right text-gray-700 font-medium">
                {formatPrice(PRICING_MAP[item.name])}
              </td>
            </tr>
        )}
          {items.length === 0 &&
        <tr>
              <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                No equipment listed for this department.
              </td>
            </tr>
        }
        </tbody>
      </table>
    </div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6">
        
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Equipment Liability Policy
          </h1>
          <p className="mt-2 text-gray-600">
            Please review the guidelines and replacement costs for laboratory
            equipment.
          </p>
        </motion.div>

        {/* Policy Alert Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-lg shadow-sm">
          
          <div className="flex items-start">
            <AlertTriangleIcon className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                Important Notice Regarding Liabilities
              </h3>
              <div className="mt-2 text-sm text-amber-700 space-y-2">
                <p>
                  If an equipment is{' '}
                  <strong>lost, damaged, or not returned</strong>, the
                  replacement cost will be charged directly to your{' '}
                  <strong>MyMapúa Statement of Account</strong>.
                </p>
                <p className="flex items-center text-amber-800 font-medium bg-amber-100/50 p-2 rounded mt-2">
                  <InfoIcon className="w-4 h-4 mr-2 shrink-0" />
                  Note: MyMapúa is the official university portal, separate from
                  the Lab Bird system.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Policy Points */}
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-[#1B2A4A] shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <ShieldAlertIcon className="w-5 h-5 mr-2 text-[#1B2A4A]" />
                Policy Guidelines & Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-[#C8102E] font-semibold">
                    <AlertTriangleIcon className="w-4 h-4 mr-2" />
                    Lost or Damaged
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Full replacement cost will be charged for lost items.
                    Damaged items will incur repair or full replacement costs
                    depending on the severity.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-[#D4A843] font-semibold">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    Unreturned Items
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Items not returned after the designated grace period will be
                    considered lost, and the full replacement cost will be
                    applied.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-[#1B2A4A] font-semibold">
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    Resolution Process
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The professor or instructor of the class will discuss the
                    matter with the student face-to-face before the charge
                    appears on the MyMapúa account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Tables */}
        <motion.div variants={itemVariants} className="pt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Equipment Pricing Directory
          </h2>
          <div className="space-y-6">
            {/* Chemistry */}
            <Card className="overflow-hidden shadow-sm border-gray-200">
              <div className="h-1 w-full bg-[#C8102E]"></div>
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center text-lg text-gray-800">
                  <FlaskConicalIcon className="w-5 h-5 mr-2 text-[#C8102E]" />
                  Chemistry Laboratory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                {renderEquipmentTable(chemistryEq)}
              </CardContent>
            </Card>

            {/* Physics */}
            <Card className="overflow-hidden shadow-sm border-gray-200">
              <div className="h-1 w-full bg-[#1B2A4A]"></div>
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center text-lg text-gray-800">
                  <AtomIcon className="w-5 h-5 mr-2 text-[#1B2A4A]" />
                  Physics Laboratory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                {renderEquipmentTable(physicsEq)}
              </CardContent>
            </Card>

            {/* SOIT */}
            <Card className="overflow-hidden shadow-sm border-gray-200">
              <div className="h-1 w-full bg-[#D4A843]"></div>
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center text-lg text-gray-800">
                  <MonitorIcon className="w-5 h-5 mr-2 text-[#D4A843]" />
                  SOIT Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                {renderEquipmentTable(soitEq)}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="pt-6 pb-12 text-center">
          <p className="text-xs text-gray-500 italic">
            * Prices are subject to change. For the most current pricing and
            policies, please consult your laboratory instructor.
          </p>
        </motion.div>
      </motion.div>
    </div>);

}