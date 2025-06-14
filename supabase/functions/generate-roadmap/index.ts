
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = 'https://phfofzvcnhnwucxyjyts.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ROADMAP GENERATION STARTED ===');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing');
      throw new Error('Gemini API key is not configured');
    }
    
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
      throw new Error('Supabase service role key is not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { skill, level, timeCommitment, learningStyle, goal, timeline } = requestBody;

    if (!skill || !level || !timeCommitment) {
      throw new Error('Missing required fields: skill, level, or timeCommitment');
    }

    const timelineWeeks = timeline ? parseInt(timeline.toString()) : 4;
    console.log('Timeline weeks:', timelineWeeks);

    const prompt = `Create a detailed ${timelineWeeks}-week learning roadmap for "${skill}".

Requirements:
- Current Level: ${level}
- Weekly Time Commitment: ${timeCommitment} hours
- Learning Style: ${learningStyle || 'Mixed'}
- End Goal: ${goal || 'General mastery'}
- Timeline: ${timelineWeeks} weeks

Return ONLY a valid JSON object with this exact structure:
{
  "title": "${skill} Mastery Roadmap",
  "duration": "${timelineWeeks} Weeks",
  "totalHours": "${timeCommitment}",
  "motivationalTip": "Stay consistent and practice daily!",
  "summary": "This roadmap will guide you to master ${skill}",
  "weeks": [
    {
      "week": 1,
      "title": "Foundation & Setup",
      "description": "Build fundamentals and setup",
      "difficulty": "Beginner",
      "estimatedHours": "${timeCommitment} hours",
      "goals": ["Learn basics", "Setup environment", "First practice"],
      "tasks": [
        {
          "id": "w1-t1",
          "title": "Learn ${skill} fundamentals",
          "type": "video",
          "duration": "2 hours",
          "resource": "Official documentation"
        },
        {
          "id": "w1-t2", 
          "title": "Setup development environment",
          "type": "practice",
          "duration": "1 hour",
          "resource": "Setup guide"
        }
      ],
      "checkpoint": "Complete basic setup and understand core concepts"
    }
  ]
}

Make the roadmap progressive, practical, and tailored to ${level} level. Include ${timelineWeeks} weeks total.`;

    console.log('Calling Gemini API...');
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        }
      }),
    });

    console.log('Gemini response status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`AI service error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response structure:', geminiData);
      throw new Error('Invalid AI response structure');
    }

    let generatedContent = geminiData.candidates[0].content.parts[0].text;
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let roadmapData;
    try {
      roadmapData = JSON.parse(generatedContent);
      console.log('Successfully parsed roadmap data');
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Content preview:', generatedContent.substring(0, 200));
      throw new Error('Failed to parse AI response');
    }

    if (!roadmapData.weeks || !Array.isArray(roadmapData.weeks)) {
      console.error('Invalid roadmap structure');
      throw new Error('Invalid roadmap structure from AI');
    }

    console.log('Saving to database...');

    const { data: roadmap, error: insertError } = await supabase
      .from('roadmaps')
      .insert({
        user_id: user.id,
        skill_name: skill,
        current_level: level,
        time_commitment: timeCommitment,
        learning_style: learningStyle,
        end_goal: goal,
        timeline: timelineWeeks.toString(),
        generated_data: roadmapData
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      throw new Error(`Failed to save roadmap: ${insertError.message}`);
    }

    console.log('=== ROADMAP GENERATION COMPLETED ===');
    console.log('Roadmap ID:', roadmap.id);

    return new Response(JSON.stringify({ 
      success: true, 
      roadmapId: roadmap.id,
      roadmapData: roadmapData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ERROR IN ROADMAP GENERATION ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate roadmap',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
