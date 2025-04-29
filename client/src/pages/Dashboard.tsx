import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import HSAOverviewCard from "@/components/dashboard/HSAOverviewCard";
import WellnessScoreCard from "@/components/dashboard/WellnessScoreCard";
import RecommendationsCard from "@/components/dashboard/RecommendationsCard";
import AbbyCard from "@/components/dashboard/AbbyCard";
import ActionPlanSection from "@/components/dashboard/ActionPlanSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  
  // For demo purposes, hardcode user ID to 1
  const userId = 1;
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tabs Navigation */}
          <div className="border-b border-neutral-200 mb-6">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid-cols-5">
                <TabsTrigger value="dashboard" asChild>
                  <Link href="/" className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 py-3 px-1 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300">
                    Dashboard
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="assessment" asChild>
                  <Link href="/assessment" className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 py-3 px-1 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300">
                    Wellness Assessment
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="action-plan" asChild>
                  <Link href="/action-plan" className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 py-3 px-1 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300">
                    Action Plan
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="hsa" asChild>
                  <Link href="/hsa-optimization" className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 py-3 px-1 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300">
                    HSA Optimization
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="resources" asChild>
                  <Link href="/resources" className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 py-3 px-1 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300">
                    Resources
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WelcomeCard userId={userId} />
            <HSAOverviewCard userId={userId} />
            <WellnessScoreCard userId={userId} />
            <RecommendationsCard userId={userId} />
            <AbbyCard userId={userId} />
          </div>
          
          {/* Action Plan Section */}
          <ActionPlanSection userId={userId} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
