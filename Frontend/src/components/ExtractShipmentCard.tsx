import { useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { extractShipment, type ExtractResponse } from '@/services/api';

function formatValue(value: string | number | null): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return String(value);
  return value;
}

const ROWS: { key: keyof ExtractResponse; label: string }[] = [
  { key: 'shipment_id', label: 'Shipment ID' },
  { key: 'shipper', label: 'Shipper' },
  { key: 'consignee', label: 'Consignee' },
  { key: 'pickup_datetime', label: 'Pickup date/time' },
  { key: 'delivery_datetime', label: 'Delivery date/time' },
  { key: 'equipment_type', label: 'Equipment type' },
  { key: 'mode', label: 'Mode' },
  { key: 'rate', label: 'Rate' },
  { key: 'currency', label: 'Currency' },
  { key: 'weight', label: 'Weight' },
  { key: 'carrier_name', label: 'Carrier name' },
];

export function ExtractShipmentCard() {
  const [data, setData] = useState<ExtractResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExtract() {
    setError(null);
    setData(null);
    setIsLoading(true);
    try {
      const res = await extractShipment();
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Extract failed. Upload a document first.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          Extract Shipment
        </CardTitle>
        <CardDescription>Extract structured shipment data from the document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleExtract} disabled={isLoading} isLoading={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting…
            </>
          ) : (
            'Extract'
          )}
        </Button>
        {error && (
          <p className="animate-slide-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {data != null && (
          <div className="animate-slide-down overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-600">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                      Field
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(({ key, label }) => (
                    <tr
                      key={key}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-700"
                    >
                      <td className="px-4 py-2.5 font-medium text-zinc-600 dark:text-zinc-400">
                        {label}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-800 dark:text-zinc-200">
                        {formatValue(data[key] as string | number | null)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
