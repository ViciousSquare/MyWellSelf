import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isSameWeek } from "date-fns";
import { ActionPlan } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ActionPlanSectionProps {
  userId: number;
}

export default function ActionPlanSection({ userId }: ActionPlanSectionProps) {
  const queryClient = useQueryClient();

  const { data: actionPlans = [], isLoading } = useQuery<ActionPlan[]>({
    queryKey: [`/api/users/${userId}/action-plans`],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ 
      actionPlanId, 
      taskIndex, 
      completed 
    }: { 
      actionPlanId: number;
      taskIndex: number;
      completed: boolean;
    }) => {
      const response = await apiRequest(
        "PATCH", 
        `/api/action-plans/${actionPlanId}/tasks/${taskIndex}`,
        { completed }
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/action-plans`] });
    },
  });

  const handleTaskToggle = (actionPlanId: number, taskIndex: number, currentStatus: boolean) => {
    updateTaskMutation.mutate({
      actionPlanId,
      taskIndex,
      completed: !currentStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="animate-pulse mb-6">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!actionPlans.length) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 font-heading">Your 4-Week Action Plan</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-neutral-600">
              No action plan available. Complete your wellness assessment to receive a personalized action plan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort action plans by week number
  const sortedPlans = [...actionPlans].sort((a, b) => a.weekNumber - b.weekNumber);
  
  // Check if a plan is the current week
  const now = new Date();
  const getCurrentWeekPlan = () => {
    return sortedPlans.find(plan => {
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      return now >= startDate && now <= endDate;
    });
  };
  
  const isCurrentWeek = (plan: ActionPlan) => {
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800 font-heading">Your 4-Week Action Plan</h2>
        <Button variant="link" className="text-primary-600 font-medium p-0">
          View Full Plan
        </Button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden p-6">
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {sortedPlans.map((plan) => {
            const startDate = new Date(plan.startDate);
            const endDate = new Date(plan.endDate);
            const formattedDateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
            
            const completedTasks = plan.tasks.filter(task => task.completed).length;
            const totalTasks = plan.tasks.length;
            const progressPercentage = (completedTasks / totalTasks) * 100;
            
            return (
              <div 
                key={plan.id} 
                className="flex-shrink-0 w-64 bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden"
              >
                <div className={`${isCurrentWeek(plan) ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-700'} p-3`}>
                  <h3 className="font-medium">Week {plan.weekNumber}: {formattedDateRange}</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {plan.tasks.map((task, index) => (
                      <li key={task.id} className="flex items-start">
                        <button
                          onClick={() => handleTaskToggle(plan.id, index, task.completed)}
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            task.completed 
                              ? 'border-2 border-primary-500' 
                              : 'border-2 border-neutral-300'
                          }`}
                        >
                          {task.completed && (
                            <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                          )}
                        </button>
                        <span className="ml-2 text-sm text-neutral-700">{task.description}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Progress</span>
                      <span className={`text-xs font-medium ${
                        isCurrentWeek(plan) ? 'text-primary-600' : 'text-neutral-600'
                      }`}>
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-1.5 mt-1" 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
