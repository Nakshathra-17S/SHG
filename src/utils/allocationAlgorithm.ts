import { ShgMember } from '../types';

export interface AllocationResult {
  assignedMap: Record<number, number>;
  memberMetrics: {
    memberId: number;
    name: string;
    weight: number;
    assignedUnits: number;
    estEarnings: number;
    hoursNeeded: number;
    isOverloaded: boolean;
    burnoutRisk: 'Low' | 'Moderate' | 'High';
  }[];
  giniIndex: number;
  totalGroupCapacityPerDay: number;
  estimatedDaysToFinish: number;
  feasibleWithinDeadline: boolean;
}

export function calculateCWFA(
  members: ShgMember[],
  totalUnits: number,
  deadlineDays: number,
  memberPieceRate: number
): AllocationResult {
  const activeMembers = members.filter((m) => m.active);
  if (activeMembers.length === 0 || totalUnits <= 0) {
    return {
      assignedMap: {},
      memberMetrics: [],
      giniIndex: 0,
      totalGroupCapacityPerDay: 0,
      estimatedDaysToFinish: 0,
      feasibleWithinDeadline: true,
    };
  }

  // Weight formula: (Daily Speed * 0.45) + (Capacity Hours * 2.5) + (Quality Rating * 3.0)
  const weightedList = activeMembers.map((m) => {
    const rawWeight = m.speedUnitsPerDay * 0.45 + m.capacityHours * 2.5 + m.rating * 3.0;
    return {
      member: m,
      weight: Math.max(0.1, rawWeight),
    };
  });

  const totalWeight = weightedList.reduce((acc, curr) => acc + curr.weight, 0);

  let allocatedSum = 0;
  const assignedMap: Record<number, number> = {};

  weightedList.forEach((item, index) => {
    if (index === weightedList.length - 1) {
      // Remainder goes to last member to guarantee 100% exact total
      const remainder = totalUnits - allocatedSum;
      assignedMap[item.member.id] = Math.max(0, remainder);
      allocatedSum += assignedMap[item.member.id];
    } else {
      const share = Math.round((item.weight / totalWeight) * totalUnits);
      assignedMap[item.member.id] = share;
      allocatedSum += share;
    }
  });

  // Calculate detailed feasibility & burnout risk
  const memberMetrics = weightedList.map(({ member, weight }) => {
    const units = assignedMap[member.id] || 0;
    const estEarnings = units * memberPieceRate;
    // Units per hour = speedUnitsPerDay / capacityHours
    const speedPerHour = member.speedUnitsPerDay / Math.max(1, member.capacityHours);
    const hoursNeeded = Math.round((units / Math.max(0.5, speedPerHour)) * 10) / 10;
    const maxSafeHours = member.capacityHours * deadlineDays;
    const isOverloaded = hoursNeeded > maxSafeHours * 1.15;
    
    let burnoutRisk: 'Low' | 'Moderate' | 'High' = 'Low';
    if (hoursNeeded > maxSafeHours * 1.1) {
      burnoutRisk = 'High';
    } else if (hoursNeeded > maxSafeHours * 0.85) {
      burnoutRisk = 'Moderate';
    }

    return {
      memberId: member.id,
      name: member.name,
      weight: Math.round(weight * 10) / 10,
      assignedUnits: units,
      estEarnings,
      hoursNeeded,
      isOverloaded,
      burnoutRisk,
    };
  });

  // Calculate Gini Coefficient of distribution
  const earnings = memberMetrics.map((m) => m.estEarnings).sort((a, b) => a - b);
  const n = earnings.length;
  let gini = 0;
  const totalEarnings = earnings.reduce((a, b) => a + b, 0);
  if (totalEarnings > 0 && n > 1) {
    let sumOfDifferences = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sumOfDifferences += Math.abs(earnings[i] - earnings[j]);
      }
    }
    gini = sumOfDifferences / (2 * n * totalEarnings);
  }

  const totalGroupCapacityPerDay = activeMembers.reduce((acc, m) => acc + m.speedUnitsPerDay, 0);
  const estimatedDaysToFinish = Math.ceil(totalUnits / Math.max(1, totalGroupCapacityPerDay));
  const feasibleWithinDeadline = estimatedDaysToFinish <= deadlineDays;

  return {
    assignedMap,
    memberMetrics,
    giniIndex: Math.round(gini * 100) / 100,
    totalGroupCapacityPerDay,
    estimatedDaysToFinish,
    feasibleWithinDeadline,
  };
}
