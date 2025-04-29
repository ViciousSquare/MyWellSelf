import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Award, 
  Heart, 
  Brain, 
  Utensils, 
  Zap,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Resource types
const resourceCategories = [
  { id: "wellness", name: "General Wellness", icon: <Heart className="h-5 w-5" /> },
  { id: "mental", name: "Mental Health", icon: <Brain className="h-5 w-5" /> },
  { id: "nutrition", name: "Nutrition", icon: <Utensils className="h-5 w-5" /> },
  { id: "fitness", name: "Fitness", icon: <Zap className="h-5 w-5" /> },
  { id: "hsa", name: "HSA Information", icon: <CreditCard className="h-5 w-5" /> },
];

// Resource items
const resources = [
  {
    id: 1,
    title: "Understanding Your HSA Benefits",
    description: "A comprehensive guide to maximizing your Health Savings Account.",
    type: "article",
    category: "hsa",
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Mindfulness Meditation Basics",
    description: "Learn the fundamentals of mindfulness practice for stress reduction.",
    type: "video",
    category: "mental",
    icon: <Video className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Sleep Optimization Guide",
    description: "Practical tips for better sleep quality and duration.",
    type: "guide",
    category: "wellness",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: 4,
    title: "30-Day Mental Wellness Challenge",
    description: "Daily activities to improve your mental health over 30 days.",
    type: "program",
    category: "mental",
    icon: <Award className="h-5 w-5" />
  },
  {
    id: 5,
    title: "Healthy Meal Planning on a Budget",
    description: "Cost-effective strategies for nutritious meal planning.",
    type: "guide",
    category: "nutrition",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: 6,
    title: "HSA-Eligible Expenses List",
    description: "Comprehensive catalog of products and services covered by your HSA.",
    type: "article",
    category: "hsa",
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 7,
    title: "15-Minute Home Workout Series",
    description: "Quick, effective workouts you can do without equipment.",
    type: "video",
    category: "fitness",
    icon: <Video className="h-5 w-5" />
  },
  {
    id: 8,
    title: "Understanding Stress and Your Body",
    description: "The science of stress and evidence-based management techniques.",
    type: "article",
    category: "wellness",
    icon: <FileText className="h-5 w-5" />
  },
];

export default function Resources() {
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
            <Tabs defaultValue="resources" className="w-full">
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
            <h2 className="text-xl font-semibold text-neutral-800 font-heading mb-6">Resources Library</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Wellness & HSA Resources</CardTitle>
                <CardDescription>
                  Explore our curated collection of articles, videos, and guides to help you
                  improve your wellness and optimize your HSA benefits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" className="rounded-full">All Resources</Button>
                  {resourceCategories.map((category) => (
                    <Button key={category.id} variant="outline" className="rounded-full">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          resource.category === 'mental' ? 'bg-accent-100 text-accent-600' :
                          resource.category === 'nutrition' ? 'bg-red-100 text-red-600' :
                          resource.category === 'fitness' ? 'bg-green-100 text-green-600' :
                          resource.category === 'hsa' ? 'bg-primary-100 text-primary-600' :
                          'bg-neutral-100 text-neutral-600'
                        } mr-3`}>
                          {resource.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <p className="text-xs text-neutral-500 mt-1">
                            {resourceCategories.find(c => c.id === resource.category)?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 text-sm mb-4">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        resource.type === 'article' ? 'bg-blue-100 text-blue-700' :
                        resource.type === 'video' ? 'bg-red-100 text-red-700' :
                        resource.type === 'guide' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                      <Button variant="link" className="p-0 h-auto text-primary-600">
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="mr-2">Previous</Button>
              <Button variant="outline" className="mx-1">1</Button>
              <Button variant="outline" className="mx-1">2</Button>
              <Button variant="outline" className="mx-1">3</Button>
              <Button variant="outline" className="ml-2">Next</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
