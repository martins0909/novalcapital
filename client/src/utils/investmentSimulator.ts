// Investment growth simulator utility
export interface Investment {
  id: string;
  userId?: string;
  planName: string;
  planType: string;
  investedAmount: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  duration: number;
  roi: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Calculate investment growth based on time elapsed
 * Uses compound interest simulation with daily growth
 */
export const calculateInvestmentGrowth = (investment: Investment): Investment => {
  const startDate = new Date(investment.startDate);
  const endDate = new Date(investment.endDate);
  const now = new Date();
  
  // If investment hasn't started or is completed, return as-is
  if (now < startDate || investment.status !== 'active') {
    return investment;
  }
  
  // Calculate elapsed time as percentage of total duration
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = Math.min(now.getTime() - startDate.getTime(), totalDuration);
  const progressPercentage = elapsed / totalDuration;
  
  // Calculate current value using compound growth
  // ROI is distributed over the duration with slight randomness for realism
  const expectedROI = investment.roi / 100;
  const randomFactor = 0.95 + Math.random() * 0.1; // ±5% variance
  const currentROI = expectedROI * progressPercentage * randomFactor;
  
  const currentValue = investment.investedAmount * (1 + currentROI);
  const profit = currentValue - investment.investedAmount;
  const profitPercentage = (profit / investment.investedAmount) * 100;
  
  return {
    ...investment,
    currentValue: parseFloat(currentValue.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    profitPercentage: parseFloat(profitPercentage.toFixed(2)),
  };
};

/**
 * Simulate growth for an array of investments
 */
export const simulatePortfolioGrowth = (investments: Investment[]): Investment[] => {
  return investments.map(inv => calculateInvestmentGrowth(inv));
};

/**
 * Calculate daily growth rate for smooth animation
 */
export const getDailyGrowthRate = (investment: Investment): number => {
  const durationInDays = investment.duration;
  const totalROI = investment.roi / 100;
  return totalROI / durationInDays;
};
