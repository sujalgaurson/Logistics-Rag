import { Header } from '@/components/Header';
import { FileUploadCard } from '@/components/FileUploadCard';
import { AskQuestionCard } from '@/components/AskQuestionCard';
import { ExtractShipmentCard } from '@/components/ExtractShipmentCard';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-1 lg:gap-8">
          <FileUploadCard />
          <AskQuestionCard />
          <ExtractShipmentCard />
        </div>
      </main>
    </div>
  );
}
