import { idxService } from "./idx-service";
import type { IStorage } from "./storage";
import type { 
  InsertProperty, 
  InsertIdxAgent, 
  InsertIdxMedia, 
  InsertIdxSyncLog,
  ResoProperty,
  ResoAgent,
  ResoMedia
} from "@shared/schema";

export class IdxSyncService {
  constructor(private storage: IStorage) {}

  private async logSyncStart(syncType: string): Promise<number> {
    const log = await this.storage.createIdxSyncLog({
      syncType,
      status: 'in_progress',
      recordsProcessed: 0,
      recordsUpdated: 0,
      recordsCreated: 0,
      startedAt: new Date()
    });
    return log.id;
  }

  private async logSyncComplete(
    logId: number, 
    status: 'success' | 'error', 
    stats: { processed: number; updated: number; created: number },
    errorMessage?: string
  ): Promise<void> {
    await this.storage.updateIdxSyncLog(logId, {
      status,
      recordsProcessed: stats.processed,
      recordsUpdated: stats.updated,
      recordsCreated: stats.created,
      errorMessage,
      completedAt: new Date()
    });
  }

  async syncProperties(limit: number = 100): Promise<{ success: boolean; stats: any; error?: string }> {
    const logId = await this.logSyncStart('properties');
    let processed = 0;
    let created = 0;
    let updated = 0;

    try {
      console.log('Starting IDX property synchronization...');
      
      // Search for active properties
      const resoProperties = await idxService.searchProperties({
        status: ['Active', 'Pending'],
        limit
      });

      console.log(`Found ${resoProperties.length} properties from RESO API`);

      for (const resoProperty of resoProperties) {
        try {
          processed++;
          
          // Check if property already exists
          const existingProperty = await this.storage.getPropertyByMLS(resoProperty.ListingId);
          
          // Convert RESO format to internal format
          const propertyData = idxService.convertResoPropertyToInternal(resoProperty);
          
          if (existingProperty) {
            // Update existing property
            await this.storage.updateProperty(existingProperty.id, propertyData);
            updated++;
            console.log(`Updated property: ${resoProperty.ListingId}`);
          } else {
            // Create new property
            await this.storage.createProperty(propertyData);
            created++;
            console.log(`Created property: ${resoProperty.ListingId}`);
          }

          // Sync media for this property
          await this.syncMediaForProperty(resoProperty.ListingKey, resoProperty.ListingId);

        } catch (error) {
          console.error(`Error syncing property ${resoProperty.ListingId}:`, error);
        }
      }

      const stats = { processed, updated, created };
      await this.logSyncComplete(logId, 'success', stats);

      console.log(`Property sync completed: ${processed} processed, ${created} created, ${updated} updated`);

      return {
        success: true,
        stats
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logSyncComplete(logId, 'error', { processed, updated, created }, errorMessage);
      
      console.error('Property sync failed:', error);
      
      return {
        success: false,
        stats: { processed, updated, created },
        error: errorMessage
      };
    }
  }

  // Agent sync removed per user request - IDX will not pull agent information from MLS

  private async syncMediaForProperty(listingKey: string, mlsId: string): Promise<void> {
    try {
      const resoMedia = await idxService.getMediaForProperty(listingKey);
      
      for (const media of resoMedia) {
        try {
          // Check if media already exists
          const existingMedia = await this.storage.getIdxMediaByKey(media.MediaKey);
          
          const mediaData = {
            ...idxService.convertResoMediaToInternal(media),
            mlsId
          };

          if (existingMedia) {
            await this.storage.updateIdxMedia(existingMedia.id, mediaData);
          } else {
            await this.storage.createIdxMedia(mediaData);
          }

        } catch (error) {
          console.error(`Error syncing media ${media.MediaKey}:`, error);
        }
      }

      // Update property with media URLs
      const property = await this.storage.getPropertyByMLS(mlsId);
      if (property && resoMedia.length > 0) {
        const imageUrls = resoMedia
          .filter(m => m.MediaType === 'Photo')
          .sort((a, b) => (a.Order || 0) - (b.Order || 0))
          .map(m => m.MediaURL);

        if (imageUrls.length > 0) {
          await this.storage.updateProperty(property.id, { images: imageUrls });
        }
      }

    } catch (error) {
      console.error(`Error syncing media for property ${listingKey}:`, error);
    }
  }

  async fullSync(): Promise<{ success: boolean; results: any[]; error?: string }> {
    console.log('Starting full IDX synchronization...');
    
    const results = [];

    try {
      // Test connection first
      const isConnected = await idxService.testConnection();
      
      if (!isConnected) {
        console.log('IDX API not connected, using mock data for development');
      }

      // Sync properties (agent sync removed per user request)
      const propertyResult = await this.syncProperties(50);
      results.push({ type: 'properties', ...propertyResult });

      const allSuccess = results.every(r => r.success);

      console.log('Full IDX sync completed:', {
        success: allSuccess,
        results: results.map(r => ({ type: r.type, success: r.success, stats: r.stats }))
      });

      return {
        success: allSuccess,
        results
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full sync failed:', error);
      
      return {
        success: false,
        results,
        error: errorMessage
      };
    }
  }

  async getLastSyncStatus(): Promise<any> {
    const logs = await this.storage.getIdxSyncLogs(10);
    
    const summary = {
      lastSync: logs[0] || null,
      recentSyncs: logs,
      connectionStatus: idxService.getConnectionStatus()
    };

    return summary;
  }

  // Schedule automatic syncs (call this from cron job or similar)
  async scheduleSync(): Promise<void> {
    console.log('Scheduled IDX sync starting...');
    
    try {
      await this.fullSync();
    } catch (error) {
      console.error('Scheduled sync failed:', error);
    }
  }
}

export default IdxSyncService;