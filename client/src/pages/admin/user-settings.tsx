import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Eye } from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  customSlug: string;
  isActive: boolean;
}

export default function UserSettings() {
  const [customSlug, setCustomSlug] = useState("");
  const [slugPreview, setSlugPreview] = useState("");
  const queryClient = useQueryClient();

  // Get current user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  // Update custom slug
  const updateSlugMutation = useMutation({
    mutationFn: async (newSlug: string) => {
      const response = await fetch("/api/user/custom-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customSlug: newSlug }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update URL");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      alert("Custom URL updated successfully!"); // Simple alert instead of toast
      setSlugPreview(customSlug);
    },
    onError: (error: any) => {
      alert(error.message || "Failed to update URL"); // Simple alert instead of toast
    },
  });

  useEffect(() => {
    if (profile) {
      const slug = profile.customSlug || profile.username;
      setCustomSlug(slug);
      setSlugPreview(slug);
    }
  }, [profile]);

  const handleSlugChange = (value: string) => {
    // Auto-format: lowercase, replace spaces with hyphens, remove invalid chars
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setCustomSlug(formatted);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentDomain = window.location.hostname;
  const currentPort = window.location.port;
  const baseUrl = `${window.location.protocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}`;

  const publicUrls = [
    {
      url: `${baseUrl}/agent/${slugPreview}`,
      type: "Custom URL",
      primary: true
    },
    {
      url: `${baseUrl}/agent/${profile?.username}`,
      type: "Username URL",
      primary: false
    },
    {
      url: `${baseUrl}/api/agent/${slugPreview}/template`,
      type: "API Endpoint",
      primary: false
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Settings</h1>
        <Badge variant={profile?.isActive ? "default" : "secondary"}>
          {profile?.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Public URLs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Your Public Website URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Your real estate website is accessible at:</Label>
            <div className="mt-3 space-y-3">
              {publicUrls.map((item, index) => (
                <div key={index} className={`flex items-center gap-2 p-3 rounded-lg border ${item.primary ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.primary ? "default" : "secondary"}>
                        {item.type}
                      </Badge>
                      {item.primary && <Badge variant="outline">Recommended</Badge>}
                    </div>
                    <Input 
                      value={item.url} 
                      readOnly 
                      className="font-mono text-sm bg-white"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                    className="shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      alert("URL copied to clipboard!"); // Simple alert instead of toast
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom URL Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custom URL Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customSlug">Custom URL Slug</Label>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-l-md border border-r-0">
                {baseUrl}/agent/
              </span>
              <Input
                id="customSlug"
                value={customSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="your-name"
                className="rounded-l-none"
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Only lowercase letters, numbers, and hyphens allowed (min 3 chars)
              </p>
              {customSlug && customSlug !== slugPreview && (
                <Badge variant="outline" className="text-xs">
                  Changes not saved
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => updateSlugMutation.mutate(customSlug)}
              disabled={updateSlugMutation.isPending || !customSlug || customSlug === slugPreview || customSlug.length < 3}
              className="flex-1"
            >
              {updateSlugMutation.isPending ? "Updating..." : "Update Custom URL"}
            </Button>
            
            {customSlug && customSlug !== slugPreview && (
              <Button 
                variant="outline"
                onClick={() => setCustomSlug(slugPreview)}
              >
                Reset
              </Button>
            )}
          </div>

          {/* URL Preview */}
          {customSlug && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-1">Preview:</p>
              <p className="text-sm text-blue-700 font-mono break-all">
                {baseUrl}/agent/{customSlug}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Website Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Preview how your public website will look to visitors:
          </p>
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <div className="bg-gray-200 px-4 py-2 text-sm text-gray-600 font-mono">
              {baseUrl}/agent/{slugPreview}
            </div>
            <iframe 
              src={`/agent/${slugPreview}`}
              className="w-full h-96 bg-white"
              title="Website Preview"
              onError={() => console.log("Preview iframe failed to load")}
            />
          </div>
          <div className="mt-3 text-center">
            <Button 
              variant="outline" 
              onClick={() => window.open(`/agent/${slugPreview}`, '_blank')}
            >
              Open in New Tab
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
