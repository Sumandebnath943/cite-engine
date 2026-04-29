import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        showToast('Copied to clipboard', 'success');
        setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
      } catch {
        showToast('Failed to copy', 'error');
      }
    },
    [showToast]
  );

  return { copy, copiedId };
}
