import { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { askQuestion } from '@/services/api';
import { cn } from '@/lib/utils';

export function AskQuestionCard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [supportingText, setSupportingText] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  async function handleAsk() {
    const q = question.trim();
    if (!q) return;
    setError(null);
    setAnswer(null);
    setSupportingText([]);
    setConfidence(null);
    setIsLoading(true);
    try {
      const res = await askQuestion(q);
      setAnswer(res.answer);
      setSupportingText(res.supporting_source_text ?? []);
      setConfidence(res.confidence_score ?? null);
      setSourcesOpen((res.supporting_source_text?.length ?? 0) > 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed. Upload a document first.');
    } finally {
      setIsLoading(false);
    }
  }

  const confidenceVariant =
    confidence != null
      ? confidence >= 0.8
        ? 'success'
        : confidence >= 0.5
          ? 'warning'
          : 'secondary'
      : 'secondary';

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          Ask a Question
        </CardTitle>
        <CardDescription>Ask anything about the uploaded document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g. What is the delivery date?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleAsk} disabled={isLoading || !question.trim()} isLoading={isLoading}>
            Ask
          </Button>
        </div>
        {error && (
          <p className="animate-slide-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {answer != null && (
          <div className="animate-slide-down space-y-3">
            <div className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {answer}
            </div>
            {confidence != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Confidence</span>
                <Badge variant={confidenceVariant}>
                  {Math.round(confidence * 100)}%
                </Badge>
              </div>
            )}
            {supportingText.length > 0 && (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-600">
                <button
                  type="button"
                  onClick={() => setSourcesOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Supporting source text ({supportingText.length})
                  {sourcesOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {sourcesOpen && (
                  <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-600">
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {supportingText.map((text, i) => (
                        <li key={i} className={cn('rounded bg-zinc-100 p-2 dark:bg-zinc-700/50')}>
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
