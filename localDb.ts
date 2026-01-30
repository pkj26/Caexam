// Utility to handle large file storage in browser's IndexedDB
// This avoids the 5MB localStorage limit and prevents browser crashes

const DB_NAME = 'CAExamContentDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveToLocalDB = async (file: File): Promise<string> => {
  const db = await initDB();
  const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.add({
      id,
      name: file.name,
      type: file.type,
      data: file, // Storing the Blob/File object directly
      createdAt: new Date().toISOString()
    });

    request.onsuccess = () => resolve(`local-db:${id}`);
    request.onerror = () => reject(request.error);
  });
};

export const getFromLocalDB = async (fileId: string): Promise<File | Blob | null> => {
  const id = fileId.replace('local-db:', '');
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.data : null);
    };
    request.onerror = () => reject(request.error);
  });
};