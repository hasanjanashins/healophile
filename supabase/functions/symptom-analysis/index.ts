import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data, error: authError } = await supabase.auth.getClaims(token);

    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = data.claims.sub;

    const { symptoms } = await req.json();

    if (!symptoms || typeof symptoms !== 'string') {
      return new Response(JSON.stringify({ error: "Symptoms required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an experienced medical triage AI assistant. Your job is to analyze patient symptoms comprehensively and provide a detailed assessment.

When analyzing symptoms:
1. Consider ALL symptoms together as a cluster, not individually
2. Identify the most likely condition(s) based on the symptom combination
3. Consider common conditions first (cold, flu, allergies, sinusitis, etc.)
4. Mention if symptoms could indicate something more serious
5. Provide practical self-care advice

Available emergency services:
- **Ambulance**: For life-threatening emergencies, severe injuries, chest pain, difficulty breathing, loss of consciousness
- **Meds by Drone**: For urgent medication delivery, first aid supplies, minor emergencies where patient is stable
- **Hospital Bed Booking**: For non-emergency situations requiring hospital admission
- **Telemedicine**: For minor concerns, follow-ups, medical advice

Provide:
1. **Most Likely Condition**: Name the condition(s) that best match all symptoms together
2. **Explanation**: Why these symptoms point to this condition
3. **Urgency Level**: Critical/High/Medium/Low
4. **Recommended Service**: Which emergency service to use
5. **Self-Care Tips**: Practical advice the patient can follow right now
6. **Warning Signs**: Symptoms that would require immediate emergency care
7. **When to See a Doctor**: Clear guidance on when professional help is needed

For example, if someone reports "severe headache, runny nose, continuous sneezing" — recognize this as likely a common cold or possible sinusitis, not three separate issues.

Be thorough, empathetic, and always prioritize patient safety. Format your response clearly with the sections above.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Patient is reporting the following symptoms: ${symptoms}\n\nPlease analyze all these symptoms together as a cluster and identify the most likely condition(s). Provide a comprehensive assessment.` }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service requires payment. Please contact support." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log(`Symptom analysis completed for user ${userId}`);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in symptom-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
