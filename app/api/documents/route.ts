import { NextRequest, NextResponse } from 'next/server';

const ZEROENTROPY_API_KEY = process.env.ZEROENTROPY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection_name, limit = 1024, path_prefix = '', path_gt = '' } = body;

    if (!collection_name) {
      return NextResponse.json({ error: 'collection_name is required' }, { status: 400 });
    }

    const response = await fetch('https://api.zeroentropy.dev/v1/documents/get-document-info-list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ZEROENTROPY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collection_name, limit, path_prefix, path_gt }),
    });

    const data = await response.json();

    if (response.status === 200 && data.documents) {
      return NextResponse.json({ documents: data.documents }, { status: 200 });
    } else if (data.detail) {
      // 400/402/422 error
      if (typeof data.detail === 'string') {
        return NextResponse.json({ error: data.detail }, { status: response.status });
      } else if (Array.isArray(data.detail)) {
        return NextResponse.json({ error: data.detail.map((d: any) => d.msg).join('; ') }, { status: response.status });
      }
    }
    return NextResponse.json({ error: 'Unexpected response format.' }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
}
