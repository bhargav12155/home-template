import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Code, 
  Eye, 
  EyeOff, 
  Plus, 
  Settings, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Save,
  Trash2,
  Edit,
  Shield,
  Database
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { insertTrackingCodeSchema, type TrackingCode, type InsertTrackingCode, type Lead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import IdxAdmin from "@/components/sections/idx-admin";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tracking");
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);

  // Authentication check (simple implementation)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<InsertTrackingCode>({
    resolver: zodResolver(insertTrackingCodeSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "pixel",
      active: true,
    },
  });

  // Simple password protection
  const handleLogin = () => {
    if (password === "admin123") { // In production, use proper authentication
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password.",
        variant: "destructive",
      });
    }
  };

  // Queries
  const { data: trackingCodes, isLoading: trackingLoading } = useQuery<TrackingCode[]>({
    queryKey: ["/api/tracking-codes"],
    enabled: isAuthenticated,
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: isAuthenticated,
  });

  // Mutations
  const createTrackingMutation = useMutation({
    mutationFn: async (data: InsertTrackingCode) => {
      return apiRequest("POST", "/api/tracking-codes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracking-codes"] });
      form.reset();
      toast({
        title: "Success",
        description: "Tracking code created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tracking code.",
        variant: "destructive",
      });
    },
  });

  const updateTrackingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTrackingCode> }) => {
      return apiRequest("PUT", `/api/tracking-codes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracking-codes"] });
      setEditingCode(null);
      toast({
        title: "Success",
        description: "Tracking code updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tracking code.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTrackingCode) => {
    if (editingCode) {
      updateTrackingMutation.mutate({ id: editingCode.id, data });
    } else {
      createTrackingMutation.mutate(data);
    }
  };

  const toggleCodeStatus = (code: TrackingCode) => {
    updateTrackingMutation.mutate({
      id: code.id,
      data: { active: !code.active }
    });
  };

  const startEditing = (code: TrackingCode) => {
    setEditingCode(code);
    form.reset({
      name: code.name,
      code: code.code,
      type: code.type as "pixel" | "script" | "meta",
      active: code.active,
    });
  };

  const cancelEditing = () => {
    setEditingCode(null);
    form.reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-bjork-beige rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-display text-bjork-black">
              Admin Access
            </CardTitle>
            <p className="text-gray-600">Enter password to access admin panel</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="border-gray-200 focus:ring-bjork-blue"
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300"
            >
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light leading-tight text-bjork-black mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage tracking codes, view leads, and monitor website performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracking" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Tracking Codes
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="idx" className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              IDX Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tracking Codes Tab */}
          <TabsContent value="tracking" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create/Edit Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      {editingCode ? 'Edit Tracking Code' : 'Add Tracking Code'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Google Analytics" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pixel">Pixel</SelectItem>
                                  <SelectItem value="script">Script</SelectItem>
                                  <SelectItem value="meta">Meta Tag</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Paste your tracking code here..."
                                  rows={8}
                                  {...field}
                                  className="font-mono text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Active</FormLabel>
                                <div className="text-sm text-gray-500">
                                  Enable this tracking code
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value || false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-bjork-black text-white hover:bg-bjork-blue"
                            disabled={createTrackingMutation.isPending || updateTrackingMutation.isPending}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingCode ? 'Update' : 'Create'}
                          </Button>
                          {editingCode && (
                            <Button type="button" variant="outline" onClick={cancelEditing}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Tracking Codes List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tracking Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {trackingLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border rounded-lg p-4 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : trackingCodes && trackingCodes.length > 0 ? (
                      <div className="space-y-4">
                        {trackingCodes.map((code) => (
                          <div key={code.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-3xl md:text-4xl font-display font-light leading-tight text-bjork-black">{code.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={code.active ? "default" : "secondary"}>
                                  {code.active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant="outline">{code.type}</Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleCodeStatus(code)}
                                >
                                  {code.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(code)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-600 overflow-x-auto">
                              <pre className="whitespace-pre-wrap break-all">
                                {code.code.length > 200 ? code.code.substring(0, 200) + '...' : code.code}
                              </pre>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Created {formatDistanceToNow(new Date(code.createdAt!), { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No tracking codes found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Form Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="border rounded-lg p-4 space-y-2">
                        <div className="flex gap-4">
                          <Skeleton className="h-5 w-1/4" />
                          <Skeleton className="h-5 w-1/4" />
                          <Skeleton className="h-5 w-1/4" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">
                              {lead.firstName} {lead.lastName}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">{lead.email}</div>
                                {lead.phone && (
                                  <div className="text-sm text-gray-500">{lead.phone}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.interest && (
                                <Badge variant="outline">
                                  {lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {lead.propertyAddress ? (
                                <div className="text-sm text-gray-600 max-w-32 truncate">
                                  {lead.propertyAddress}
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm max-w-48 truncate" title={lead.message || ""}>
                                {lead.message}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(lead.createdAt!), { addSuffix: true })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* IDX Management Tab */}
          <TabsContent value="idx">
            <IdxAdmin />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-3xl font-bold text-bjork-black">
                        {leads?.length || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-bjork-beige" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Tracking Codes</p>
                      <p className="text-3xl font-bold text-bjork-black">
                        {trackingCodes?.filter(c => c.active).length || 0}
                      </p>
                    </div>
                    <Code className="w-8 h-8 text-bjork-beige" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-3xl font-bold text-bjork-black">
                        {leads?.filter(lead => {
                          const leadDate = new Date(lead.createdAt!);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return leadDate > weekAgo;
                        }).length || 0}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-bjork-beige" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Status</p>
                      <p className="text-3xl font-bold text-green-600">Online</p>
                    </div>
                    <Settings className="w-8 h-8 text-bjork-beige" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads?.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-bjork-black">
                          New lead from {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Interested in {lead.interest || 'real estate services'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(lead.createdAt!), { addSuffix: true })}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
