import { renderHook, act } from '@testing-library/react';
import { useModal } from '@/hooks/useModal';

describe('useModal', () => {
  it('initializes with isOpen set to false by default', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('initializes with provided initial state', () => {
    const { result } = renderHook(() => useModal(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('opens modal when openModal is called', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closes modal when closeModal is called', () => {
    const { result } = renderHook(() => useModal(true));

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggles modal state when toggleModal is called', () => {
    const { result } = renderHook(() => useModal());

    // Toggle from false to true
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle from true to false
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('maintains state between renders', () => {
    const { result, rerender } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    rerender();
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    rerender();
    expect(result.current.isOpen).toBe(false);
  });

  it('handles multiple state changes', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
      result.current.closeModal();
      result.current.openModal();
      result.current.toggleModal();
    });

    expect(result.current.isOpen).toBe(false);
  });
}); 