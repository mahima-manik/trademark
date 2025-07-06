import { NextRequest, NextResponse } from 'next/server';

const ZEROENTROPY_API_KEY = process.env.ZEROENTROPY_API_KEY;

export async function GET(req: NextRequest) {
  try {
    // Read from query parameters instead of request body
    const { searchParams } = new URL(req.url);
    const collection_name = searchParams.get('collection_name');
    const limit = parseInt(searchParams.get('limit') || '1024');
    const path_prefix = searchParams.get('path_prefix') || '';
    const path_gt = searchParams.get('path_gt') || '';

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
    } else {
      return handleApiError(response, data);
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { collection_name, path, content, metadata = {}, overwrite = false } = body;

    if (!collection_name) {
      return NextResponse.json({ error: 'collection_name is required' }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const response = await fetch('https://api.zeroentropy.dev/v1/documents/add-document', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ZEROENTROPY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collection_name, path, content, metadata, overwrite }),
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({ message: data.message || 'Success!' }, { status: response.status });
    } else {
      return handleApiError(response, data);
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
}


// Helper function for common error handling
function handleApiError(response: Response, data: any) {
  if (data.detail) {
    // 400/402/409/422 error
    if (typeof data.detail === 'string') {
      return NextResponse.json({ error: data.detail }, { status: response.status });
    } else if (Array.isArray(data.detail)) {
      return NextResponse.json({ error: data.detail.map((d: any) => d.msg).join('; ') }, { status: response.status });
    }
  }
  return NextResponse.json({ error: 'Unexpected response format.' }, { status: 500 });
}
