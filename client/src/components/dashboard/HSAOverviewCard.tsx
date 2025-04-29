import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HsaInfo } from "@/lib/types";
import { 
  ChevronRight 
} from "lucide-react";

interface HSAOverviewCardProps {
  userId: number;
}

export default function HSAOverviewCard({ userId }: HSAOverviewCardProps) {
  const { data: hsaInfo, isLoading: isLoadingHsaInfo } = useQuery<HsaInfo>({
    queryKey: [`/api/users/${userId}/hsa-info`],
  });

  if (isLoadingHsaInfo) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
                <div className="h-4 bg-neutral-200 rounded w-20"></div>
              </div>
              <div className="h-2 bg-neutral-200 rounded w-full"></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
                <div className="h-4 bg-neutral-200 rounded w-28"></div>
              </div>
              <div className="h-2 bg-neutral-200 rounded w-full"></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-neutral-200 rounded w-20"></div>
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hsaInfo) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-1">HSA Overview</h2>
        <p className="text-neutral-600 text-sm mb-4">Health Spending Account information not available</p>
      </div>
    );
  }

  const balancePercentage = (hsaInfo.balance / hsaInfo.annualLimit) * 100;
  const annualIndividualLimit = 3850; // 2023 limit
  const annualFamilyLimit = 7750; // 2023 limit

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-1">HSA Overview</h2>
        <p className="text-neutral-600 text-sm mb-4">Your Health Spending Account</p>
        
        <div className="flex flex-col space-y-3 mb-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-neutral-600">Balance</span>
              <span className="text-lg font-semibold text-neutral-800">${hsaInfo.balance.toLocaleString()}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${Math.min(balancePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-neutral-600">Annual Limit</span>
              <span className="text-sm font-medium text-neutral-600">
                ${annualIndividualLimit.toLocaleString()} / ${annualFamilyLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-secondary-500 h-2 rounded-full" 
                style={{ width: `${(hsaInfo.balance / annualFamilyLimit) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-neutral-600">Tax Savings</span>
              <span className="text-sm font-medium text-secondary-600">
                ${hsaInfo.taxSavings?.toLocaleString() || 0} estimated
              </span>
            </div>
          </div>
        </div>
        
        <Link href="/hsa-optimization">
          <div className="flex items-center justify-between bg-accent-50 p-3 rounded-lg cursor-pointer">
            <div>
              <p className="text-sm font-medium text-accent-700">Optimize your HSA</p>
              <p className="text-xs text-accent-600">You have unallocated funds.</p>
            </div>
            <ChevronRight className="text-accent-400 h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
