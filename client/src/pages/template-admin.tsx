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

export default function TemplateAdmin() {
  const [isUploading, setIsUploading] = useState(false);

  // Query current template
  const { data: template, isLoading } = useQuery({
    queryKey: ['/api/template'],
    enabled: true
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
      return apiRequest("POST", "/api/template", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/template'] });
    },
  });

  const onSubmit = (data: InsertTemplate) => {
    updateTemplateMutation.mutate(data);
  };

  const handleFileUpload = async (file: File, category: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      const result = await apiRequest("POST", "/api/template/upload", formData) as { fileUrl: string };
      // Update form with new file URL
      if (category === 'logo') {
        form.setValue('logoUrl', result.fileUrl);
      } else if (category === 'hero') {
        form.setValue('heroImageUrl', result.fileUrl);
      } else if (category === 'agent') {
        form.setValue('agentImageUrl', result.fileUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div className="pt-20 p-8">Loading template...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Customization</h1>
          <p className="text-gray-600 mt-2">
            Customize your real estate website template with your branding, content, and media.
          </p>
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
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Company Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Upload Logo</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                                className="mt-2"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Upload Hero Image</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'hero')}
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Agent Photo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Upload Agent Photo</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'agent')}
                                className="mt-2"
                              />
                            </div>
                          </div>
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