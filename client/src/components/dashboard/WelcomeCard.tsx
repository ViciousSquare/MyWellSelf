import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, addDays } from "date-fns";
import { User, WellnessScore } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { 
  CalendarDays,
  ArrowUp
} from "lucide-react";

interface WelcomeCardProps {
  userId: number;
}

export default function WelcomeCard({ userId }: WelcomeCardProps) {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: wellnessScore, isLoading: isLoadingScore } = useQuery({
    queryKey: [`/api/users/${userId}/wellness-scores/latest`],
  });

  if (isLoadingUser || isLoadingScore) {
    return (
      <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3 mb-6"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-neutral-200 rounded w-16"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-20 w-20 bg-neutral-200 rounded-full"></div>
              <div className="h-20 w-20 bg-neutral-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstName = user?.firstName || user?.username?.split('.')[0] || 'User';
  const score = wellnessScore?.overallScore || 0;
  const comparisonScore = 5; // Mock for now, would come from previous assessment
  
  // Calculate the date 5 days from now for the next check-in
  const nextCheckInDate = addDays(new Date(), 5);
  const formattedDate = format(nextCheckInDate, 'MMMM d, yyyy');
  const daysUntil = 5; // This would be calculated dynamically in a real app

  const actionPlanCompletion = 2; // Number of completed tasks
  const actionPlanTotal = 3; // Total number of tasks
  const hsaUsedPercentage = 45; // Percentage of HSA used

  return (
    <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-800 font-heading mb-1">
          Welcome back, {firstName}!
        </h2>
        <p className="text-neutral-600 mb-4">
          Your wellness journey is progressing well. Here's your latest update.
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-neutral-500 mb-1">Your wellness score</p>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-primary-600">{score}</span>
              {comparisonScore > 0 && (
                <span className="ml-2 text-secondary-500 text-sm font-medium flex items-center">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {comparisonScore}% from last assessment
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <ProgressCircle
                value={actionPlanCompletion}
                max={actionPlanTotal}
                size={80}
                label={`${Math.round((actionPlanCompletion / actionPlanTotal) * 100)}%`}
              />
              <span className="text-xs text-neutral-500 mt-1">Goals</span>
            </div>
            
            <div className="flex flex-col items-center">
              <ProgressCircle
                value={hsaUsedPercentage}
                max={100}
                size={80}
                color="stroke-secondary-500"
              />
              <span className="text-xs text-neutral-500 mt-1">HSA Used</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-neutral-50 p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="bg-primary-100 p-2 rounded-full text-primary-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-700">Next wellness check-in</p>
            <p className="text-sm text-neutral-500">{formattedDate} · In {daysUntil} days</p>
          </div>
          <Link href="/assessment">
            <Button className="ml-auto">
              Start Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
