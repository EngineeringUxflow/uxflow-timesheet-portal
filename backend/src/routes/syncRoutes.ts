import { Router } from 'express';
import { DataSyncService } from '../services/dataSyncService';

const router = Router();

// Sync localStorage data to database
router.post('/sync-timesheets', async (req, res) => {
  try {
    const { localData } = req.body;
    
    if (!Array.isArray(localData)) {
      return res.status(400).json({
        success: false,
        error: 'localData must be an array'
      });
    }

    const result = await DataSyncService.syncTimesheetsToDatabase(localData);
    
    res.json({
      ...result,
      message: result.success ? 
        `Successfully synced ${result.synced} records` : 
        'Sync completed with errors'
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all timesheets from database
router.get('/timesheets-from-db', async (req, res) => {
  try {
    const result = await DataSyncService.getAllTimesheetsFromDatabase();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Clean up duplicate records
router.post('/cleanup-duplicates', async (req, res) => {
  try {
    const result = await DataSyncService.cleanupDuplicates();
    
    res.json({
      ...result,
      message: result.success ? 
        `Cleaned up ${result.synced} duplicate records` : 
        'Cleanup completed with errors'
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Validate data integrity
router.get('/validate-data', async (req, res) => {
  try {
    const result = await DataSyncService.validateDataIntegrity();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      valid: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;