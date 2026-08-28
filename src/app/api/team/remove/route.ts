import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function DELETE(req: Request) {
  try {
    const supabaseServer = await createServerClient();
    const { data: { session } } = await supabaseServer.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Use admin client to bypass RLS for all checks
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify caller is an owner
    const { data: callerProfile } = await adminSupabase
      .from('profiles')
      .select('role, org_id')
      .eq('user_id', session.user.id)
      .single();

    if (callerProfile?.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can remove members' }, { status: 403 });
    }

    // Prevent self-removal
    if (user_id === session.user.id) {
      return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 });
    }

    // Ensure target belongs to same org
    const { data: targetProfile } = await adminSupabase
      .from('profiles')
      .select('role, org_id')
      .eq('user_id', user_id)
      .single();

    if (!targetProfile || targetProfile.org_id !== callerProfile?.org_id) {
      return NextResponse.json({ error: 'Member not found in your organization' }, { status: 404 });
    }

    if (targetProfile.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove an owner' }, { status: 400 });
    }

    // Delete from Supabase Auth — cascades to profiles row via ON DELETE CASCADE
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user_id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Remove member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

