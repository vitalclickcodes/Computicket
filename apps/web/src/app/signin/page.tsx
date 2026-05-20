'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.signin({ email, password });
      setToken(res.token);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">
        Access your tickets, bookings, and organizer dashboard.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="email" required placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="password" required minLength={8} placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit" disabled={submitting}
          className="w-full bg-brand text-white font-medium py-2.5 rounded-md hover:bg-brand-dark disabled:bg-gray-300"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-600">
        New here? <Link href="/signup" className="text-brand hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
