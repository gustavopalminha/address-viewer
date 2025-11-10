import TrieSearch from 'trie-search';
import { SearchService } from './searchService';
import { AddressRepository } from '../repository/AddressRepository';
import { Address } from '../types/address'; // Assuming this type exists

// --- 1. MOCK DATA SETUP ---

// Mock data set for testing
const mockAddresses: Address[] = [
  { street: 'Test Street 1', city: 'OSLO', postNumber: '1' } as Address,
  { street: 'Test Avenue 2', city: 'BERGEN', postNumber: '2' } as Address,
  { street: 'Test Avenue 3', city: 'OZINK', postNumber: '3' } as Address,
  { street: 'Test Avenue 4', city: 'OSLET', postNumber: '4' } as Address,
];

// Create a helper function to populate a TrieSearch instance with mock data
const createMockTrie = (): TrieSearch<Address> => {
  const trie = new TrieSearch<Address>(['street', 'city', 'postNumber'], {
    min: 3,
    ignoreCase: true,
  });
  trie.addAll(mockAddresses);
  return trie;
};

// --- 2. MOCK THE DEPENDENCY (AddressRepository) ---

// This creates a mock class that pretends to be the AddressRepository.
// Crucially, it returns the mock, pre-loaded Trie, avoiding any file I/O.
const mockRepository: AddressRepository = {
  loadData: jest.fn(async () => {}), // Not used by the Service, but required by the interface
  getTrie: jest.fn(createMockTrie),
} as unknown as AddressRepository; // Use type assertion to satisfy TypeScript

// --- 3. TEST SUITE ---

describe('SearchService', () => {
  let searchService: SearchService;

  // Before each test, instantiate the SearchService with the mock repository
  beforeAll(() => {
    // Dependency Injection in action: We inject the mock, not the real implementation
    searchService = new SearchService(mockRepository);
  });

  it('should be instantiated correctly by receiving the mock repository', () => {
    expect(searchService).toBeInstanceOf(SearchService);
    expect(mockRepository.getTrie).toHaveBeenCalled();
  });

  it('should find addresses matching a full street name query (case insensitive)', () => {
    const results = searchService.search('test street 1');
    expect(results).toHaveLength(1);
    expect(results[0].street).toBe('Test Street 1');
  });

  it('should find multiple addresses matching a partial query (street)', () => {
    const results = searchService.search('test avenue');
    expect(results).toHaveLength(3);
    expect(results.some(r => r.street === 'Test Avenue 2')).toBe(true);
  });
  
  it('should find multiple addresses matching a partial query (city)', () => {
    const results = searchService.search('osl');
    expect(results).toHaveLength(2);
    expect(results.some(r => r.city === 'OSLO')).toBe(true);
  });

  it('should return an empty array for a non-matching query', () => {
    const results = searchService.search('NonExistentAddress');
    expect(results).toHaveLength(0);
  });

  it('should enforce the maximum limit of 20 results', () => {
    // To test this accurately, we need a trie with more than 20 results.
    // For simplicity, we mock a trie that returns a huge array and check the slice logic.
    const largeMockTrie: TrieSearch<Address> = {
        get: jest.fn(() => Array(50).fill({ street: 'A', city: 'B', postNumber: 'C'})),
    } as unknown as TrieSearch<Address>;
    
    // Create a new SearchService instance with a temporary mock repository
    const mockRepoForLimitTest: AddressRepository = {
        loadData: jest.fn(async () => {}),
        getTrie: jest.fn(() => largeMockTrie),
    } as unknown as AddressRepository;

    const limitService = new SearchService(mockRepoForLimitTest);
    
    const results = limitService.search('A'); // Query returns 50 results
    expect(results).toHaveLength(20); // But the service must cap it at 20
    expect(largeMockTrie.get).toHaveBeenCalledWith('A');
  });
  
  it('should handle queries shorter than the minimum (3 chars) as per TrieSearch config', () => {
    // The trie is configured with { min: 3 }. Queries like 'S' should return nothing.
    const results = searchService.search('S');
    expect(results).toHaveLength(0);
    
    // Query 'Osl' should work
    const results2 = searchService.search('Osl');
    expect(results2.length).toBeGreaterThan(0);
  });
});