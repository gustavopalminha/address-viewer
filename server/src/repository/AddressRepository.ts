import fs from 'fs/promises';
import path from 'path';
import TrieSearch from 'trie-search';
import { Address } from '../types/address'; // Assuming this type exists

/**
 * Handles the loading of address data from the file system and preparation
 * of the indexed search structure (Trie).
 */
export class AddressRepository {
  // Use a nullable type since the trie is not initialized until loadData() is called
  private trie: TrieSearch<Address> | null = null;

  /**
   * Loads the addresses dataset asynchronously and builds the TrieSearch index.
   * This method must be awaited during application startup.
   */
  public async loadData(): Promise<void> {
    try {
      const dataPath = path.join(__dirname, '../../data/adresses.json');
      // Use fs.promises for non-blocking I/O
      const rawData = await fs.readFile(dataPath, 'utf-8');
      const addresses: Address[] = JSON.parse(rawData);

      // Configure and populate the trie
      const newTrie = new TrieSearch<Address>(['street', 'city', 'postNumber'], {
        min: 3,
        ignoreCase: true,
      });

      newTrie.addAll(addresses);
      this.trie = newTrie;

      console.log(`Dataset loaded by Repository. Indexed ${addresses.length} addresses.`);
    } catch (error) {
      console.error('Fatal: Failed to load address dataset:', error);
      // Repository throws, Server will catch and exit
      throw new Error('Failed to initialize Address Repository'); 
    }
  }

  /**
   * Getter for the initialized trie. This is the mechanism for providing 
   * data to the SearchService (Dependency Injection).
   */
  public getTrie(): TrieSearch<Address> {
    if (!this.trie) {
      throw new Error('Trie has not been initialized. Call loadData() first.');
    }
    return this.trie;
  }
}