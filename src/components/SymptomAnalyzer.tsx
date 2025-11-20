import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Symptoms required",
        description: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const { data, error } = await supabase.functions.invoke('symptom-analysis', {
        body: { symptoms }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not analyze symptoms",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Symptom Analyzer
        </CardTitle>
        <CardDescription>
          Describe your symptoms and get instant triage recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is an AI-powered tool for guidance only. For emergencies, call emergency services immediately.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">Describe your symptoms</label>
          <Textarea
            placeholder="Example: I have a severe headache, dizziness, and nausea for the past 2 hours..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Button 
          onClick={analyzeSymptoms} 
          disabled={isAnalyzing || !symptoms.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Symptoms
            </>
          )}
        </Button>

        {analysis && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {analysis}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomAnalyzer;
