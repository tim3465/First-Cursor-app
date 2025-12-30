'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiPlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      // Navigate to /protected with the API key as a query parameter
      router.push(`/protected?apiKey=${encodeURIComponent(apiKey.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            API Playground
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="api-key"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                API Key
              </label>
              <input
                id="api-key"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your API key"
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

