import { useQuery } from "@tanstack/react-query";
import { WellnessScore } from "@/lib/types";
import { Radar } from "recharts";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart as RechartsRadarChart,
  Radar as RechartsRadar
} from "recharts";

interface WellnessScoreCardProps {
  userId: number;
}

export default function WellnessScoreCard({ userId }: WellnessScoreCardProps) {
  const { data: wellnessScore, isLoading } = useQuery<WellnessScore>({
    queryKey: [`/api/users/${userId}/wellness-scores/latest`],
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="h-40 bg-neutral-200 rounded w-full mb-6"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!wellnessScore) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-4">Wellness Score</h2>
        <p className="text-neutral-600">No wellness score data available. Complete an assessment to see your results.</p>
      </div>
    );
  }

  // Prepare data for radar chart
  const radarData = [
    { subject: 'Physical', A: wellnessScore.physical, fullMark: 100 },
    { subject: 'Mental', A: wellnessScore.mental, fullMark: 100 },
    { subject: 'Sleep', A: wellnessScore.sleep, fullMark: 100 },
    { subject: 'Stress', A: wellnessScore.stress, fullMark: 100 },
    { subject: 'Nutrition', A: wellnessScore.nutrition, fullMark: 100 },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading mb-4">Wellness Score</h2>
        
        <div className="radar-chart flex items-center justify-center mb-4">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Wellness" 
                dataKey="A" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
              <span className="text-sm font-medium text-neutral-700">Physical</span>
            </div>
            <span className="text-xl font-bold ml-5">{wellnessScore.physical}</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-accent-500 mr-2"></div>
              <span className="text-sm font-medium text-neutral-700">Mental</span>
            </div>
            <span className="text-xl font-bold ml-5">{wellnessScore.mental}</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>
              <span className="text-sm font-medium text-neutral-700">Sleep</span>
            </div>
            <span className="text-xl font-bold ml-5">{wellnessScore.sleep}</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm font-medium text-neutral-700">Stress</span>
            </div>
            <span className="text-xl font-bold ml-5">{wellnessScore.stress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
