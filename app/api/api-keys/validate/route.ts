import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

// POST - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from('api_key')
      .select('id, name, value')
      .eq('value', apiKey.trim())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false },
        { status: 200 }
      );
    }

    // API key is valid
    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}

