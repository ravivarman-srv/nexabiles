import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// If Supabase is configured, we can use the service role key to insert logs.
// We fallback to file logging if DB is not set up or insertion fails.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { level = 'error', message, source, context, userId } = body;

    let savedToDb = false;

    // 1. Try to save to Supabase Database (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase.from('error_logs').insert({
        level,
        message: message || 'Unknown error',
        source: source || 'unknown',
        context: context || {},
        org_id: userId || null
      });

      if (!error) {
        savedToDb = true;
      } else {
        console.warn('Failed to save log to Supabase, falling back to file:', error.message);
      }
    }

    // 2. Save to local file system as a fallback or complementary log
    try {
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, 'server-errors.log');
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${source || 'Server'}] ${message} | Context: ${JSON.stringify(context || {})}\n`;
      
      fs.appendFileSync(logFile, logEntry);
    } catch (fsError) {
      console.error('Failed to write to local log file:', fsError);
      // If both fail, we just log to console
      if (!savedToDb) {
        console.error('SERVER ERROR LOG:', body);
      }
    }

    return NextResponse.json({ success: true, savedToDb });
  } catch (err) {
    console.error('Error in log endpoint:', err);
    return NextResponse.json({ success: false, error: 'Failed to process log' }, { status: 500 });
  }
}
