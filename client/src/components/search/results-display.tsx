import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, Bookmark, Search } from "lucide-react";
import type { 
  Search as SearchType, 
  EmailLookupResult, 
  DomainAnalysisResult, 
  IPGeolocationResult, 
  PhoneLookupResult,
  SocialMediaResult 
} from "@shared/schema";

interface ResultsDisplayProps {
  search: SearchType | null;
  isLoading?: boolean;
}

export default function ResultsDisplay({ search, isLoading }: ResultsDisplayProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkNotes, setBookmarkNotes] = useState("");
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);

  const bookmarkMutation = useMutation({
    mutationFn: async (data: { searchId: string; title: string; notes?: string }) => {
      const response = await apiRequest("POST", "/api/bookmarks", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Bookmark saved",
        description: "Search has been bookmarked successfully",
      });
      setShowBookmarkForm(false);
      setBookmarkTitle("");
      setBookmarkNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to bookmark",
        description: error.message || "Failed to save bookmark",
        variant: "destructive",
      });
    },
  });

  const handleBookmark = () => {
    if (!search) return;
    
    if (showBookmarkForm) {
      if (!bookmarkTitle.trim()) {
        toast({
          title: "Title required",
          description: "Please enter a title for the bookmark",
          variant: "destructive",
        });
        return;
      }
      
      bookmarkMutation.mutate({
        searchId: search.id,
        title: bookmarkTitle,
        notes: bookmarkNotes || undefined,
      });
    } else {
      setBookmarkTitle(`${search.searchType.toUpperCase()}: ${search.query}`);
      setShowBookmarkForm(true);
    }
  };

  const handleExport = () => {
    if (!search || !search.results) return;
    
    const exportData = {
      query: search.query,
      searchType: search.searchType,
      timestamp: search.createdAt,
      results: search.results,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-${search.searchType}-${search.query}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Results have been exported to JSON file",
    });
  };

  if (isLoading) {
    return (
      <div className="osint-card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-300">Analyzing target...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!search) {
    return (
      <div className="osint-card p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-50 mb-2" data-testid="no-results-title">
            No results yet
          </h3>
          <p className="text-gray-400" data-testid="no-results-description">
            Start an investigation to see results here
          </p>
        </div>
      </div>
    );
  }

  if (search.status === "failed") {
    return (
      <div className="osint-card p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-400 mb-2" data-testid="search-failed-title">
            Search Failed
          </h3>
          <p className="text-gray-400" data-testid="search-failed-description">
            {(search.results as any)?.error || "An error occurred during the investigation"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="osint-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-50" data-testid="results-title">
          Investigation Results
        </h2>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="osint-button-secondary text-xs"
            data-testid="button-export-results"
          >
            <Download className="mr-1" size={14} />
            Export
          </Button>
          <Button
            onClick={handleBookmark}
            variant="outline" 
            size="sm"
            className="osint-button-primary text-xs"
            disabled={bookmarkMutation.isPending}
            data-testid="button-bookmark-results"
          >
            <Bookmark className="mr-1" size={14} />
            Bookmark
          </Button>
        </div>
      </div>

      {showBookmarkForm && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h3 className="text-sm font-medium text-gray-50 mb-3">Bookmark this search</h3>
          <div className="space-y-3">
            <Input
              placeholder="Bookmark title"
              value={bookmarkTitle}
              onChange={(e) => setBookmarkTitle(e.target.value)}
              className="osint-search-input"
              data-testid="input-bookmark-title"
            />
            <Textarea
              placeholder="Notes (optional)"
              value={bookmarkNotes}
              onChange={(e) => setBookmarkNotes(e.target.value)}
              className="osint-search-input"
              rows={3}
              data-testid="textarea-bookmark-notes"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleBookmark}
                size="sm"
                className="osint-button-primary"
                disabled={bookmarkMutation.isPending}
                data-testid="button-save-bookmark"
              >
                Save Bookmark
              </Button>
              <Button
                onClick={() => setShowBookmarkForm(false)}
                variant="outline"
                size="sm"
                className="osint-button-secondary"
                data-testid="button-cancel-bookmark"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {search.searchType === "email" && search.results && (
        <EmailResults results={search.results as EmailLookupResult} />
      )}

      {search.searchType === "domain" && search.results && (
        <DomainResults results={search.results as DomainAnalysisResult} />
      )}

      {search.searchType === "ip" && search.results && (
        <IPResults results={search.results as IPGeolocationResult} />
      )}

      {search.searchType === "phone" && search.results && (
        <PhoneResults results={search.results as PhoneLookupResult} />
      )}

      {search.searchType === "social" && search.results && (
        <SocialResults results={search.results as SocialMediaResult[]} />
      )}
    </div>
  );
}

function EmailResults({ results }: { results: EmailLookupResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Email Information Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-50">Email Information</h3>
          <span className={`osint-status-badge ${results.valid ? 'osint-status-success' : 'osint-status-error'}`}>
            {results.valid ? 'Verified' : 'Invalid'}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Provider:</span>
            <span className="text-gray-50 text-sm" data-testid="email-provider">{results.provider}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Valid:</span>
            <span className={`text-sm ${results.valid ? 'text-green-400' : 'text-red-400'}`} data-testid="email-valid">
              {results.valid ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Disposable:</span>
            <span className={`text-sm ${results.disposable ? 'text-red-400' : 'text-green-400'}`} data-testid="email-disposable">
              {results.disposable ? 'Yes' : 'No'}
            </span>
          </div>
          {results.catchAll !== null && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Catch-all:</span>
              <span className="text-gray-50 text-sm" data-testid="email-catchall">
                {results.catchAll ? 'Yes' : 'No'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Breach Information Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-50">Data Breaches</h3>
          <span className={`osint-status-badge ${results.breaches.length > 0 ? 'osint-status-error' : 'osint-status-success'}`}>
            {results.breaches.length} Found
          </span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {results.breaches.length === 0 ? (
            <p className="text-gray-400 text-sm" data-testid="no-breaches">No breaches found</p>
          ) : (
            results.breaches.map((breach, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-50 text-sm" data-testid={`breach-name-${index}`}>
                  {breach.name} ({breach.date})
                </span>
                <span className="text-red-400 text-xs" data-testid={`breach-data-${index}`}>
                  {breach.dataTypes.join(', ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Social Media Presence */}
      {results.socialMedia.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-50">Social Media</h3>
            <span className="osint-status-badge osint-status-info">
              {results.socialMedia.length} Found
            </span>
          </div>
          <div className="space-y-2">
            {results.socialMedia.map((social, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-50 text-sm" data-testid={`social-platform-${index}`}>
                  {social.platform}
                </span>
                <a 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline"
                  data-testid={`social-link-${index}`}
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {results.additionalInfo && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-50">Additional Info</h3>
            <span className="osint-status-badge osint-status-warning">Partial</span>
          </div>
          <div className="space-y-2">
            {results.additionalInfo.location && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Location:</span>
                <span className="text-gray-50 text-sm" data-testid="additional-location">
                  {results.additionalInfo.location}
                </span>
              </div>
            )}
            {results.additionalInfo.company && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Company:</span>
                <span className="text-gray-50 text-sm" data-testid="additional-company">
                  {results.additionalInfo.company}
                </span>
              </div>
            )}
            {results.additionalInfo.phone && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Phone:</span>
                <span className="text-gray-300 text-sm" data-testid="additional-phone">
                  {results.additionalInfo.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DomainResults({ results }: { results: DomainAnalysisResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Domain Information */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="font-medium text-gray-50 mb-3">Domain Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Domain:</span>
            <span className="text-gray-50 text-sm" data-testid="domain-name">{results.domain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Registrar:</span>
            <span className="text-gray-50 text-sm" data-testid="domain-registrar">{results.registrar}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Created:</span>
            <span className="text-gray-50 text-sm" data-testid="domain-created">{results.creationDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Expires:</span>
            <span className="text-gray-50 text-sm" data-testid="domain-expires">{results.expirationDate}</span>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="font-medium text-gray-50 mb-3">Security Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">SSL Certificate:</span>
            <span className={`text-sm ${results.securityInfo.ssl ? 'text-green-400' : 'text-red-400'}`}>
              {results.securityInfo.ssl ? 'Valid' : 'Invalid'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Malware:</span>
            <span className={`text-sm ${results.securityInfo.malware ? 'text-red-400' : 'text-green-400'}`}>
              {results.securityInfo.malware ? 'Detected' : 'Clean'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Phishing:</span>
            <span className={`text-sm ${results.securityInfo.phishing ? 'text-red-400' : 'text-green-400'}`}>
              {results.securityInfo.phishing ? 'Detected' : 'Clean'}
            </span>
          </div>
        </div>
      </div>

      {/* Nameservers */}
      {results.nameservers.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h3 className="font-medium text-gray-50 mb-3">Nameservers</h3>
          <div className="space-y-1">
            {results.nameservers.map((ns, index) => (
              <div key={index} className="text-gray-50 text-sm" data-testid={`nameserver-${index}`}>
                {ns}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {results.technologies.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h3 className="font-medium text-gray-50 mb-3">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {results.technologies.map((tech, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                data-testid={`technology-${index}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IPResults({ results }: { results: IPGeolocationResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Location Information */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="font-medium text-gray-50 mb-3">Location Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">IP Address:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-address">{results.ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Country:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-country">{results.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Region:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-region">{results.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">City:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-city">{results.city}</span>
          </div>
        </div>
      </div>

      {/* Network Information */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="font-medium text-gray-50 mb-3">Network Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">ISP:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-isp">{results.isp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Organization:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-organization">{results.organization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">ASN:</span>
            <span className="text-gray-50 text-sm" data-testid="ip-asn">{results.asn}</span>
          </div>
        </div>
      </div>

      {/* Security Assessment */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 md:col-span-2">
        <h3 className="font-medium text-gray-50 mb-3">Security Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">VPN:</span>
            <span className={`text-sm ${results.vpn ? 'text-red-400' : 'text-green-400'}`}>
              {results.vpn ? 'Detected' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Proxy:</span>
            <span className={`text-sm ${results.proxy ? 'text-red-400' : 'text-green-400'}`}>
              {results.proxy ? 'Detected' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Threat Level:</span>
            <span className={`text-sm ${
              results.threatLevel === 'High' ? 'text-red-400' : 
              results.threatLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
            }`} data-testid="ip-threat-level">
              {results.threatLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneResults({ results }: { results: PhoneLookupResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Phone Information */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="font-medium text-gray-50 mb-3">Phone Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Number:</span>
            <span className="text-gray-50 text-sm" data-testid="phone-number">{results.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Valid:</span>
            <span className={`text-sm ${results.valid ? 'text-green-400' : 'text-red-400'}`}>
              {results.valid ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Country:</span>
            <span className="text-gray-50 text-sm" data-testid="phone-country">{results.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Carrier:</span>
            <span className="text-gray-50 text-sm" data-testid="phone-carrier">{results.carrier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Line Type:</span>
            <span className="text-gray-50 text-sm" data-testid="phone-line-type">{results.lineType}</span>
          </div>
        </div>
      </div>

      {/* Location Information */}
      {(results.location.city || results.location.region) && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h3 className="font-medium text-gray-50 mb-3">Location</h3>
          <div className="space-y-2">
            {results.location.city && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">City:</span>
                <span className="text-gray-50 text-sm" data-testid="phone-city">{results.location.city}</span>
              </div>
            )}
            {results.location.region && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Region:</span>
                <span className="text-gray-50 text-sm" data-testid="phone-region">{results.location.region}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SocialResults({ results }: { results: SocialMediaResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400" data-testid="no-social-results">No social media profiles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((social, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-50" data-testid={`social-platform-${index}`}>
              {social.platform}
            </h3>
            {social.verified && (
              <span className="osint-status-badge osint-status-success">Verified</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Username:</span>
              <span className="text-gray-50 text-sm" data-testid={`social-username-${index}`}>
                {social.username}
              </span>
            </div>
            {social.followers !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Followers:</span>
                <span className="text-gray-50 text-sm" data-testid={`social-followers-${index}`}>
                  {social.followers.toLocaleString()}
                </span>
              </div>
            )}
            {social.posts !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Posts:</span>
                <span className="text-gray-50 text-sm" data-testid={`social-posts-${index}`}>
                  {social.posts.toLocaleString()}
                </span>
              </div>
            )}
            {social.bio && (
              <div className="mt-2">
                <span className="text-gray-400 text-sm">Bio:</span>
                <p className="text-gray-50 text-sm mt-1" data-testid={`social-bio-${index}`}>
                  {social.bio}
                </p>
              </div>
            )}
            <a 
              href={social.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-400 text-sm hover:underline"
              data-testid={`social-profile-link-${index}`}
            >
              View Profile →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
