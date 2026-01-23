import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { raceName, raceDate, distance, runHistory } = await request.json();

    // Calculate weeks until race
    const today = new Date();
    const race = new Date(raceDate);
    const weeksUntilRace = Math.ceil((race - today) / (1000 * 60 * 60 * 24 * 7));

    // Calculate runner's current stats from run history
    const totalMiles = runHistory.reduce((sum, r) => sum + r.distance, 0);
    const avgPace = runHistory.length > 0
      ? runHistory.reduce((sum, r) => {
          const [min, sec] = r.pace.split(':').map(Number);
          return sum + min + sec/60;
        }, 0) / runHistory.length
      : 14;

    const longestRun = Math.max(...runHistory.map(r => r.distance), 0);
    const recentRuns = runHistory.slice(-5);

    const distanceMap = {
      '5k': { miles: 3.1, name: '5K' },
      '10k': { miles: 6.2, name: '10K' },
      'half': { miles: 13.1, name: 'Half Marathon' },
      'marathon': { miles: 26.2, name: 'Marathon' }
    };

    const targetDistance = distanceMap[distance]?.miles || 13.1;
    const distanceName = distanceMap[distance]?.name || distance;

    const prompt = `You are a professional running coach creating a personalized training plan.

RUNNER PROFILE:
- Total miles logged: ${totalMiles.toFixed(1)} miles
- Average pace: ${avgPace.toFixed(1)} min/mile
- Longest run: ${longestRun.toFixed(1)} miles
- Recent runs: ${recentRuns.map(r => `${r.distance}mi @ ${r.pace}/mi`).join(', ')}

RACE DETAILS:
- Race: ${raceName}
- Distance: ${distanceName} (${targetDistance} miles)
- Race Date: ${raceDate}
- Weeks until race: ${weeksUntilRace}

TASK:
1. First, search your knowledge for information about "${raceName}" - location, course details, elevation profile, and any notable characteristics.

2. Create a personalized ${weeksUntilRace}-week training plan that:
   - Builds progressively from their current fitness level
   - Includes 3 runs per week (easy, medium, long run)
   - Has appropriate taper period (1-2 weeks for half, 2-3 for marathon)
   - Peaks 2-3 weeks before race day

3. Suggest a realistic goal time based on their current pace and training trajectory.

Return your response as JSON in this exact format:
{
  "raceInfo": {
    "name": "Official race name",
    "location": "City, State/Country",
    "description": "Brief 1-2 sentence description of the race",
    "courseInfo": "Brief course description (flat, hilly, etc.)",
    "elevation": "Total elevation gain",
    "website": "Official website URL if known, or null",
    "goalTime": "Suggested goal time in H:MM:SS format"
  },
  "trainingPlan": [
    {
      "week": 1,
      "phase": "Base|Build|Peak|Taper|Race Week",
      "runs": ["3 mi", "4 mi", "5 mi"],
      "status": "upcoming"
    }
  ]
}

Return ONLY valid JSON, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse the JSON response
    let parsedResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a default plan if parsing fails
      parsedResponse = generateDefaultPlan(weeksUntilRace, targetDistance, distanceName, raceName);
    }

    return NextResponse.json({
      success: true,
      raceInfo: parsedResponse.raceInfo,
      trainingPlan: parsedResponse.trainingPlan
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate training plan' },
      { status: 500 }
    );
  }
}

// Fallback function to generate a basic plan if AI fails
function generateDefaultPlan(weeks, targetMiles, distanceName, raceName) {
  const plan = [];

  // Determine phases based on weeks available
  const taperWeeks = targetMiles > 13 ? 3 : 2;
  const peakWeeks = 2;
  const buildWeeks = Math.max(Math.floor((weeks - taperWeeks - peakWeeks) / 2), 2);
  const baseWeeks = weeks - buildWeeks - peakWeeks - taperWeeks;

  let currentWeek = 1;
  let baseDistance = Math.min(3, targetMiles * 0.3);

  // Base phase
  for (let i = 0; i < baseWeeks; i++) {
    const longRun = Math.min(baseDistance + i, targetMiles * 0.5);
    plan.push({
      week: currentWeek++,
      phase: 'Base',
      runs: [`${Math.round(baseDistance)} mi`, `${Math.round(baseDistance + 1)} mi`, `${Math.round(longRun)} mi`],
      status: 'upcoming'
    });
  }

  // Build phase
  for (let i = 0; i < buildWeeks; i++) {
    const longRun = Math.min(targetMiles * 0.5 + (i * 1.5), targetMiles * 0.8);
    plan.push({
      week: currentWeek++,
      phase: 'Build',
      runs: [`${Math.round(baseDistance + 1)} mi`, `${Math.round(baseDistance + 2)} mi`, `${Math.round(longRun)} mi`],
      status: 'upcoming'
    });
  }

  // Peak phase
  for (let i = 0; i < peakWeeks; i++) {
    const longRun = Math.min(targetMiles * 0.8 + i, targetMiles * 0.95);
    plan.push({
      week: currentWeek++,
      phase: 'Peak',
      runs: [`${Math.round(baseDistance + 1)} mi`, `${Math.round(baseDistance + 3)} mi`, `${Math.round(longRun)} mi`],
      status: 'upcoming'
    });
  }

  // Taper phase
  for (let i = 0; i < taperWeeks - 1; i++) {
    const reduction = 0.7 - (i * 0.15);
    plan.push({
      week: currentWeek++,
      phase: 'Taper',
      runs: [`${Math.round(baseDistance)} mi`, `${Math.round(baseDistance + 1)} mi`, `${Math.round(targetMiles * reduction)} mi`],
      status: 'upcoming'
    });
  }

  // Race week
  plan.push({
    week: currentWeek,
    phase: 'Race Week',
    runs: ['2 mi', '3 mi', `${targetMiles} mi`],
    status: 'upcoming'
  });

  return {
    raceInfo: {
      name: raceName,
      location: 'TBD',
      description: `A ${distanceName} race`,
      courseInfo: 'Course details not available',
      elevation: 'Unknown',
      website: null,
      goalTime: null
    },
    trainingPlan: plan
  };
}
