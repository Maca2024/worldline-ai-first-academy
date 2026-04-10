'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate invite code server-side — codes never live in client JS
    let role: 'student' | 'instructor' = 'student';
    let squadName = '';
    try {
      const validateRes = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });

      if (validateRes.status === 429) {
        setError('Te veel pogingen. Probeer het over 15 minuten opnieuw.');
        setLoading(false);
        return;
      }

      const validateData = await validateRes.json();
      if (!validateData.valid) {
        setError(validateData.error ?? 'Ongeldige invite code.');
        setLoading(false);
        return;
      }

      role = validateData.role;
      squadName = validateData.squad;
    } catch {
      setError('Kan verbinding niet maken. Controleer je internetverbinding.');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          squad_name: squadName,
          role,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="glass rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Account aangemaakt!</h2>
            <p className="text-gray-400">Controleer je e-mail om je account te bevestigen.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-white">AI-First Academy</span>
          </div>
          <p className="text-gray-400">Registreer met je squad invite code</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              id="fullName"
              label="Volledige naam"
              type="text"
              placeholder="Jan de Vries"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              id="email"
              label="E-mailadres"
              type="email"
              placeholder="naam@worldline.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              label="Wachtwoord"
              type="password"
              placeholder="Minimaal 8 tekens"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />

            <Input
              id="inviteCode"
              label="Invite Code"
              type="text"
              placeholder="SQUAD-X-2026"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Account aanmaken
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Al een account?{' '}
              <Link href="/login" className="text-accent-blue hover:text-blue-400 font-medium">
                Inloggen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
