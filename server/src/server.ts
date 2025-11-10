import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config';

import { AddressRepository } from './repository/AddressRepository';
import { SearchService } from './services/searchService';

let searchServiceInstance: SearchService;

// Server initialization
export async function startServer() {
  try {
    console.log('--- Server Startup ---');

    // 1. Initialize and Load the Repository (Data Responsibility)
    const repository = new AddressRepository();
    console.log('Loading address data...');
    await repository.loadData();
    
    // 2. Instantiate and Inject the Service (Query Responsibility)
    searchServiceInstance = new SearchService(repository);
    
    console.log('Search service ready. Starting Express server...');
    // 3. Start the application after the service is ready
    app().listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to initialization error:', error);
    // Note: The repository loadData() method itself already calls process.exit(1) on failure,
    process.exit(1); 
  }
}

export function getSearchService(): SearchService {
    if (!searchServiceInstance) {
        throw new Error("SearchService not yet initialized. The server failed to start.");
    }
    return searchServiceInstance;
}

startServer();