import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSearchSchema } from "@shared/schema";
import { Search } from "lucide-react";

const searchFormSchema = insertSearchSchema.extend({
  breachCheck: z.boolean().optional(),
  socialMediaScan: z.boolean().optional(),
  whoisLookup: z.boolean().optional(),
  subdomainScan: z.boolean().optional(),
  threatIntelligence: z.boolean().optional(),
});

type SearchFormData = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  searchType: "email" | "domain" | "ip" | "phone" | "social";
  onSearchComplete?: (result: any) => void;
}

const searchTypeLabels = {
  email: "Email Address",
  domain: "Domain Name", 
  ip: "IP Address",
  phone: "Phone Number",
  social: "Username"
};

const searchTypePlaceholders = {
  email: "example@domain.com",
  domain: "example.com",
  ip: "192.168.1.1", 
  phone: "+1-555-123-4567",
  social: "username"
};

const searchTypeOptions = {
  email: [
    { id: "breachCheck", label: "Breach Check", defaultChecked: true },
    { id: "socialMediaScan", label: "Social Media Scan", defaultChecked: false },
  ],
  domain: [
    { id: "whoisLookup", label: "WHOIS Lookup", defaultChecked: true },
    { id: "subdomainScan", label: "Subdomain Scan", defaultChecked: false },
  ],
  ip: [
    { id: "threatIntelligence", label: "Threat Intelligence", defaultChecked: true },
  ],
  phone: [],
  social: [],
};

export default function SearchForm({ searchType, onSearchComplete }: SearchFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchType,
      query: "",
      status: "pending",
      breachCheck: true,
      socialMediaScan: false,
      whoisLookup: true,
      subdomainScan: false,
      threatIntelligence: true,
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: SearchFormData) => {
      const response = await apiRequest("POST", "/api/searches", {
        query: data.query,
        searchType: data.searchType,
        status: data.status,
      });
      return await response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/searches/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Search completed",
        description: `Successfully analyzed ${result.query}`,
      });
      
      onSearchComplete?.(result);
    },
    onError: (error: any) => {
      toast({
        title: "Search failed",
        description: error.message || "Failed to perform search",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SearchFormData) => {
    searchMutation.mutate(data);
  };

  const options = searchTypeOptions[searchType] || [];

  return (
    <div className="osint-card p-6">
      <h2 className="text-lg font-semibold text-gray-50 mb-4" data-testid="search-form-title">
        Quick Search
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">
            {searchTypeLabels[searchType]}
          </Label>
          <Input
            {...form.register("query")}
            placeholder={searchTypePlaceholders[searchType]}
            className="osint-search-input"
            data-testid={`input-${searchType}-query`}
          />
          {form.formState.errors.query && (
            <p className="text-red-400 text-sm mt-1" data-testid="error-query">
              {form.formState.errors.query.message}
            </p>
          )}
        </div>

        {options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  {...form.register(option.id as any)}
                  defaultChecked={option.defaultChecked}
                  className="text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  data-testid={`checkbox-${option.id}`}
                />
                <Label htmlFor={option.id} className="text-sm text-gray-300">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={searchMutation.isPending}
          className="osint-button-primary w-full"
          data-testid="button-start-investigation"
        >
          {searchMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2" size={16} />
              Start Investigation
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
