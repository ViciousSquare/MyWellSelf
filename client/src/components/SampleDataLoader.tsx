import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SampleDataLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const loadSampleDataMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/sample-data/load", {
        userId: 1 // For demo purposes, hardcoded to user ID 1
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all queries to refresh the UI with the new data
      queryClient.invalidateQueries();
      
      toast({
        title: "Sample data loaded!",
        description: "The app has been populated with sample wellness scores, recommendations, and action plans.",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error loading sample data:", error);
      toast({
        title: "Error loading sample data",
        description: "There was a problem loading the sample data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => loadSampleDataMutation.mutate()}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading sample data...
        </>
      ) : (
        "Load Sample Data"
      )}
    </Button>
  );
}