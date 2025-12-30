'use client';

import { useState } from 'react';
import type { ApiKey } from '@/types/api-key';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  loading: boolean;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => Promise<void>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export default function ApiKeysTable({
  apiKeys,
  loading,
  onEdit,
  onDelete,
  showSuccess,
  showError,
}: ApiKeysTableProps) {
  const [unmaskedKeys, setUnmaskedKeys] = useState<Set<string>>(new Set());

  // Mask API key for display
  const maskApiKey = (key: string): string => {
    if (key.length <= 3) return '••••';
    const prefix = key.substring(0, 3);
    return prefix + '••••••••••••';
  };

  // Toggle unmask for a specific key
  const toggleUnmask = (id: string) => {
    setUnmaskedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Check if a key is unmasked
  const isUnmasked = (id: string): boolean => {
    return unmaskedKeys.has(id);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied to clipboard.');
    } catch (err) {
      showError('Failed to copy.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
        No API keys found. Create your first API key to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              API Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {apiKeys.map((key) => (
            <tr
              key={key.id}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-zinc-50">
                {key.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <code className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                    {isUnmasked(key.id) ? key.key : maskApiKey(key.key)}
                  </code>
                  <button
                    onClick={() => toggleUnmask(key.id)}
                    className="text-xs px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    title={isUnmasked(key.id) ? 'Mask' : 'Unmask'}
                    aria-label={isUnmasked(key.id) ? 'Mask API key' : 'Unmask API key'}
                  >
                    {isUnmasked(key.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="text-xs px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                {new Date(key.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(key)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(key.id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

