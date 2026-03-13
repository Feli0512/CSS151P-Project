import { Equipment, Transaction } from '../types';

// ============================================================
// EQUIPMENT DATA
// ============================================================
// This data serves as the default equipment catalog.
// When you connect your PHP backend, replace this with API calls:
//
// PHP API Integration:
// GET /api/equipment.php
// GET /api/equipment.php?department=Chemistry
// Response: { success: boolean, data: Equipment[] }
// ============================================================

export const equipmentData: Equipment[] = [
// ── Chemistry Laboratory ──────────────────────────────────
{
  id: 'CHEM-001',
  name: 'Beaker',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 20,
  totalQuantity: 20
},
{
  id: 'CHEM-002',
  name: 'Cylinder',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 15,
  totalQuantity: 15
},
{
  id: 'CHEM-003',
  name: 'Filter Paper',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 50,
  totalQuantity: 50
},
{
  id: 'CHEM-004',
  name: 'Condenser',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'CHEM-005',
  name: 'Burette',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-006',
  name: 'Conical Flask',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 18,
  totalQuantity: 18
},
{
  id: 'CHEM-007',
  name: 'Pipette',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 12,
  totalQuantity: 12
},
{
  id: 'CHEM-008',
  name: 'Water Bath',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 5,
  totalQuantity: 5
},
{
  id: 'CHEM-009',
  name: 'Volumetric Flask',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 14,
  totalQuantity: 14
},
{
  id: 'CHEM-010',
  name: 'Funnel',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-011',
  name: 'Separating Funnel',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 6,
  totalQuantity: 6
},
{
  id: 'CHEM-012',
  name: 'Iron Stand',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-013',
  name: 'Tripod Stand',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-014',
  name: 'Spatula',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 15,
  totalQuantity: 15
},
{
  id: 'CHEM-015',
  name: 'Stirring Rod',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 20,
  totalQuantity: 20
},
{
  id: 'CHEM-016',
  name: 'Whatman Paper',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 30,
  totalQuantity: 30
},
{
  id: 'CHEM-017',
  name: 'Litmus Paper',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 40,
  totalQuantity: 40
},
{
  id: 'CHEM-018',
  name: 'Conductometer',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 4,
  totalQuantity: 4
},
{
  id: 'CHEM-019',
  name: 'Weighing Machine',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 5,
  totalQuantity: 5
},
{
  id: 'CHEM-020',
  name: 'Physical Balance',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 4,
  totalQuantity: 4
},
{
  id: 'CHEM-021',
  name: 'Mixture Bottle',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 20,
  totalQuantity: 20
},
{
  id: 'CHEM-022',
  name: 'Lid',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 25,
  totalQuantity: 25
},
{
  id: 'CHEM-023',
  name: 'Iodometric Flask',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'CHEM-024',
  name: 'Burner',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-025',
  name: 'Split',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-026',
  name: 'China Dish',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'CHEM-027',
  name: 'Crucible',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'CHEM-028',
  name: 'Test Tube',
  department: 'Chemistry',
  status: 'Available',
  quantityAvailable: 30,
  totalQuantity: 30
},

// ── Physics Laboratory ────────────────────────────────────
{
  id: 'PHYS-001',
  name: 'Resistors',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 30,
  totalQuantity: 30
},
{
  id: 'PHYS-002',
  name: 'Multimeter',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'PHYS-003',
  name: 'Voltmeter',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'PHYS-004',
  name: 'Ammeter',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'PHYS-005',
  name: 'Battery Eliminator',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 6,
  totalQuantity: 6
},
{
  id: 'PHYS-006',
  name: 'Meter Bridge',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 5,
  totalQuantity: 5
},
{
  id: 'PHYS-007',
  name: 'Magnet',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 12,
  totalQuantity: 12
},
{
  id: 'PHYS-008',
  name: 'Prism',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'PHYS-009',
  name: 'Optical Lens',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
},
{
  id: 'PHYS-010',
  name: 'Glass Slab',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 6,
  totalQuantity: 6
},
{
  id: 'PHYS-011',
  name: 'Optical Bench',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 4,
  totalQuantity: 4
},
{
  id: 'PHYS-012',
  name: 'Pendulum',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 5,
  totalQuantity: 5
},
{
  id: 'PHYS-013',
  name: 'Spring Balance',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'PHYS-014',
  name: 'Meter Scale',
  department: 'Physics',
  status: 'Available',
  quantityAvailable: 15,
  totalQuantity: 15
},

// ── SOIT Equipment ────────────────────────────────────────
{
  id: 'SOIT-001',
  name: 'Fiber Optic Theory Kit',
  department: 'SOIT',
  status: 'Available',
  quantityAvailable: 5,
  totalQuantity: 5
},
{
  id: 'SOIT-002',
  name: 'Fiber Optic Cabling Kit',
  department: 'SOIT',
  status: 'Available',
  quantityAvailable: 8,
  totalQuantity: 8
},
{
  id: 'SOIT-003',
  name: 'Copper Network Cabling Kit',
  department: 'SOIT',
  status: 'Available',
  quantityAvailable: 10,
  totalQuantity: 10
}];


// ============================================================
// TRANSACTION DATA
// ============================================================
// This will be populated from your PHP API:
// GET /api/transactions.php?user_id={id}
// Response: { success: boolean, data: Transaction[] }
export const transactionData: Transaction[] = [];