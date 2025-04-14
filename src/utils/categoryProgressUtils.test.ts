import { describe, it, expect } from 'vitest';
import { getCategoryProgress } from './categoryProgressUtils';

describe('getCategoryProgress', () => {
  it('should return green color when available > 0 and spending <= budgeted', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 500,
      available: 500
    });
    
    expect(result.color).toBe('green');
    expect(result.fillPercent).toBe(50);
  });
  
  it('should return yellow color when budgeted < target', () => {
    const result = getCategoryProgress({
      budgeted: 500,
      spending: 200,
      available: 300,
      target: 1000
    });
    
    expect(result.color).toBe('yellow');
    expect(result.fillPercent).toBe(40);
  });
  
  it('should return yellow color when upcoming transaction > available', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 200,
      available: 800,
      upcomingTransaction: 900
    });
    
    expect(result.color).toBe('yellow');
    expect(result.fillPercent).toBe(20);
  });
  
  it('should return red color when spending > available', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 1200,
      available: 800
    });
    
    expect(result.color).toBe('red');
    expect(result.fillPercent).toBe(100);
  });
  
  it('should return red color when credit spending > budgeted', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 500,
      available: 500,
      creditSpending: 1200
    });
    
    expect(result.color).toBe('red');
    expect(result.fillPercent).toBe(50);
  });
  
  it('should return blue color and goal percentage when goal exists', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 500,
      available: 500,
      goal: 2000
    });
    
    expect(result.color).toBe('blue');
    expect(result.fillPercent).toBe(25);
  });
  
  it('should cap fill percentage at 100%', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: 2000,
      available: 0
    });
    
    expect(result.color).toBe('red');
    expect(result.fillPercent).toBe(100);
  });
  
  it('should handle zero budgeted amount', () => {
    const result = getCategoryProgress({
      budgeted: 0,
      spending: 0,
      available: 0
    });
    
    expect(result.color).toBe('green');
    expect(result.fillPercent).toBe(0);
  });
  
  it('should handle negative values', () => {
    const result = getCategoryProgress({
      budgeted: 1000,
      spending: -200,
      available: 1200
    });
    
    expect(result.color).toBe('green');
    expect(result.fillPercent).toBe(0);
  });
}); 