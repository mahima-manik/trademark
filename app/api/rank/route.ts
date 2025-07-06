import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, selectedCollections } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Simulate 1-second latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create response with selected collections info
    let responseText = 'Hi';
    
    if (selectedCollections && selectedCollections.length > 0) {
      responseText += `\n\nSelected collections: ${selectedCollections.join(', ')}`;
    } else {
      responseText += '\n\nNo collections selected.';
    }

    return NextResponse.json({ 
      response: responseText,
      selectedCollections: selectedCollections || []
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
} 