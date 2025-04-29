import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ActionPlanSection from "@/components/dashboard/ActionPlanSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActionPlan() {
  // For demo purposes, hardcode user ID to 1
  const userId = 1;
  
  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tabs Navigation */}
          <div className="border-b border-neutral-200 mb-6">
            <Tabs defaultValue="action-plan" className="w-full">
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
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 font-heading mb-6">Your Action Plan</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About Your Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-4">
                  Your 4-week action plan is personalized based on your wellness assessment results. 
                  Each week contains specific tasks designed to improve your wellness scores and 
                  optimize your HSA usage.
                </p>
                <p className="text-neutral-600">
                  Track your progress by marking tasks as complete. Tasks will automatically adjust 
                  based on your progress and feedback.
                </p>
              </CardContent>
            </Card>
            
            <ActionPlanSection userId={userId} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
