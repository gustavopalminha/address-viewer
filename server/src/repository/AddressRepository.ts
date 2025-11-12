import fs from 'fs/promises';
import path from 'path';
import TrieSearch from 'trie-search';
import { Address } from '../types/address'; // Assuming this type exists

/**
 * Handles the loading of address data from the file system and preparation
 * of the indexed search structure (Trie).
 */
export class AddressRepository {
  private trie: TrieSearch<Address> | null = null;

  /**
   * Loads the addresses dataset asynchronously and builds the TrieSearch index.
   * This method must be awaited during application startup.
   */
  //CR: This method could accept an input like (data: Address[]) and remove the line 20 to 22
  //   so that it accepts gets easier to test removing the data loading part from here
  //   and by removing that it could be converted in to a constructor because its doing that
    
  public async loadData(): Promise<void> {
    try {
      const dataPath = path.join(__dirname, '../../data/adresses.json');
      const rawData = await fs.readFile(dataPath, 'utf-8');
      const addresses: Address[] = JSON.parse(rawData);

      const newTrie = new TrieSearch<Address>(['street', 'city', 'postNumber'], {
        min: 3,
        ignoreCase: true,
      });

      newTrie.addAll(addresses);
      this.trie = newTrie;

      console.log(`Dataset loaded by Repository. Indexed ${addresses.length} addresses.`);
    } catch (error) {
      console.error('Fatal: Failed to load address dataset:', error);
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