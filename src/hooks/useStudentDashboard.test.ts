import { describe, it, expect } from 'vitest';
import { calculateApplicationStatus } from './useStudentDashboard';

describe('calculateApplicationStatus', () => {
  it('should return "draft" when not submitting and no current status', () => {
    expect(calculateApplicationStatus(undefined, false, false, false)).toBe('draft');
  });

  it('should return current status when not submitting', () => {
    expect(calculateApplicationStatus('draft', false, false, false)).toBe('draft');
    expect(calculateApplicationStatus('payment_pending', false, false, false)).toBe('payment_pending');
    expect(calculateApplicationStatus('submitted', false, true, false)).toBe('submitted');
  });

  it('should return "payment_pending" when submitting and fee not paid', () => {
    expect(calculateApplicationStatus('draft', true, false, false)).toBe('payment_pending');
  });

  it('should return "submitted" when submitting and fee already paid', () => {
    expect(calculateApplicationStatus('draft', true, true, false)).toBe('submitted');
    expect(calculateApplicationStatus('payment_pending', true, true, false)).toBe('submitted');
  });

  it('should return "submitted" when submitting and paying now', () => {
    expect(calculateApplicationStatus('draft', true, false, true)).toBe('submitted');
  });

  it('should maintain "submitted" status if already submitted', () => {
    expect(calculateApplicationStatus('submitted', true, false, false)).toBe('submitted');
  });
});
