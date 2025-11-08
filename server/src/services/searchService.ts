import TrieSearch from 'trie-search';
import fs from 'fs';
import path from 'path';
import { Address } from '../types/address';

class SearchService {
  private trie: TrieSearch<Address>;
  private isReady: boolean = false;

  constructor() {
    // Configure TrieSearch to index relevant fields [cite: 9]
    this.trie = new TrieSearch<Address>(['street', 'city', 'postNumber'], {
      min: 3,
      ignoreCase: true,
    });
    this.loadData();
  }

  //Data injestioon [cite: 4]
  private loadData() {
    try {
      const dataPath = path.join(__dirname, '../../data/adresses.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const addresses: Address[] = JSON.parse(rawData);

      this.trie.addAll(addresses);
      this.isReady = true;
      console.log(`Dataset loaded. Indexed ${addresses.length} addresses.`);
    } catch (error) {
      console.error('Failed to load address dataset:', error);
      process.exit(1); // Fatal error if data cannot load
    }
  }

  /**
   * Searches the address trie [cite: 8].
   * If the service is not ready (data failed to load),
   * it logs a warning and returns an empty array.
   */
  public search(query: string): Address[] {
    if (!this.isReady) {
      // This is the graceful failure the test expects,
      // instead of throwing an error.
      console.warn('Search service queried before data was loaded.');
      return [];
    }
    // Get results from trie
    const results = this.trie.get(query);
    // Enforce the limit of 20 results [cite: 10 -> 12, 13]
    return results.slice(0, 20);
  }
}

// Export as singleton to load data only once
export const searchService = new SearchService();