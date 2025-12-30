import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
let apiKeys: Array<{
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}> = [];

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
  return NextResponse.json(apiKeys);
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

    const newApiKey = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      key: generateApiKey(),
      createdAt: new Date().toISOString(),
    };

    apiKeys.push(newApiKey);
    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT - Update an API key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      );
    }

    const index = apiKeys.findIndex((key) => key.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    apiKeys[index] = {
      ...apiKeys[index],
      name: name.trim(),
    };

    return NextResponse.json(apiKeys[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const index = apiKeys.findIndex((key) => key.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    apiKeys.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

