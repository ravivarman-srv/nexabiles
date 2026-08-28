'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function AcceptInvitePage() {
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const router = useRouter();

  // On mount: Supabase automatically exchanges the #access_token hash fragment
  // for a session. We listen for the auth state change to know when it's ready.
  useEffect(() => {
    const supabase = createClient();

    // Check if there is already an active session (e.g., page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        setAuthReady(true);
      }
    });

    // Listen for Supabase to process the invite hash in the URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSessionUser(session.user);
          setAuthReady(true);

          // If user already has a full name set (already completed setup), go to dashboard
          if (event === 'SIGNED_IN') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', session.user.id)
              .single();

            // Only auto-redirect if they already have a name (i.e. not a fresh invite)
            if (profile?.full_name && profile.full_name.trim()) {
              router.replace('/dashboard');
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authReady) return;
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Update Auth user: set password + name in metadata
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { full_name: fullName },
      });

      if (updateError) throw updateError;

      // 2. Update the profile row with the full name
      if (sessionUser) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('user_id', sessionUser.id);

        if (profileError) {
          console.warn('Profile update error (non-fatal):', profileError.message);
        }
      }

      toast.success('Account setup complete! Welcome to the team!');
      router.replace('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to setup account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full md:w-1/2 flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 relative">
        <div className="mx-auto w-full max-w-md flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Accept Invitation</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your name and set a password to join the team.
            </p>
          </div>

          {!authReady ? (
            <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Verifying invitation link...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Set Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loading || !fullName.trim() || password.length < 6}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading ? 'Setting up...' : 'Join Team'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-muted items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/20 via-transparent to-transparent" />
        <div className="z-10 text-center px-12">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome aboard!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Set up your account to start managing WhatsApp conversations with your team.
          </p>
        </div>
      </div>
    </div>
  );
}
