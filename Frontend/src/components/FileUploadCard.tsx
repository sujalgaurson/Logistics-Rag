import { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadFile } from '@/services/api';
import { cn } from '@/lib/utils';

const ACCEPT = '.pdf,.docx,.txt';
const ACCEPT_LIST = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

export function FileUploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      const valid = ACCEPT_LIST.some((t) => file.type === t) || /\.(pdf|docx|txt)$/i.test(file.name);
      if (!valid) {
        setError('Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      setError(null);
      setSuccess(false);
      setIsUploading(true);
      try {
        await uploadFile(file);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Upload failed. Is the backend running?');
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
      e.target.value = '';
    },
    [handleFile]
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          Upload Document
        </CardTitle>
        <CardDescription>Upload a PDF, DOCX, or TXT file for analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={cn(
            'flex min-h-[140px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-zinc-500 bg-zinc-100 dark:bg-zinc-700/50'
              : 'border-zinc-300 bg-zinc-50/50 dark:border-zinc-600 dark:bg-zinc-800/30'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-8 w-8 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm">Uploading…</span>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
              <span className="text-sm font-medium">Upload successful</span>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-10 w-10 text-zinc-400 dark:text-zinc-500" />
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                Drag and drop here, or click to browse
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept={ACCEPT}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium',
                    'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
                  )}
                >
                  Choose file
                </span>
              </label>
            </>
          )}
        </div>
        {error && (
          <p className="animate-slide-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
