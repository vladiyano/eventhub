'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Alice Cooper');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const result =
        mode === 'login'
          ? await api.login(email, password)
          : await api.register(email, password, fullName);
      saveSession(result);
      router.push('/');
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form">
      <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p style={{ marginTop: '1rem' }}>
          <button className="button" type="submit" disabled={busy}>
            {busy ? '...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </p>
      </form>

      {err && <p className="error">{err}</p>}

      <p style={{ marginTop: '1.5rem' }}>
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMode(mode === 'login' ? 'register' : 'login');
          }}
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </a>
      </p>
    </section>
  );
}
