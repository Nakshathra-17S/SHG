export type Language = 'kn' | 'en' | 'hi';

export interface ShgMember {
  id: number;
  name: string;
  village: string;
  role: string;
  skillGrade: 'A+' | 'A' | 'B' | 'C';
  speedUnitsPerDay: number;
  capacityHours: number; // Domestic-adjusted daily available hours
  activeLoad: number;
  bankUpi: string;
  bankAccountNo: string;
  ifsc: string;
  rating: number;
  active: boolean;
  phone: string;
  joinedDate: string;
  experienceYears: number;
}

export interface ProductionOrder {
  id: string;
  buyerName: string;
  buyerCategory: 'Retail Brand' | 'Government/Khadi' | 'CSR / Export' | 'Cooperative';
  product: string;
  productCategory: string;
  totalUnits: number;
  completedUnits: number;
  passedQcUnits: number;
  deadlineDays: number;
  ratePerUnit: number; // Buyer price in ₹
  memberPieceRate: number; // Artisan earning in ₹
  status: 'Pending Allocation' | 'Allocated' | 'In Progress' | 'QC Inspection' | 'Completed';
  assignedMap: Record<number, number>;
  notes: string;
  orderDate: string;
  specs: string[];
}

export interface QcRecord {
  id: number;
  memberName: string;
  memberId: number;
  orderId: string;
  defectType: string;
  score: number;
  status: 'Approved' | 'Rework Required' | 'Critical Reject';
  timestamp: string;
  seamVarianceMm: number;
  zeroDeductionApplied: boolean;
  inspectionType: 'Collar Alignment' | 'Seam Tension' | 'Button Stitch' | 'Fabric Cleanliness' | 'Handle Reinforcement';
  notes: string;
}

export interface PassbookItem {
  id: number;
  name: string;
  role: string;
  bankUpi: string;
  bankAccountNo: string;
  assignedUnits: number;
  completedUnits: number;
  pieceRateAvg: number;
  earnedAmount: number;
  onTimeBonus: number;
  grossPayable: number;
  paidStatus: 'Ready for Transfer' | 'Settled' | 'Processing';
  lastPayoutDate?: string;
  transactionRef?: string;
}

export interface LiveTelemetryEvent {
  id: string;
  timestamp: string;
  artisanName: string;
  cluster: string;
  orderId: string;
  pieceType: string;
  qcStatus: 'Approved' | 'Rework Required';
  earnedAmount: number;
  stationId: string;
}
