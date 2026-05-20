import Link from 'next/link';

export const metadata = {
  title: 'Scanner — Computicket Nigeria',
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/scan" className="font-bold">
            Computicket<span className="text-gray-500">.ng</span>{' '}
            <span className="ml-1 text-xs uppercase tracking-wide text-gray-500">Scanner</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
