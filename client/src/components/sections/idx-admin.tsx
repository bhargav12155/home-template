import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, Database, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface IdxStatus {
  lastSync: {
    id: number;
    syncType: string;
    status: 'success' | 'error' | 'in_progress';
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    startedAt: string;
    completedAt?: string;
    errorMessage?: string;
  } | null;
  recentSyncs: Array<{
    id: number;
    syncType: string;
    status: 'success' | 'error' | 'in_progress';
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    startedAt: string;
    completedAt?: string;
    errorMessage?: string;
  }>;
  connectionStatus: {
    isConnected: boolean;
    config: {
      baseUrl?: string;
      hasAccessToken: boolean;
      hasClientCredentials: boolean;
    };
  };
}

interface IdxAgent {
  id: number;
  memberKey: string;
  memberMlsId: string;
  fullName: string;
  email?: string;
  phone?: string;
  office?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function IdxAdmin() {
  const queryClient = useQueryClient();
  const [selectedSyncType, setSelectedSyncType] = useState<'properties' | 'agents' | 'full'>('properties');

  // Fetch IDX status
  const { data: idxStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery<IdxStatus>({
    queryKey: ['/api/idx/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch IDX agents
  const { data: idxAgents, isLoading: agentsLoading } = useQuery<IdxAgent[]>({
    queryKey: ['/api/idx/agents'],
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (syncType: 'properties' | 'agents' | 'full') => {
      const response = await fetch('/api/idx/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: syncType })
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/idx/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/idx/agents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
    },
  });

  const handleSync = (syncType: 'properties' | 'agents' | 'full') => {
    syncMutation.mutate(syncType);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading IDX status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">IDX Integration</h2>
          <p className="text-gray-600">Manage MLS data synchronization</p>
        </div>
        <Button 
          onClick={() => refetchStatus()} 
          variant="outline" 
          size="sm"
          disabled={statusLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${statusLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                idxStatus?.connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium">
                {idxStatus?.connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {idxStatus?.connectionStatus.config.baseUrl && (
              <Badge variant="outline">
                {idxStatus.connectionStatus.config.baseUrl}
              </Badge>
            )}
          </div>

          {!idxStatus?.connectionStatus.isConnected && (
            <Alert className="mt-4">
              <AlertDescription>
                IDX is not connected to the MLS. Using mock data for development. 
                To connect to real MLS data, configure your Great Plains Regional MLS credentials.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Synchronization</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="sync" className="space-y-4">
          {/* Last Sync Status */}
          {idxStatus?.lastSync && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Last Sync</span>
                  {getStatusIcon(idxStatus.lastSync.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium capitalize">{idxStatus.lastSync.syncType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(idxStatus.lastSync.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Records Processed</p>
                    <p className="font-medium">{idxStatus.lastSync.recordsProcessed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="font-medium">
                      {idxStatus.lastSync.completedAt 
                        ? formatDate(idxStatus.lastSync.completedAt)
                        : 'In Progress'
                      }
                    </p>
                  </div>
                </div>

                {idxStatus.lastSync.errorMessage && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{idxStatus.lastSync.errorMessage}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sync Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Start New Sync</CardTitle>
              <CardDescription>
                Synchronize property and agent data from the MLS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleSync('properties')}
                    disabled={syncMutation.isPending}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    {syncMutation.isPending && selectedSyncType === 'properties' ? (
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    ) : (
                      <Database className="h-6 w-6 mb-2" />
                    )}
                    <span>Sync Properties</span>
                  </Button>

                  <Button
                    onClick={() => handleSync('agents')}
                    disabled={syncMutation.isPending}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    {syncMutation.isPending && selectedSyncType === 'agents' ? (
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    ) : (
                      <Users className="h-6 w-6 mb-2" />
                    )}
                    <span>Sync Agents</span>
                  </Button>

                  <Button
                    onClick={() => handleSync('full')}
                    disabled={syncMutation.isPending}
                    variant="default"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    {syncMutation.isPending && selectedSyncType === 'full' ? (
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    ) : (
                      <RefreshCw className="h-6 w-6 mb-2" />
                    )}
                    <span>Full Sync</span>
                  </Button>
                </div>

                {syncMutation.isPending && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Synchronization in progress... This may take several minutes.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                IDX Agents ({idxAgents?.length || 0})
              </CardTitle>
              <CardDescription>
                Real estate agents synchronized from the MLS
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agentsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading agents...</span>
                </div>
              ) : idxAgents && idxAgents.length > 0 ? (
                <div className="space-y-2">
                  {idxAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{agent.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {agent.memberMlsId} | {agent.email || 'No email'}
                        </p>
                        {agent.office && (
                          <p className="text-sm text-gray-500">{agent.office}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={agent.isActive ? "default" : "secondary"}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No agents synchronized yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Run an agent sync to populate this list
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization History</CardTitle>
              <CardDescription>
                Recent sync operations and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {idxStatus?.recentSyncs && idxStatus.recentSyncs.length > 0 ? (
                <div className="space-y-3">
                  {idxStatus.recentSyncs.map((sync) => (
                    <div key={sync.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sync.status)}
                        <div>
                          <p className="font-medium capitalize">{sync.syncType} Sync</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(sync.startedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(sync.status)}
                        <p className="text-sm text-gray-600 mt-1">
                          {sync.recordsProcessed} processed, {sync.recordsCreated} created, {sync.recordsUpdated} updated
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No sync history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}