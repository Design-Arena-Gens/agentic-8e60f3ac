"use client";

import { useMemo, useState } from 'react';

export default function AnalyzerForm({ onAnalyze, loading }: { onAnalyze: (p: { url: string; transcript?: string | null }) => void; loading: boolean }) {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');

  const disabled = useMemo(() => loading || !url.trim(), [loading, url]);

  return (
    <div style={{ marginTop: 16 }}>
      <label className="label">YouTube URL</label>
      <input className="input" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={e => setUrl(e.target.value)} />

      <div style={{ height: 12 }} />
      <label className="label">Transcript (optional, improves accuracy)</label>
      <textarea className="input" rows={6} placeholder="Paste full transcript here if available" value={transcript} onChange={e => setTranscript(e.target.value)} />

      <div className="row" style={{ marginTop: 12 }}>
        <button disabled={disabled} className="button" onClick={() => onAnalyze({ url, transcript: transcript.trim() || undefined })}>
          {loading ? 'Analyzing?' : 'Analyze Video'}
        </button>
        <button type="button" className="button secondary" onClick={() => { setUrl(''); setTranscript(''); }}>
          Reset
        </button>
      </div>
      <p className="small" style={{ marginTop: 8 }}>
        Tip: Include key keywords and topics you care about inside the transcript box to bias the generator.
      </p>
    </div>
  );
}
