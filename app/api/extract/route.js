import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      return Response.json({ error: 'No images provided' }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    // Convert files to base64
    const imageContents = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const mediaType = file.type || 'image/png';
        return {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64,
          },
        };
      })
    );

    // Create the message with images
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: `Analyze these Apple Watch/Fitness app workout screenshots and extract the run data.

Return ONLY a JSON object with these fields (use null for any values you can't find):
{
  "date": "YYYY-MM-DD format",
  "distance": number in miles (just the number, e.g. 5.01),
  "time": "H:MM:SS format",
  "pace": "MM:SS format (per mile)",
  "hr": number (average heart rate in bpm),
  "cadence": number (steps per minute),
  "calories": number (active calories)
}

Important:
- Extract the ACTUAL values from the screenshot, not estimates
- For distance, convert to miles if shown in km (1 km = 0.621371 mi)
- Return ONLY the JSON object, no other text`,
            },
          ],
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].text;

    // Try to extract JSON from the response
    let extractedData;
    try {
      // Find JSON in the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      return Response.json({
        error: 'Failed to parse extraction results',
        raw: responseText
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      data: extractedData
    });

  } catch (error) {
    console.error('Extraction error:', error);
    return Response.json({
      error: error.message || 'Failed to extract data'
    }, { status: 500 });
  }
}
