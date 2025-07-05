import { NextResponse } from 'next/server';

const ZEROENTROPY_API_KEY = process.env.ZEROENTROPY_API_KEY;

export async function POST() {
  try {
    const response = await fetch('https://api.zeroentropy.dev/v1/collections/get-collection-list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ZEROENTROPY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    // Handle error from ZeroEntropy
    if (data.detail && Array.isArray(data.detail)) {
      return NextResponse.json(
        { error: data.detail.map((d: any) => d.msg).join('; ') },
        { status: response.status }
      );
    }

    // Format to Collection[]
    if (data.collection_names && Array.isArray(data.collection_names)) {
      const collections = data.collection_names.map((name: string) => ({
        name,
        documents: [],
      }));
      return NextResponse.json({ collections }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unexpected response format.' }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
}
