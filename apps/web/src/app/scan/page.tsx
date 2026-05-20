'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

type ScanResult = Awaited<ReturnType<typeof api.scanTicket>> | { error: string };

export default function ScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<{ stop: () => void; destroy: () => void } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  const handleCode = useCallback(async (code: string) => {
    const now = Date.now();
    // Debounce: ignore the same code if seen in the last 2.5s
    if (lastScanRef.current && lastScanRef.current.code === code && now - lastScanRef.current.at < 2500) {
      return;
    }
    lastScanRef.current = { code, at: now };

    const token = getToken();
    if (!token) {
      router.replace('/dashboard/signin');
      return;
    }
    try {
      const res = await api.scanTicket(token, code);
      setResult(res);
      setRecent((r) => [code, ...r.filter((c) => c !== code)].slice(0, 5));
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Scan failed' });
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/dashboard/signin');
      return;
    }
    let cancelled = false;
    let qrScanner: { stop: () => void; destroy: () => void } | null = null;

    (async () => {
      try {
        const QrScannerMod = (await import('qr-scanner')).default;
        if (cancelled || !videoRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        qrScanner = new (QrScannerMod as any)(
          videoRef.current,
          (r: { data: string }) => handleCode(r.data),
          { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 4 },
        );
        scannerRef.current = qrScanner;
        await (qrScanner as unknown as { start: () => Promise<void> }).start();
        if (!cancelled) setScanning(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Camera unavailable');
      }
    })();

    return () => {
      cancelled = true;
      qrScanner?.stop();
      qrScanner?.destroy();
    };
  }, [handleCode, router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold">Scan tickets</h1>
      <p className="text-sm text-gray-400 mt-1">
        Point the camera at the QR on the ticket. Each ticket can only be scanned once.
      </p>

      <div className="mt-6 relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        {!scanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Requesting camera…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm px-4 text-center">
            {error}
          </div>
        )}
      </div>

      {result && <ResultBanner result={result} />}

      <ManualEntry onSubmit={handleCode} />

      {recent.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-wide text-gray-500">Recent</h2>
          <ul className="mt-2 space-y-1 text-sm font-mono text-gray-400">
            {recent.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ResultBanner({ result }: { result: ScanResult }) {
  if ('error' in result) {
    return (
      <div className="mt-4 rounded-lg p-4 bg-red-950 border border-red-800 text-red-200">
        <div className="font-semibold">Error</div>
        <div className="text-sm mt-1">{result.error}</div>
      </div>
    );
  }
  const { ok, reason, ticket } = result;
  if (ok) {
    return (
      <div className="mt-4 rounded-lg p-4 bg-green-950 border border-green-800">
        <div className="text-green-300 font-semibold text-lg">ADMIT</div>
        <div className="text-sm mt-1 text-green-200">
          {ticket.ticketTypeName} · {ticket.eventTitle}
        </div>
        <div className="text-xs mt-1 font-mono text-green-400">{ticket.code}</div>
      </div>
    );
  }
  const isVoided = reason === 'voided';
  const classes = isVoided
    ? 'bg-red-950 border-red-800 text-red-200'
    : 'bg-amber-950 border-amber-800 text-amber-200';
  const titleClass = isVoided ? 'text-red-300' : 'text-amber-300';
  const codeClass = isVoided ? 'text-red-400' : 'text-amber-400';
  const label = isVoided ? 'VOIDED' : 'ALREADY SCANNED';
  return (
    <div className={`mt-4 rounded-lg p-4 border ${classes}`}>
      <div className={`font-semibold text-lg ${titleClass}`}>{label}</div>
      <div className="text-sm mt-1">
        {ticket.ticketTypeName} · {ticket.eventTitle}
      </div>
      <div className={`text-xs mt-1 font-mono ${codeClass}`}>{ticket.code}</div>
    </div>
  );
}

function ManualEntry({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) {
          onSubmit(code.trim());
          setCode('');
        }
      }}
      className="mt-6 flex gap-2"
    >
      <input
        type="text"
        placeholder="Or type ticket code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm font-mono"
      />
      <button type="submit" className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md">
        Check
      </button>
    </form>
  );
}
