import { useState } from "react";
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
import ImageUpload from "@/components/ui/image-upload";

export default function TemplateAdmin() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{
    logo?: string;
    hero?: string;
    agent?: string;
  }>({});
  const { user } = useAuth();

  // Query current user's template (now requires authentication)
  const { data: template, isLoading } = useQuery({
    queryKey: ['/api/template'],
    enabled: !!user // Only fetch when user is authenticated
  });

  const form = useForm<InsertTemplate>({
    resolver: zodResolver(templateSchema),
    defaultValues: template || {
      companyName: "Your Real Estate Company",
      agentName: "Your Name",
      agentTitle: "Principal Broker",
      agentEmail: "",
      phone: "",
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
      subdomain: "",
      customDomain: "",
      isActive: true
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async (data: InsertTemplate) => {
      const response = await apiRequest("POST", "/api/template", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/template'] });
    },
  });

  const onSubmit = (data: InsertTemplate) => {
    updateTemplateMutation.mutate(data);
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
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                  <Input placeholder="Your Real Estate Company" {...field} />
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
                                  <Input placeholder="Your Name" {...field} />
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
                                  <Input placeholder="Principal Broker" {...field} />
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
                                  <Input type="email" placeholder="agent@yourcompany.com" {...field} />
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
                                <Input placeholder="(555) 123-4567" {...field} />
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
                                    onChange={e => field.onChange(parseInt(e.target.value))}
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
                                  <Input placeholder="$200M+" {...field} />
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
                                    onChange={e => field.onChange(parseInt(e.target.value))}
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
                                  <Input placeholder="98%" {...field} />
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
                  <TabsContent value="media">
                    <Card>
                      <CardHeader>
                        <CardTitle>Media Files</CardTitle>
                        <p className="text-sm text-gray-600">
                          Upload images to personalize your real estate website. All images are stored securely in the cloud.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Company Logo */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Company Logo</label>
                            <ImageUpload
                              folder="logos"
                              onUploadSuccess={(result) => {
                                setUploadedImages(prev => ({ ...prev, logo: result.url }));
                                // Update the form field if it exists
                                if (form.setValue) {
                                  form.setValue('logoUrl', result.url);
                                }
                              }}
                              onUploadError={(error) => {
                                console.error('Logo upload error:', error);
                                // You can add toast notification here
                              }}
                              maxSize={5}
                            />
                            {uploadedImages.logo && (
                              <div className="mt-2">
                                <img 
                                  src={uploadedImages.logo} 
                                  alt="Company Logo" 
                                  className="h-16 w-auto object-contain border rounded"
                                />
                                <p className="text-xs text-green-600 mt-1">✓ Logo uploaded successfully</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Hero Image */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Hero Image</label>
                            <ImageUpload
                              folder="heroes"
                              onUploadSuccess={(result) => {
                                setUploadedImages(prev => ({ ...prev, hero: result.url }));
                                if (form.setValue) {
                                  form.setValue('heroImageUrl', result.url);
                                }
                              }}
                              onUploadError={(error) => {
                                console.error('Hero image upload error:', error);
                              }}
                              maxSize={10}
                            />
                            {uploadedImages.hero && (
                              <div className="mt-2">
                                <img 
                                  src={uploadedImages.hero} 
                                  alt="Hero Image" 
                                  className="h-16 w-auto object-cover border rounded"
                                />
                                <p className="text-xs text-green-600 mt-1">✓ Hero image uploaded successfully</p>
                              </div>
                            )}
                          </div>

                          {/* Agent Photo */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Agent Photo</label>
                            <ImageUpload
                              folder="agents"
                              onUploadSuccess={(result) => {
                                setUploadedImages(prev => ({ ...prev, agent: result.url }));
                                if (form.setValue) {
                                  form.setValue('agentPhotoUrl', result.url);
                                }
                              }}
                              onUploadError={(error) => {
                                console.error('Agent photo upload error:', error);
                              }}
                              maxSize={5}
                            />
                            {uploadedImages.agent && (
                              <div className="mt-2">
                                <img 
                                  src={uploadedImages.agent} 
                                  alt="Agent Photo" 
                                  className="h-16 w-16 object-cover border rounded-full"
                                />
                                <p className="text-xs text-green-600 mt-1">✓ Agent photo uploaded successfully</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Upload Guidelines */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>Logo:</strong> Square format (1:1 ratio), PNG with transparent background preferred</li>
                            <li>• <strong>Hero Image:</strong> Landscape format (16:9 ratio), high resolution (1920x1080 recommended)</li>
                            <li>• <strong>Agent Photo:</strong> Professional headshot, square format, clear background</li>
                          </ul>
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <FormControl>
                                  <Input placeholder="hsl(20, 14.3%, 4.1%)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Accent Color</FormLabel>
                                <FormControl>
                                  <Input placeholder="hsl(213, 100%, 45%)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="beigeColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <FormControl>
                                  <Input placeholder="hsl(25, 35%, 75%)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                                  <Input placeholder="youragent" {...field} />
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
                                <Input placeholder="www.youragency.com" {...field} />
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
                  <Button type="submit" disabled={updateTemplateMutation.isPending || isUploading}>
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