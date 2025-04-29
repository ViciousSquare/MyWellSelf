import { useQuery } from "@tanstack/react-query";
import { Recommendation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Brain, Bed, Heart, Terminal } from "lucide-react";

interface RecommendationsCardProps {
  userId: number;
}

export default function RecommendationsCard({ userId }: RecommendationsCardProps) {
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: [`/api/users/${userId}/recommendations`],
  });

  if (isLoading) {
    return (
      <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="h-28 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-neutral-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-4">Personalized Recommendations</h2>
        <p className="text-neutral-600 mb-4">Complete your wellness assessment to receive personalized recommendations.</p>
      </div>
    );
  }

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'brain': return <Brain className="h-5 w-5" />;
      case 'bed': return <Bed className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'running': return <Terminal className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental': return 'bg-accent-100 text-accent-600';
      case 'sleep': return 'bg-secondary-100 text-secondary-600';
      case 'stress': return 'bg-red-100 text-red-600';
      case 'physical': return 'bg-primary-100 text-primary-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-4">Personalized Recommendations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {recommendations.slice(0, 4).map((recommendation) => (
            <div key={recommendation.id} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <div className="flex items-start">
                <div className={`p-2 rounded-md ${getCategoryColor(recommendation.category)}`}>
                  {getIconComponent(recommendation.icon)}
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-neutral-800">{recommendation.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{recommendation.description}</p>
                  <div className="mt-3 flex items-center">
                    <span className={`text-xs font-medium ${recommendation.isHSAEligible ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'} px-2 py-1 rounded-full`}>
                      {recommendation.tag || (recommendation.isHSAEligible ? 'HSA Eligible' : 'Habit Building')}
                    </span>
                    <button className="ml-auto text-primary-600 text-sm font-medium">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full">
          View All Recommendations
        </Button>
      </div>
    </div>
  );
}
