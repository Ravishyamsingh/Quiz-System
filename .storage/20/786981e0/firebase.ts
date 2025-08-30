// Mock Firebase implementation for MVP
// In production, replace with actual Firebase SDK

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface DocumentData {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

// Mock Firestore implementation using localStorage
class MockFirestore {
  private getCollection(collectionName: string): DocumentData[] {
    const data = localStorage.getItem(`firestore_${collectionName}`);
    return data ? JSON.parse(data) : [];
  }

  private setCollection(collectionName: string, data: DocumentData[]): void {
    localStorage.setItem(`firestore_${collectionName}`, JSON.stringify(data));
  }

  async collection(name: string) {
    return {
      add: async (data: Record<string, unknown>) => {
        const collection = this.getCollection(name);
        const newDoc: DocumentData = {
          id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          createdAt: new Date(),
        };
        collection.push(newDoc);
        this.setCollection(name, collection);
        return { id: newDoc.id };
      },
      doc: (id: string) => ({
        get: async () => {
          const collection = this.getCollection(name);
          const doc = collection.find(item => item.id === id);
          return {
            exists: !!doc,
            data: () => doc,
          };
        },
        set: async (data: Record<string, unknown>) => {
          const collection = this.getCollection(name);
          const index = collection.findIndex(item => item.id === id);
          const docData: DocumentData = {
            id,
            ...data,
            updatedAt: new Date(),
          };
          
          if (index >= 0) {
            collection[index] = { ...collection[index], ...docData };
          } else {
            collection.push(docData);
          }
          this.setCollection(name, collection);
        },
      }),
      where: (field: string, operator: string, value: unknown) => ({
        get: async () => {
          const collection = this.getCollection(name);
          let filtered = collection;
          
          if (operator === '==') {
            filtered = collection.filter(item => item[field] === value);
          }
          
          return {
            docs: filtered.map(doc => ({
              id: doc.id,
              data: () => doc,
            })),
          };
        },
      }),
      get: async () => {
        const collection = this.getCollection(name);
        return {
          docs: collection.map(doc => ({
            id: doc.id,
            data: () => doc,
          })),
        };
      },
    };
  }
}

// Mock Firebase Auth
class MockAuth {
  private currentUser = {
    uid: 'mock_user_123',
    email: 'user@example.com',
    displayName: 'Mock User',
  };

  get user() {
    return this.currentUser;
  }

  async signInAnonymously() {
    return { user: this.currentUser };
  }
}

// Export mock Firebase services
export const db = new MockFirestore();
export const auth = new MockAuth();

// Initialize Firebase (mock)
export const initializeFirebase = (config?: FirebaseConfig) => {
  console.log('Mock Firebase initialized');
  return {
    db,
    auth,
  };
};