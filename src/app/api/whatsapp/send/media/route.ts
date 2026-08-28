import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadMedia, sendMediaMessage } from '@/lib/whatsapp/meta-api';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use FormData for file uploads
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const conversationId = formData.get('conversationId') as string;
    const type = formData.get('type') as 'image' | 'document';
    const caption = formData.get('caption') as string | undefined;

    if (!file || !conversationId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user has access to conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, org_id, contact:contacts(phone)')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
    }

    // @ts-ignore - Contact relation typing
    const toPhone = conversation.contact?.phone;
    if (!toPhone) {
      return NextResponse.json({ error: 'Contact phone not found' }, { status: 400 });
    }

    // Get WhatsApp Config for the org
    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('phone_number_id, access_token, status')
      .eq('org_id', conversation.org_id)
      .single();

    if (configError || !config || config.status !== 'connected') {
      return NextResponse.json({ error: 'WhatsApp not configured for this organization' }, { status: 400 });
    }

    // Convert Blob to Buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Upload Media
    // FormData blobs might not have a reliable filename. Give it a fallback.
    const fileObj = file as any;
    const filename = fileObj.name || (type === 'image' ? 'image.jpg' : 'document.pdf');
    
    const mediaId = await uploadMedia({
      phoneNumberId: config.phone_number_id,
      accessToken: config.access_token,
      file: buffer,
      mimeType: file.type,
      filename,
    });

    // 2. Send Media Message
    const { messageId } = await sendMediaMessage({
      phoneNumberId: config.phone_number_id,
      accessToken: config.access_token,
      to: toPhone,
      mediaId,
      type,
      caption: caption && caption !== 'null' ? caption : undefined,
      filename: type === 'document' ? filename : undefined,
    });

    const mediaUrl = `/api/whatsapp/media/${mediaId}`;

    // 3. Save to CRM
    const { data: savedMsg, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'agent',
        content_type: type,
        content_text: caption && caption !== 'null' ? caption : null,
        media_url: mediaUrl,
        message_id: messageId,
        status: 'sent',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save message to DB:', insertError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: savedMsg });
  } catch (error: any) {
    console.error('Error sending media:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
