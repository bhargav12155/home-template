import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Eye, Globe, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserUniqueInfo {
  uniqueId: string;
  formattedUniqueId: string;
  publicUrl: string;
  fullUrl: string;
  username: string;
  displayName: string;
  isActive: boolean;
}

export default function UserDashboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user's unique ID and profile info
  const { data: userInfo, isLoading } = useQuery<UserUniqueInfo>({
    queryKey: ["user-unique-id"],
    queryFn: async () => {
      const response = await fetch("/api/user/my-unique-id", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user info");
      return response.json();
    },
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openPreview = () => {
    if (userInfo?.fullUrl) {
      window.open(userInfo.fullUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjork-blue"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Unable to load user information</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userInfo.displayName || userInfo.username}!
        </h1>
        <p className="text-gray-600">
          Manage your real estate website and view your public URL
        </p>
      </div>

      {/* Your Unique Website ID */}
      <Card className="mb-6 border-2 border-bjork-blue/20 bg-gradient-to-r from-bjork-blue/5 to-bjork-beige/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-bjork-blue" />
            Your Unique Website ID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm border">
              <Badge variant="secondary" className="bg-bjork-blue text-white text-lg font-mono px-3 py-1">
                {userInfo.formattedUniqueId}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(userInfo.uniqueId, "Unique ID")}
                className="h-8 w-8 p-0"
              >
                <Copy className={`h-4 w-4 ${copied === "Unique ID" ? "text-green-600" : "text-gray-400"}`} />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This is your permanent website identifier
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Public Website URL */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-bjork-blue" />
            Your Public Website
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Public URL
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={userInfo.fullUrl}
                readOnly
                className="font-mono text-sm bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(userInfo.fullUrl, "Website URL")}
                className="px-3"
              >
                <Copy className={`h-4 w-4 ${copied === "Website URL" ? "text-green-600" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openPreview}
                className="px-3"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Share this URL with clients to view your branded real estate website
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={openPreview}
              className="bg-bjork-blue hover:bg-bjork-blue/90"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Website
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(userInfo.fullUrl, "Website URL")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Website Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Website Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${userInfo.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${userInfo.isActive ? 'text-green-700' : 'text-red-700'}`}>
              {userInfo.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {userInfo.isActive 
              ? 'Your website is live and accessible to visitors' 
              : 'Your website is currently disabled'
            }
          </p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Your Unique ID Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>🔗 Unique URL:</strong> Your website is accessible at{" "}
              <code className="bg-gray-100 px-1 rounded">website.com/user/{userInfo.uniqueId}</code>
            </p>
            <p>
              <strong>🎨 Branded Experience:</strong> Visitors see your custom logo, colors, and content
            </p>
            <p>
              <strong>📱 Multi-Device:</strong> Your website works perfectly on desktop, tablet, and mobile
            </p>
            <p>
              <strong>🏠 Property Listings:</strong> All properties are displayed with your branding
            </p>
            <p>
              <strong>📞 Lead Capture:</strong> Contact forms send leads directly to you
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
