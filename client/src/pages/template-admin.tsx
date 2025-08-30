import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Eye, Globe, Settings, Palette, User, FileText } from "lucide-react";
import { templateSchema, type Template, type InsertTemplate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ui/image-upload";
import { getImageUrlWithFallback, handleImageError } from "@/lib/media-utils";

export default function TemplateAdmin() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{
    logo?: string;
    hero?: string;
    heroVideo?: string;
    agent?: string;
  }>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Query current user's template (now requires authentication)
  const { data: template, isLoading } = useQuery<Template>({
    queryKey: ['/api/template', user?.id], // Include user ID in query key
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
  });

  const form = useForm<InsertTemplate>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      userId: user?.id, // Add the current user's ID
      companyName: "Your Real Estate Company",
      agentName: "Your Name",
      agentTitle: "Principal Broker",
      agentEmail: "",
      phone: "",
      heroTitle: "Ready to Find Your Dream Home?",
      heroSubtitle: "Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.",
      contactPhone: "(402) 522-6131",
      contactPhoneText: "Call or text anytime",
      officeAddress: "331 Village Pointe Plaza",
      officeCity: "Omaha",
      officeState: "NE",
      officeZip: "68130",
      companyDescription: "We believe that luxury is not a price point but an experience.",
      agentBio: "Professional real estate agent with years of experience.",
      homesSold: 500,
      totalSalesVolume: "$200M+",
      yearsExperience: 15,
      clientSatisfaction: "98%",
      serviceAreas: ["Your Primary City", "Your Secondary City"],
      primaryColor: "hsl(20, 14.3%, 4.1%)",
      accentColor: "hsl(213, 100%, 45%)",
      beigeColor: "hsl(25, 35%, 75%)",
  // Media defaults
  logoUrl: "",
  heroImageUrl: "",
  agentImageUrl: "",
      subdomain: "",
      customDomain: "",
      isActive: true
    },
  });

  // Reset form when template data loads
  React.useEffect(() => {
    if (template && user) {
      console.log("Loaded template data:", template);
      // Ensure userId is included and remove timestamp fields that shouldn't be in the form
      const { createdAt, updatedAt, ...templateWithoutTimestamps } = template;
      
      // Convert null values to empty strings for form inputs
      const cleanedTemplate = Object.entries(templateWithoutTimestamps).reduce((acc, [key, value]) => {
        acc[key] = value === null ? "" : value;
        return acc;
      }, {} as any);
      
      const templateWithUserId = {
        ...cleanedTemplate,
        userId: user.id
      };
      form.reset(templateWithUserId);
    }
  }, [template, user, form]);

  const updateTemplateMutation = useMutation({
    mutationFn: async (data: InsertTemplate) => {
      console.log("🚀 Starting template update mutation");
      console.log("📋 User ID:", user?.id);
      console.log("📋 Submitting template data:", JSON.stringify(data, null, 2));
      
      const response = await apiRequest("POST", "/api/template", data);
      console.log("📤 API Response status:", response.status);
      
      const result = await response.json();
      console.log("📥 API Response data:", JSON.stringify(result, null, 2));
      
      return result;
    },
    onSuccess: () => {
      console.log("Template updated successfully");
      // Invalidate both the authenticated and public template caches
      queryClient.invalidateQueries({ queryKey: ['/api/template'] });
      queryClient.invalidateQueries({ queryKey: ['/api/template', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/template/public'] });
      queryClient.invalidateQueries({ queryKey: ['/api/template/public', 'v2'] });
      toast({
        title: "Success",
        description: "Template saved successfully!",
      });
    },
    onError: (error: any) => {
      console.error("❌ Template update error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      toast({
        title: "Error",
        description: error.message || "Failed to save template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTemplate) => {
    console.log("🎯 Form submit triggered");
    console.log("👤 Current user:", user);
    console.log("📝 Form data received:", JSON.stringify(data, null, 2));
    
    // Remove timestamp fields and ensure userId is present
    const { createdAt, updatedAt, ...cleanData } = data as any;
    const templateData = {
      ...cleanData,
      userId: user?.id
    };
    
    console.log("Template data with userId:", templateData);
    updateTemplateMutation.mutate(templateData);
  };

  if (isLoading) {
    return <div className="pt-20 p-8">Loading template...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your personal real estate website template with your branding, content, and media.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Multi-User Platform:</strong> This is your personal template. All changes you make here will only affect your website. Other users have their own separate templates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Preview Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <strong>Company:</strong> {form.watch('companyName')}
                </div>
                <div className="text-sm">
                  <strong>Agent:</strong> {form.watch('agentName')}
                </div>
                <div className="text-sm">
                  <strong>Homes Sold:</strong> {form.watch('homesSold')}+
                </div>
                <div className="text-sm">
                  <strong>Sales Volume:</strong> {form.watch('totalSalesVolume')}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Domain Options:</div>
                  {form.watch('subdomain') && (
                    <Badge variant="secondary">
                      {form.watch('subdomain')}.realestatesite.com
                    </Badge>
                  )}
                  {form.watch('customDomain') && (
                    <Badge variant="default">
                      {form.watch('customDomain')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={(e) => {
                console.log("Form onSubmit event triggered!", e);
                console.log("Form errors:", form.formState.errors);
                console.log("Form isValid:", form.formState.isValid);
                form.handleSubmit(
                  (data) => {
                    console.log("Form validation PASSED - calling onSubmit with data:", data);
                    onSubmit(data);
                  },
                  (errors) => {
                    console.log("Form validation FAILED - errors:", errors);
                  }
                )(e);
              }}>
                <Tabs defaultValue="company" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="company" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Company
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="media" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Media
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Branding
                    </TabsTrigger>
                    <TabsTrigger value="domains" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Domains
                    </TabsTrigger>
                  </TabsList>

                  {/* Company Information */}
                  <TabsContent value="company">
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Real Estate Company" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agentName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Name" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="agentTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agent Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Principal Broker" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agentEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="agent@yourcompany.com" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Content */}
                  <TabsContent value="content">
                    <Card>
                      <CardHeader>
                        <CardTitle>Content & Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Hero Section */}
                        <div className="space-y-4 border-b pb-6">
                          <h3 className="text-lg font-semibold">Hero Section</h3>
                          <FormField
                            control={form.control}
                            name="heroTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hero Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Ready to Find Your Dream Home?" 
                                    {...field} 
                                    value={field.value ?? ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="heroSubtitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hero Subtitle</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    rows={3}
                                    placeholder="Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional." 
                                    {...field} 
                                    value={field.value ?? ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 border-b pb-6">
                          <h3 className="text-lg font-semibold">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="contactPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Phone</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="(402) 522-6131" 
                                      {...field} 
                                      value={field.value ?? ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="contactPhoneText"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Text</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Call or text anytime" 
                                      {...field} 
                                      value={field.value ?? ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="officeAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Office Address</FormLabel>
                                  <FormControl>
                                      <Input 
                                        placeholder="331 Village Pointe Plaza" 
                                        {...field} 
                                        value={field.value ?? ''}
                                      />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-3 gap-2">
                              <FormField
                                control={form.control}
                                name="officeCity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Omaha" 
                                        {...field} 
                                        value={field.value ?? ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="officeState"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="NE" 
                                        {...field} 
                                        value={field.value ?? ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="officeZip"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>ZIP</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="68130" 
                                        {...field} 
                                        value={field.value ?? ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="companyDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  rows={4}
                                  placeholder="We believe that luxury is not a price point but an experience..." 
                                  {...field} 
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="agentBio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent Biography</FormLabel>
                              <FormControl>
                                <Textarea 
                                  rows={6}
                                  placeholder="Professional real estate agent with years of experience..." 
                                  {...field} 
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="homesSold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Homes Sold</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="500"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="totalSalesVolume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sales Volume</FormLabel>
                                <FormControl>
                                  <Input placeholder="$200M+" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="yearsExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years Experience</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="15"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="clientSatisfaction"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Client Satisfaction</FormLabel>
                                <FormControl>
                                  <Input placeholder="98%" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Media Upload */}
                  {/* Media Upload */}
                  <TabsContent value="media">
                    <Card>
                      <CardHeader>
                        <CardTitle>Media Files</CardTitle>
                        <p className="text-sm text-gray-600">
                          Upload images to personalize your real estate website. All images are stored securely in the cloud.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Current Images Preview */}
                        {(() => {
                          const currentLogo = uploadedImages.logo || form.watch('logoUrl') || template?.logoUrl;
                          const currentHero = uploadedImages.hero || form.watch('heroImageUrl') || template?.heroImageUrl;
                          const currentHeroVideo = uploadedImages.heroVideo || form.watch('heroVideoUrl') || template?.heroVideoUrl;
                          const currentAgent = uploadedImages.agent || form.watch('agentImageUrl') || template?.agentImageUrl;
                          if (!currentLogo && !currentHero && !currentHeroVideo && !currentAgent) return null;
                          return (
                            <div>
                              <h4 className="text-sm font-medium mb-3">Current Images</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {currentLogo && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Logo</p>
                                    <img 
                                      src={currentLogo} 
                                      alt="Current Logo" 
                                      className="h-20 w-auto object-contain border rounded bg-white p-2" 
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (!img.src.includes('data:image')) {
                                          // Use a simple SVG placeholder instead of missing file
                                          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
                                        }
                                      }}
                                    />
                                    <p className="text-[10px] text-gray-500">{uploadedImages.logo ? 'New upload (unsaved)' : 'Loaded from template'}</p>
                                  </div>
                                )}
                                {currentHero && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hero Image</p>
                                    <img 
                                      src={currentHero} 
                                      alt="Current Hero" 
                                      className="h-20 w-auto object-cover border rounded" 
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (!img.src.includes('data:image')) {
                                          // Use a simple SVG placeholder instead of missing file
                                          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SGVybyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                        }
                                      }}
                                    />
                                    <p className="text-[10px] text-gray-500">{uploadedImages.hero ? 'New upload (unsaved)' : 'Loaded from template'}</p>
                                  </div>
                                )}
                                {currentHeroVideo && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hero Video</p>
                                    <video 
                                      src={currentHeroVideo} 
                                      className="h-20 w-auto object-cover border rounded"
                                      muted
                                      onError={(e) => {
                                        const video = e.currentTarget;
                                        if (!video.src.includes('data:')) {
                                          // Hide broken video
                                          video.style.display = 'none';
                                        }
                                      }}
                                    />
                                    <p className="text-[10px] text-gray-500">{uploadedImages.heroVideo ? 'New upload (unsaved)' : 'Loaded from template'}</p>
                                  </div>
                                )}
                                {currentAgent && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent Photo</p>
                                    <img 
                                      src={currentAgent} 
                                      alt="Current Agent" 
                                      className="h-20 w-20 object-cover border rounded-full" 
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (!img.src.includes('data:image')) {
                                          // Use a simple SVG placeholder instead of missing file
                                          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZ2VudDwvdGV4dD48L3N2Zz4=';
                                        }
                                      }}
                                    />
                                    <p className="text-[10px] text-gray-500">{uploadedImages.agent ? 'New upload (unsaved)' : 'Loaded from template'}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Uploaders */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Company Logo */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Company Logo</label>
                            <ImageUpload
                              folder="logos"
                              onUploadSuccess={(result) => {
                                setUploadedImages(prev => ({ ...prev, logo: result.url }));
                                form.setValue('logoUrl', result.url);
                              }}
                              onUploadError={(error) => console.error('Logo upload error:', error)}
                              maxSize={5}
                            />
                            {(uploadedImages.logo || form.watch('logoUrl') || template?.logoUrl) && (
                              <p className="text-xs text-green-600">✓ Logo {uploadedImages.logo ? 'uploaded' : 'loaded'}</p>
                            )}
                          </div>

                          {/* Hero Media (Image or Video) */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Hero Background</label>
                            <p className="text-xs text-gray-500">Upload an image or video for the hero background. Video will take priority if both are uploaded.</p>
                            
                            {/* Hero Image Upload */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-600">Hero Image</label>
                              <ImageUpload
                                folder="heroes"
                                onUploadSuccess={(result) => {
                                  setUploadedImages(prev => ({ ...prev, hero: result.url, heroVideo: '' }));
                                  form.setValue('heroImageUrl', result.url);
                                  // Clear video when image is uploaded
                                  form.setValue('heroVideoUrl', '');
                                  console.log('Hero image uploaded, cleared hero video');
                                }}
                                onUploadError={(error) => console.error('Hero image upload error:', error)}
                                maxSize={10}
                              />
                              {(uploadedImages.hero || form.watch('heroImageUrl') || template?.heroImageUrl) && (
                                <p className="text-xs text-green-600">✓ Hero image {uploadedImages.hero ? 'uploaded' : 'loaded'}</p>
                              )}
                            </div>

                            {/* Hero Video Upload */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-600">Hero Video (Takes Priority)</label>
                              <ImageUpload
                                folder="heroes"
                                onUploadSuccess={(result) => {
                                  setUploadedImages(prev => ({ ...prev, heroVideo: result.url, hero: '' }));
                                  form.setValue('heroVideoUrl', result.url);
                                  // Clear image when video is uploaded
                                  form.setValue('heroImageUrl', '');
                                  console.log('Hero video uploaded, cleared hero image');
                                }}
                                onUploadError={(error) => console.error('Hero video upload error:', error)}
                                maxSize={50}
                                accept="video/*"
                              />
                              {(uploadedImages.heroVideo || form.watch('heroVideoUrl') || template?.heroVideoUrl) && (
                                <p className="text-xs text-green-600">✓ Hero video {uploadedImages.heroVideo ? 'uploaded' : 'loaded'}</p>
                              )}
                            </div>
                          </div>

                          {/* Agent Photo */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Agent Photo</label>
                            <ImageUpload
                              folder="agents"
                              onUploadSuccess={(result) => {
                                setUploadedImages(prev => ({ ...prev, agent: result.url }));
                                form.setValue('agentImageUrl' as any, result.url);
                              }}
                              onUploadError={(error) => console.error('Agent photo upload error:', error)}
                              maxSize={5}
                            />
                            {(uploadedImages.agent || form.watch('agentImageUrl') || template?.agentImageUrl) && (
                              <p className="text-xs text-green-600">✓ Agent photo {uploadedImages.agent ? 'uploaded' : 'loaded'}</p>
                            )}
                          </div>
                        </div>

                        {/* Upload Guidelines */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
                          <ul className="text-sm space-y-1 list-disc pl-4 text-blue-800">
                            <li><strong>Logo:</strong> Square format (1:1), PNG with transparent background preferred</li>
                            <li><strong>Hero Image:</strong> Landscape 16:9, high resolution (1920x1080 recommended)</li>
                            <li><strong>Agent Photo:</strong> Professional headshot, square, clear background</li>
                          </ul>
                        </div>

                        {/* S3 Cleanup Section */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-medium text-orange-900 mb-2">🧹 Storage Cleanup</h4>
                          <p className="text-sm text-orange-800 mb-3">
                            Each folder should only contain one file. If you see multiple files or broken images, cleanup old files.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/upload/cleanup-all', {
                                    method: 'POST',
                                    credentials: 'include',
                                  });
                                  const result = await response.json();
                                  if (response.ok) {
                                    alert('✅ Cleanup completed! ' + result.message);
                                  } else {
                                    alert('❌ Cleanup failed: ' + result.message);
                                  }
                                } catch (error) {
                                  alert('❌ Cleanup error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                                }
                              }}
                              className="text-orange-700 border-orange-300 hover:bg-orange-100"
                            >
                              Clean All Folders
                            </Button>
                          </div>
                        </div>

                        {/* Debug Info - Remove in production */}
                        {template && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-medium text-yellow-900 mb-2">🔧 Debug Info (S3 URLs)</h4>
                            <div className="text-xs space-y-1 font-mono text-yellow-800">
                              <div><strong>Logo:</strong> {template.logoUrl || 'None'}</div>
                              <div><strong>Hero:</strong> {template.heroImageUrl || 'None'}</div>
                              <div><strong>Agent:</strong> {template.agentImageUrl || 'None'}</div>
                              <div className="mt-2 text-yellow-700">
                                If images are broken, check S3 CORS configuration or network access.
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Branding */}
                  <TabsContent value="branding">
                    <Card>
                      <CardHeader>
                        <CardTitle>Brand Colors</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <h4 className="text-sm font-medium mb-3">Choose a Color Scheme:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Professional Blue */}
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue("primaryColor", "#1e293b");
                                form.setValue("accentColor", "#3b82f6");
                                form.setValue("beigeColor", "#f1f5f9");
                              }}
                              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex space-x-1 mb-2">
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#1e293b"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#3b82f6"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#f1f5f9"}}></div>
                              </div>
                              <span className="text-xs font-medium">Professional Blue</span>
                            </button>

                            {/* Luxury Gold */}
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue("primaryColor", "#1c1917");
                                form.setValue("accentColor", "#d97706");
                                form.setValue("beigeColor", "#fef3c7");
                              }}
                              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex space-x-1 mb-2">
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#1c1917"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#d97706"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#fef3c7"}}></div>
                              </div>
                              <span className="text-xs font-medium">Luxury Gold</span>
                            </button>

                            {/* Modern Green */}
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue("primaryColor", "#0f172a");
                                form.setValue("accentColor", "#059669");
                                form.setValue("beigeColor", "#ecfdf5");
                              }}
                              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex space-x-1 mb-2">
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#0f172a"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#059669"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#ecfdf5"}}></div>
                              </div>
                              <span className="text-xs font-medium">Modern Green</span>
                            </button>

                            {/* Classic Red */}
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue("primaryColor", "#1e1b1b");
                                form.setValue("accentColor", "#dc2626");
                                form.setValue("beigeColor", "#fef2f2");
                              }}
                              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex space-x-1 mb-2">
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#1e1b1b"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#dc2626"}}></div>
                                <div className="w-6 h-6 rounded" style={{backgroundColor: "#fef2f2"}}></div>
                              </div>
                              <span className="text-xs font-medium">Classic Red</span>
                            </button>
                          </div>
                        {/* Custom Color Inputs */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">Or Customize Colors:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="primaryColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Primary Color (Dark Text)</FormLabel>
                                  <div className="flex space-x-2">
                                    <FormControl>
                                      <input 
                                        type="color" 
                                        value={field.value || "#1e293b"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="w-12 h-10 rounded border cursor-pointer"
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <Input 
                                        placeholder="#1e293b" 
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        className="flex-1"
                                      />
                                    </FormControl>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="accentColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Accent Color (Buttons/Links)</FormLabel>
                                  <div className="flex space-x-2">
                                    <FormControl>
                                      <input 
                                        type="color" 
                                        value={field.value || "#3b82f6"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="w-12 h-10 rounded border cursor-pointer"
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <Input 
                                        placeholder="#3b82f6" 
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        className="flex-1"
                                      />
                                    </FormControl>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="beigeColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Background Color (Light)</FormLabel>
                                  <div className="flex space-x-2">
                                    <FormControl>
                                      <input 
                                        type="color" 
                                        value={field.value || "#f1f5f9"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="w-12 h-10 rounded border cursor-pointer"
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <Input 
                                        placeholder="#f1f5f9" 
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        className="flex-1"
                                      />
                                    </FormControl>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Color Preview */}
                        <div className="mt-6 p-4 border rounded-lg">
                          <h4 className="text-sm font-medium mb-3">Preview:</h4>
                          <div 
                            className="p-4 rounded-lg"
                            style={{
                              backgroundColor: form.watch("beigeColor") || "#f1f5f9",
                              color: form.watch("primaryColor") || "#1e293b"
                            }}
                          >
                            <h3 className="font-bold text-lg mb-2">Your Real Estate Company</h3>
                            <p className="mb-3">This is how your brand colors will look on your website.</p>
                            <button 
                              type="button"
                              className="px-4 py-2 rounded text-white font-medium"
                              style={{backgroundColor: form.watch("accentColor") || "#3b82f6"}}
                            >
                              Contact Us Button
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Domains */}
                  <TabsContent value="domains">
                    <Card>
                      <CardHeader>
                        <CardTitle>Domain Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="subdomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subdomain</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input placeholder="youragent" {...field} value={field.value ?? ''} />
                                  <span className="ml-2 text-gray-500">.realestatesite.com</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="customDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Domain (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="www.youragency.com" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4 mt-8">
                  <Button 
                    type="submit" 
                    disabled={updateTemplateMutation.isPending || isUploading}
                    onClick={() => {
                      console.log("Save Template button clicked!");
                      console.log("Form state:", form.formState);
                      console.log("Form values:", form.getValues());
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateTemplateMutation.isPending ? "Saving..." : "Save Template"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}