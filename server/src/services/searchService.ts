import TrieSearch from 'trie-search';
import { Address } from '../types/address'; // Assuming this type exists
import { AddressRepository } from '../repository/AddressRepository'; // Import the new repository

/**
 * Executes search queries against an injected, pre-indexed address data structure.
 * Responsibility is strictly querying.
 */
export class SearchService {
  private trie: TrieSearch<Address>;

  /**
   * Dependency Injection: The SearchService receives the fully initialized
   * AddressRepository (or the data structure itself) in the constructor.
   * @param repository The initialized data repository instance.
   */
  constructor(repository: AddressRepository) {
    // Get the ready-to-use Trie from the repository
    this.trie = repository.getTrie(); 
    console.log('Search Service initialized with repository data.');
  }

  /**
   * Searches the address trie.
   */
  public search(query: string): Address[] {
    // Get results from trie
    const results = this.trie.get(query);
    // Enforce the limit of 20 results
    return results.slice(0, 20);
  }
}