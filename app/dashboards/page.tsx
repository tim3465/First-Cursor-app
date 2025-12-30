'use client';

import { useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { useApiKeys } from '@/hooks/useApiKeys';
import ApiKeyForm from '@/components/ApiKeyForm';
import ApiKeysTable from '@/components/ApiKeysTable';
import type { ApiKey } from '@/types/api-key';

export default function DashboardsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const { toast, showSuccess, showError } = useToast();
  const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys({
    showSuccess,
    showError,
  });

  // Start editing
  const startEdit = (key: ApiKey) => {
    setEditingKey(key);
    setShowCreateForm(false);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingKey(null);
    setShowCreateForm(false);
  };

  // Handle create
  const handleCreate = async (name: string) => {
    const success = await createApiKey(name);
    if (success) {
      setShowCreateForm(false);
    }
    return success;
  };

  // Handle update
  const handleUpdate = async (id: string, name: string) => {
    const success = await updateApiKey(id, name);
    if (success) {
      setEditingKey(null);
    }
    return success;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    await deleteApiKey(id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <Toast toast={toast} />
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                API Keys Dashboard
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Manage your API keys securely
              </p>
            </div>
            <button
              onClick={() => {
                cancelEdit();
                setShowCreateForm(!showCreateForm);
              }}
              className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              {showCreateForm ? 'Cancel' : '+ New API Key'}
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        <ApiKeyForm
          editingKey={editingKey}
          showCreateForm={showCreateForm}
          onCancel={cancelEdit}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          showSuccess={showSuccess}
          showError={showError}
        />

        {/* API Keys List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <ApiKeysTable
            apiKeys={apiKeys}
            loading={loading}
            onEdit={startEdit}
            onDelete={handleDelete}
            showSuccess={showSuccess}
            showError={showError}
          />
        </div>
      </div>
    </div>
  );
}

