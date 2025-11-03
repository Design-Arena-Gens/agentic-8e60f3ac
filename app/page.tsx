"use client";

import { useMemo, useState } from 'react';
import AnalyzerForm from '../components/AnalyzerForm';
import Results from '../components/Results';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async (payload: { url: string; transcript?: string | null }) => {
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed');
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const header = useMemo(() => (
    <div className="container" style={{ paddingTop: 28 }}>
      <div className="card">
        <h1 style={{ margin: 0, fontSize: 28 }}>Viral Shorts Generator</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Paste a YouTube URL. Optionally include a transcript. We will detect the most viral short clips and generate emotionally engaging titles, watch-time boosting descriptions, and viral tags for YouTube Shorts and Instagram Reels.
        </p>
        <AnalyzerForm onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <div className="card" style={{ marginTop: 12, borderColor: '#ef4444' }}>
            <div style={{ color: '#fecaca' }}>{error}</div>
          </div>
        )}
      </div>
    </div>
  ), [loading, error]);

  return (
    <>
      {header}
      <div className="container">
        {data && <Results result={data} />}
      </div>
    </>
  );
}
