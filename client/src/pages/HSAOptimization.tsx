import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Calculator, CreditCard, Receipt, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { HsaInfo, WellnessScore } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export default function HSAOptimization() {
  // For demo purposes, hardcode user ID to 1
  const userId = 1;
  const queryClient = useQueryClient();
  const [hsaRecommendations, setHsaRecommendations] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });
  
  const { data: hsaInfo, isLoading: isLoadingHsaInfo } = useQuery<HsaInfo>({
    queryKey: [`/api/users/${userId}/hsa-info`],
  });
  
  const { data: wellnessScore, isLoading: isLoadingWellnessScore } = useQuery<WellnessScore>({
    queryKey: [`/api/users/${userId}/wellness-scores/latest`],
    // If no wellness score is found, handle it in the UI
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  // Mutation to optimize HSA with OpenAI
  const optimizeHsaMutation = useMutation({
    mutationFn: async () => {
      if (!hsaInfo || !wellnessScore) {
        throw new Error("Missing HSA info or wellness score");
      }
      
      setIsOptimizing(true);
      
      const response = await apiRequest("POST", "/api/optimize/hsa", {
        userId,
        hsaInfo: {
          balance: hsaInfo.balance,
          annualLimit: hsaInfo.annualLimit
        },
        wellnessScores: {
          physical: wellnessScore.physical,
          mental: wellnessScore.mental,
          sleep: wellnessScore.sleep,
          stress: wellnessScore.stress,
          nutrition: wellnessScore.nutrition
        }
      });
      
      return await response.json();
    },
    onSuccess: (data) => {
      setIsOptimizing(false);
      
      // Store the recommendations
      if (data.recommendations) {
        setHsaRecommendations(data.recommendations);
      }
      
      // Refresh HSA info to get updated tax savings
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/hsa-info`] });
    },
    onError: () => {
      setIsOptimizing(false);
    }
  });
  
  // If we have HSA info and wellness score but no recommendations yet, run the optimization
  useEffect(() => {
    if (hsaInfo && wellnessScore && !isOptimizing && hsaRecommendations.length === 0) {
      optimizeHsaMutation.mutate();
    }
  }, [hsaInfo, wellnessScore, hsaRecommendations, isOptimizing]);
  
  // Create default HSA info if none exists
  const createHsaInfoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hsa-info", {
        userId,
        balance: 1850,
        annualLimit: 3850,
        taxSavings: 450
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/hsa-info`] });
    }
  });
  
  // If no HSA info exists yet, create default
  useEffect(() => {
    if (isLoadingHsaInfo === false && !hsaInfo) {
      createHsaInfoMutation.mutate();
    }
  }, [isLoadingHsaInfo, hsaInfo]);
  
  // If no wellness score, offer placeholder content
  const needsAssessment = isLoadingWellnessScore === false && !wellnessScore;

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tabs Navigation */}
          <div className="border-b border-neutral-200 mb-6">
            <Tabs defaultValue="hsa" className="w-full">
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
          
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 font-heading mb-6">HSA Optimization</h2>
            
            {needsAssessment ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Complete Your Wellness Assessment</CardTitle>
                  <CardDescription>For personalized HSA recommendations, we need to understand your wellness needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-6">
                    Your Health Savings Account (HSA) can be optimized based on your specific wellness needs.
                    Complete the wellness assessment to receive AI-powered recommendations on how to best
                    use your HSA funds for your health priorities.
                  </p>
                  <Link href="/assessment">
                    <Button>Take Wellness Assessment</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : isLoadingHsaInfo || isLoadingWellnessScore ? (
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-neutral-200 rounded w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-neutral-200 rounded"></div>
                  <div className="h-32 bg-neutral-200 rounded"></div>
                  <div className="h-32 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>HSA Overview</CardTitle>
                    <CardDescription>Your Health Savings Account status and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Current Balance</p>
                        <p className="text-3xl font-bold text-primary-600">${hsaInfo?.balance.toLocaleString() || 0}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                          <Progress value={(hsaInfo?.balance || 0) / (hsaInfo?.annualLimit || 1) * 100} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Annual Contribution</p>
                        <p className="text-3xl font-bold text-neutral-800">${hsaInfo?.annualLimit.toLocaleString() || 0}</p>
                        <p className="text-sm text-neutral-500 mt-1">Individual limit: $3,850</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Estimated Tax Savings</p>
                        <p className="text-3xl font-bold text-secondary-600">${hsaInfo?.taxSavings?.toLocaleString() || 0}</p>
                        <p className="text-sm text-secondary-500 mt-1">Based on current contributions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">HSA Calculator</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 text-sm">Estimate your potential tax savings and plan your HSA contributions.</p>
                      <Link href="#">
                        <p className="text-primary-600 text-sm mt-3 font-medium">Open Calculator →</p>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">Eligible Expenses</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 text-sm">Browse HSA-eligible products and services based on your needs.</p>
                      <Link href="#">
                        <p className="text-primary-600 text-sm mt-3 font-medium">View Expenses →</p>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-full bg-accent-100 text-accent-600 mr-3">
                          <Receipt className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">Submit Claims</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 text-sm">Easily submit and track your HSA reimbursement claims.</p>
                      <Link href="#">
                        <p className="text-primary-600 text-sm mt-3 font-medium">Submit Claim →</p>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <CardTitle>
                        {isOptimizing 
                          ? "Generating Personalized Recommendations..." 
                          : "Personalized HSA Optimization Recommendations"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isOptimizing ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-16 bg-neutral-200 rounded"></div>
                        <div className="h-16 bg-neutral-200 rounded"></div>
                        <div className="h-16 bg-neutral-200 rounded"></div>
                      </div>
                    ) : hsaRecommendations.length > 0 ? (
                      <div className="space-y-4">
                        {hsaRecommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-neutral-800">{rec.title}</h3>
                              <p className="text-sm text-neutral-600">{rec.description}</p>
                              {rec.cost && (
                                <p className="text-xs text-primary-600 mt-1">
                                  Estimated cost: ${typeof rec.cost === 'string' ? rec.cost : rec.cost.toLocaleString()} 
                                  {rec.priority && <span className="ml-2 bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full">{rec.priority} Priority</span>}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex items-start mt-6">
                          <AlertCircle className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-neutral-800">Contribute more to maximize tax benefits</h3>
                            <p className="text-sm text-neutral-600">
                              You're currently using only {Math.round((hsaInfo?.balance || 0) / (hsaInfo?.annualLimit || 1) * 100)}% 
                              of your annual HSA limit. Increasing your contributions could save you approximately 
                              ${Math.round(((hsaInfo?.annualLimit || 0) - (hsaInfo?.balance || 0)) * 0.25)} more in taxes.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-neutral-800">Consider a sleep consultation</h3>
                            <p className="text-sm text-neutral-600">Based on your sleep score of {wellnessScore?.sleep || 60}, a consultation with a sleep specialist could help improve your rest. Cost: $150-300, fully HSA eligible.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-neutral-800">Stress management therapy</h3>
                            <p className="text-sm text-neutral-600">Your stress score indicates therapy sessions could be beneficial. Many mental health providers accept HSA payments. Typical cost: $100-200 per session.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-neutral-800">Contribute more to maximize tax benefits</h3>
                            <p className="text-sm text-neutral-600">You're currently using only {Math.round((hsaInfo?.balance || 0) / (hsaInfo?.annualLimit || 1) * 100)}% of your annual HSA limit. Increasing your contributions could save you approximately ${Math.round(((hsaInfo?.annualLimit || 0) - (hsaInfo?.balance || 0)) * 0.25)} more in taxes.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Refresh recommendations button */}
                    {!isOptimizing && wellnessScore && (
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => optimizeHsaMutation.mutate()}
                          disabled={isOptimizing}
                        >
                          Refresh Recommendations
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
