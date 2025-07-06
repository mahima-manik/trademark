import { NextRequest, NextResponse } from 'next/server';

const ZEROENTROPY_API_KEY = process.env.ZEROENTROPY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, selectedCollections } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // If no collections are selected, return a message
    if (!selectedCollections || selectedCollections.length === 0) {
      return NextResponse.json({ 
        response: 'Please select at least one collection to search in.',
        selectedCollections: []
      }, { status: 200 });
    }

    // Simulate 1-second latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call ZeroEntropy API for each selected collection
    const allResults = [];
    const errors = [];

    for (const collectionName of selectedCollections) {
      try {
        const response = await fetch('https://api.zeroentropy.dev/v1/queries/top-documents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ZEROENTROPY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collection_name: collectionName,
            query: message,
            k: 5, // Get top 5 results per collection
            latency_mode: "low"
          }),
        });

        const data = await response.json();

        console.log(data);

        if (response.status === 200 && data.results) {
          allResults.push({
            collection: collectionName,
            results: data.results
          });
        } else if (data.detail) {
          // Handle 400/404/422 errors
          if (typeof data.detail === 'string') {
            errors.push(`${collectionName}: ${data.detail}`);
          } else if (Array.isArray(data.detail)) {
            errors.push(`${collectionName}: ${data.detail.map((d: any) => d.msg).join('; ')}`);
          }
        }
      } catch (err: any) {
        errors.push(`${collectionName}: Network error - ${err.message}`);
      }
    }

    // Format the response
    let responseText = `Found results for your query: "${message}"\n\n`;

    if (allResults.length > 0) {
      allResults.forEach(({ collection, results }) => {
        responseText += `**${collection}:**\n`;
        results.forEach((result: any, index: number) => {
          responseText += `${index + 1}. ${result.path} (Score: ${result.score.toFixed(2)})\n`;
        });
        responseText += '\n';
      });
    }

    if (errors.length > 0) {
      responseText += `**Errors:**\n`;
      errors.forEach(error => {
        responseText += `• ${error}\n`;
      });
    }

    if (allResults.length === 0 && errors.length === 0) {
      responseText += 'No results found for your query.';
    }

    return NextResponse.json({ 
      response: responseText.trim(),
      selectedCollections: selectedCollections,
      results: allResults,
      errors: errors
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Network error: ' + err.message }, { status: 500 });
  }
} 