import { useState, useEffect, useCallback } from 'react';
import type { ApiKey } from '@/types/api-key';

interface UseApiKeysOptions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function useApiKeys({ showSuccess, showError }: UseApiKeysOptions) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch API keys
  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      } else {
        showError('Failed to fetch API keys');
      }
    } catch (err) {
      showError('Error loading API keys');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  // Create new API key
  const createApiKey = useCallback(
    async (name: string) => {
      try {
        const response = await fetch('/api/api-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (response.ok) {
          showSuccess('API key created successfully!');
          await fetchApiKeys();
          return true;
        } else {
          const data = await response.json();
          showError(data.error || 'Failed to create API key');
          return false;
        }
      } catch (err) {
        showError('Error creating API key');
        return false;
      }
    },
    [fetchApiKeys, showSuccess, showError]
  );

  // Update API key
  const updateApiKey = useCallback(
    async (id: string, name: string) => {
      try {
        const response = await fetch('/api/api-keys', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name }),
        });

        if (response.ok) {
          showSuccess('API key updated successfully!');
          await fetchApiKeys();
          return true;
        } else {
          const data = await response.json();
          showError(data.error || 'Failed to update API key');
          return false;
        }
      } catch (err) {
        showError('Error updating API key');
        return false;
      }
    },
    [fetchApiKeys, showSuccess, showError]
  );

  // Delete API key
  const deleteApiKey = useCallback(
    async (id: string) => {
      if (!confirm('Are you sure you want to delete this API key?')) {
        return false;
      }

      try {
        const response = await fetch(`/api/api-keys?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showSuccess('API key deleted successfully!');
          await fetchApiKeys();
          return true;
        } else {
          const data = await response.json();
          showError(data.error || 'Failed to delete API key');
          return false;
        }
      } catch (err) {
        showError('Error deleting API key');
        return false;
      }
    },
    [fetchApiKeys, showSuccess, showError]
  );

  return {
    apiKeys,
    loading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}

