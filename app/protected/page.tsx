'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { showSuccess, showError } from '@/lib/notification';

export default function ProtectedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showSuccess: showToastSuccess, showError: showToastError } = useToast();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateApiKey = async () => {
      const apiKey = searchParams.get('apiKey');

      if (!apiKey) {
        // No API key provided, redirect back
        const errorNotification = showError('Invalid API key');
        showToastError(errorNotification.message);
        router.push('/api-playground');
        return;
      }

      try {
        const response = await fetch('/api/api-keys/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey }),
        });

        const data = await response.json();

        if (data.valid) {
          setIsValid(true);
          const successNotification = showSuccess('Valid API key');
          showToastSuccess(successNotification.message);
        } else {
          setIsValid(false);
          const errorNotification = showError('Invalid API key');
          showToastError(errorNotification.message);
          // Redirect back to API Playground after a short delay
          setTimeout(() => {
            router.push('/api-playground');
          }, 1500);
        }
      } catch (error) {
        setIsValid(false);
        const errorNotification = showError('Invalid API key');
        showToastError(errorNotification.message);
        // Redirect back to API Playground after a short delay
        setTimeout(() => {
          router.push('/api-playground');
        }, 1500);
      } finally {
        setIsValidating(false);
      }
    };

    validateApiKey();
  }, [searchParams, router, showToastSuccess, showToastError]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
        <Toast toast={toast} />
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-zinc-600 dark:text-zinc-400">Validating API key...</div>
          </div>
        </div>
      </div>
    );
  }

  // If invalid, don't show the protected content (will redirect)
  if (!isValid) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
        <Toast toast={toast} />
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-zinc-600 dark:text-zinc-400">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  // Valid API key - show protected content
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <Toast toast={toast} />
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Protected Page
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You have successfully authenticated with a valid API key.
          </p>
        </div>

        {/* Protected Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-zinc-700 dark:text-zinc-300">
            This is a protected page that requires a valid API key to access.
          </p>
        </div>
      </div>
    </div>
  );
}

