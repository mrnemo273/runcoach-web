import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { raceName, location, distance, courseInfo } = await request.json();

    const prompt = `You are a running coach who has helped many runners prepare for "${raceName}" in ${location}.

Based on your knowledge of this race and similar ${distance} races, provide 5 practical tips that past runners wish they had known before race day.

Focus on:
- Course-specific advice (hills, turns, surface, crowd support)
- Logistics (parking, start line, gear check, bathroom lines)
- Weather/timing considerations
- Pacing strategy for this specific course
- Local tips that only experienced runners would know

${courseInfo ? `Course info: ${courseInfo}` : ''}

Return ONLY a JSON array of 5 tips, each tip being a single string. Keep each tip concise (1-2 sentences).

Example format:
["Tip 1 text here", "Tip 2 text here", "Tip 3 text here", "Tip 4 text here", "Tip 5 text here"]

Return ONLY the JSON array, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse the JSON response
    let tips;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tips = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found');
      }
    } catch (parseError) {
      console.error('Failed to parse tips:', parseError);
      // Return default tips
      tips = [
        "Arrive at least 90 minutes early to account for security, gear check, and bathroom lines.",
        "Study the course elevation profile and plan your pacing strategy accordingly.",
        "Identify key landmarks or mile markers where you'll take nutrition or adjust your pace.",
        "Check the weather forecast the night before and dress for conditions at the finish, not the start.",
        "Write your name on your shirt - crowd support calling your name is a huge boost!"
      ];
    }

    return NextResponse.json({
      success: true,
      tips: tips
    });

  } catch (error) {
    console.error('Error fetching race tips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch race tips' },
      { status: 500 }
    );
  }
}
