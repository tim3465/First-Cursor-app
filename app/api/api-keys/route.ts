import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

// Generate a random API key
function generateApiKey(): string {
  const prefix = 'sk_';
  const randomBytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return prefix + randomBytes;
}

// GET - Fetch all API keys
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_key')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch API keys' },
        { status: 500 }
      );
    }

    // Transform to match expected JSON shape
    const apiKeys = data.map((row) => ({
      id: row.id,
      name: row.name,
      key: row.value,    
      createdAt: row.created_at,
     // lastUsed: row.last_used || undefined, // keep only if this column exists
    }));

    return NextResponse.json(apiKeys);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const apiKey = generateApiKey();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('api_key')
      .insert({
        name: name.trim(),
          value: apiKey,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    // Transform to match expected JSON shape
    const newApiKey = {
      id: data.id,
      name: data.name,
      key: data.value,         
      createdAt: data.created_at,
    //  lastUsed: data.last_used || undefined,
    };

    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
export async function PUT(request: NextRequest) {
    const { id, name } = await request.json();

    if (!id || !name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('api_key')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
    }

    return NextResponse.json({
        id: data.id,
        name: data.name,
        key: data.value,
        createdAt: data.created_at,
    });
}
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
        .from('api_key')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}


