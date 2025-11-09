import { renderHook, act } from '@testing-library/react';
import { test, expect, describe, vi, beforeEach, type Mock } from 'vitest';
import { useDebouncedCallback } from '../useDebouceCallback'; // Adjust the import path as necessary

// Use fake timers to control the time flow for debouncing tests
vi.useFakeTimers();

describe('useDebouncedCallback', () => {
  const DELAY = 500;
  let callback: Mock;

  // Setup the callback function before each test
  beforeEach(() => {
    callback = vi.fn();
  });

  // Test 1: Basic debouncing - function should only fire after the delay
  test('should debounce the callback function', () => {
    // ARRANGE: Render the hook
    const { result } = renderHook(() => useDebouncedCallback(callback, DELAY));
    const debouncedCallback = result.current;

    // ACT 1: Call the function once
    act(() => {
      debouncedCallback('call 1');
    });
    
    // ASSERT 1: Function should not have been called immediately
    expect(callback).not.toHaveBeenCalled();

    // ACT 2: Advance time by less than the delay (DELAY - 1)
    vi.advanceTimersByTime(DELAY - 1);

    // ASSERT 2: Function should still not have been called
    expect(callback).not.toHaveBeenCalled();

    // ACT 3: Advance time to meet the delay
    vi.advanceTimersByTime(1);

    // ASSERT 3: Function should be called exactly once after the delay
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call 1');
  });

  // Test 2: Cancellation - multiple calls should only execute the last call
  test('should cancel previous calls and execute only the last one', () => {
    const { result } = renderHook(() => useDebouncedCallback(callback, DELAY));
    const debouncedCallback = result.current;

    // ACT: Call the debounced function multiple times in quick succession
    act(() => {
      debouncedCallback('call A');
      debouncedCallback('call B');
      debouncedCallback('call C');
    });

    // ASSERT 1: Still no calls yet
    expect(callback).not.toHaveBeenCalled();

    // ACT: Advance time past the delay
    vi.advanceTimersByTime(DELAY);

    // ASSERT 2: Only the last call should have been executed
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call C');
  });

  // Test 3: Ensure arguments are passed correctly to the last call
  test('should pass the arguments of the last call to the original callback', () => {
    const { result } = renderHook(() => useDebouncedCallback(callback, DELAY));
    const debouncedCallback = result.current;

    act(() => {
      debouncedCallback(1, 'old');
    });
    
    // Call it again with different arguments
    vi.advanceTimersByTime(DELAY / 2); // Advance time but not enough to fire
    
    act(() => {
      debouncedCallback(42, 'new', true);
    });

    // Advance time to fire the last call
    vi.advanceTimersByTime(DELAY);

    // Assert that the function was called once with the arguments from the last call
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(42, 'new', true);
  });
});