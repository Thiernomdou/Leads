import { useState, type FormEvent } from 'react';

export default function AdminLoginForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de connexion');
      }

      window.location.href = '/admin';
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-warm-600 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-white border border-cream-300 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
          placeholder="admin@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-warm-600 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-4 py-3 bg-white border border-cream-300 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-warm-700 text-white font-semibold rounded-xl hover:bg-warm-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
