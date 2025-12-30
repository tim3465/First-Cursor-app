'use client';

import { useState, useEffect } from 'react';
import type { ApiKey } from '@/types/api-key';

interface ApiKeyFormProps {
  editingKey: ApiKey | null;
  showCreateForm: boolean;
  onCancel: () => void;
  onCreate: (name: string) => Promise<boolean>;
  onUpdate: (id: string, name: string) => Promise<boolean>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export default function ApiKeyForm({
  editingKey,
  showCreateForm,
  onCancel,
  onCreate,
  onUpdate,
  showSuccess,
  showError,
}: ApiKeyFormProps) {
  const [formName, setFormName] = useState('');
  const [formKey, setFormKey] = useState('');

  // Update form when editing
  useEffect(() => {
    if (editingKey) {
      setFormName(editingKey.name);
      setFormKey(editingKey.key);
    } else {
      setFormName('');
      setFormKey('');
    }
  }, [editingKey]);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied to clipboard.');
    } catch (err) {
      showError('Failed to copy.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingKey) {
      const success = await onUpdate(editingKey.id, formName);
      if (success) {
        setFormName('');
        setFormKey('');
        onCancel();
      }
    } else {
      const success = await onCreate(formName);
      if (success) {
        setFormName('');
        onCancel();
      }
    }
  };

  if (!showCreateForm && !editingKey) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
        {editingKey ? 'Edit API Key' : 'Create New API Key'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder="Enter API key name"
            required
          />
        </div>
        {editingKey && (
          <div className="mb-4">
            <label
              htmlFor="key"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="key"
                value={formKey}
                readOnly
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-black dark:text-zinc-50"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(formKey)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
          >
            {editingKey ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

