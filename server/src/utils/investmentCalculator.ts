import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculate investment growth based on time elapsed
 */
export const calculateInvestmentGrowth = (investment: any) => {
  const startDate = new Date(investment.startDate);
  const endDate = new Date(investment.endDate);
  const now = new Date();
  
  // If investment hasn't started or is completed, return as-is
  if (now < startDate || investment.status !== 'active') {
    return {
      currentValue: investment.currentValue,
      profit: investment.profit,
      profitPercentage: investment.profitPercentage,
    };
  }
  
  // Calculate elapsed time as percentage of total duration
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = Math.min(now.getTime() - startDate.getTime(), totalDuration);
  const progressPercentage = elapsed / totalDuration;
  
  // Calculate current value using compound growth
  const expectedROI = investment.roi / 100;
  const randomFactor = 0.98 + Math.random() * 0.04; // ±2% variance for backend
  const currentROI = expectedROI * progressPercentage * randomFactor;
  
  const currentValue = investment.investedAmount * (1 + currentROI);
  const profit = currentValue - investment.investedAmount;
  const profitPercentage = (profit / investment.investedAmount) * 100;
  
  return {
    currentValue: parseFloat(currentValue.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    profitPercentage: parseFloat(profitPercentage.toFixed(2)),
  };
};

/**
 * Update all active investments with calculated growth
 */
export const updateInvestmentValues = async () => {
  try {
    const activeInvestments = await prisma.investment.findMany({
      where: { status: 'active' },
    });

    const updatePromises = activeInvestments.map(async (investment: any) => {
      const growth = calculateInvestmentGrowth(investment);
      
      return prisma.investment.update({
        where: { id: investment.id },
        data: {
          currentValue: growth.currentValue,
          profit: growth.profit,
          profitPercentage: growth.profitPercentage,
        },
      });
    });

    await Promise.all(updatePromises);
    console.log(`Updated ${activeInvestments.length} active investments`);
  } catch (error) {
    console.error('Error updating investment values:', error);
  }
};

/**
 * Check if investment has reached maturity and update status
 */
export const checkInvestmentMaturity = async () => {
  try {
    const now = new Date();
    
    const maturedInvestments = await prisma.investment.updateMany({
      where: {
        endDate: { lte: now },
        status: 'active',
      },
      data: {
        status: 'completed',
      },
    });

    if (maturedInvestments.count > 0) {
      console.log(`Marked ${maturedInvestments.count} investments as completed`);
    }
  } catch (error) {
    console.error('Error checking investment maturity:', error);
  }
};
