import PouchDB from 'pouchdb';

export const usePouchDB = () => {
  const nseDb = new PouchDB('nse_records');
  const gsDb = new PouchDB('gs_records');

  const destroyDatabases = async () => {
    try {
      await nseDb.destroy();
      await gsDb.destroy();
      console.log('Databases destroyed successfully');
    } catch (error) {
      console.error('Error destroying databases:', error);
    }
  };

  const storeNSERecords = async (records: any[]) => {
    try {
      for (const record of records) {
        const { __v, ...cleanRecord } = record;
        const docId = record._id || `record_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        await nseDb.put({
          _id: docId,
          ...cleanRecord
        });
      }
      console.log('NSE Records stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing NSE records:', error);
      return false;
    }
  };

  const getNSERecords = async () => {
    try {
      const result = await nseDb.allDocs({ include_docs: true });
      return result.rows.map((row:any) => row.doc);
    } catch (error) {
      console.error('Error fetching NSE records:', error);
      return [];
    }
  };

  const storeGSRecords = async (records: any[]) => {
    try {
      for (const record of records) {
        const docId = record._id || `gs_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await gsDb.put({
          _id: docId,
          ...record
        });
      }
      console.log('GS Records stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing GS records:', error);
      return false;
    }
  };

  const getGSRecords = async () => {
    try {
      const result = await gsDb.allDocs({ include_docs: true });
      return result.rows.map((row:any) => row.doc);
    } catch (error) {
      console.error('Error fetching GS records:', error);
      return [];
    }
  };

  const refreshDatabases = async () => {
    await destroyDatabases();
    // Recreate databases
    return {
      nseDb: new PouchDB('nse_records'),
      gsDb: new PouchDB('gs_records')
    };
  };

  return {
    nseDb,
    gsDb,
    destroyDatabases,
    storeNSERecords,
    getNSERecords,
    storeGSRecords,
    getGSRecords,
    refreshDatabases
  };
};