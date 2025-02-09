import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';

// Definiamo le interfacce per i nostri tipi
interface Request {
  id: string;
  method: string;
  url: string;
  headers: any[];
  body?: string;
  timestamp: number;
}

interface Collection {
  id: string;
  name: string;
  requests: Request[];
}

interface CollectionsState {
  collections: Collection[];
}

const initialState: CollectionsState = {
  collections: [],
};

export const addRequestToCollection = createAction<{
  collectionId: string;
  request: Omit<Request, 'id'>;
}>('collections/addRequestToCollection');

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    addCollection: (state, action: PayloadAction<string>) => {
      state.collections.push({
        id: Date.now().toString(),
        name: action.payload,
        requests: [],
      });
    },
    addRequest: (state, action: PayloadAction<{ collectionId: string; request: Omit<Request, 'id'> }>) => {
      const { collectionId, request } = action.payload;
      const collection = state.collections.find(c => c.id === collectionId);
      if (collection) {
        collection.requests.push({
          id: Date.now().toString(),
          ...request,
        });
      }
    },
    updateRequest: (state, action: PayloadAction<{ 
      collectionId: string; 
      requestId: string; 
      updatedRequest: Partial<Request>;
    }>) => {
      const { collectionId, requestId, updatedRequest } = action.payload;
      const collection = state.collections.find(c => c.id === collectionId);
      if (collection) {
        const requestIndex = collection.requests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          collection.requests[requestIndex] = {
            ...collection.requests[requestIndex],
            ...updatedRequest,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addRequestToCollection, (state, action) => {
      const collection = state.collections.find(c => c.id === action.payload.collectionId);
      if (collection) {
        collection.requests.push({
          id: Date.now().toString(),
          ...action.payload.request
        });
      }
    });
  },
});

export const { addCollection, addRequest, updateRequest } = collectionsSlice.actions;
export default collectionsSlice.reducer;
