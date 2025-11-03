"use client";

import { marked } from 'marked';

function fmtTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function Results({ result }: { result: any }) {
  const { meta, clips } = result;

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="small">Analyzed</div>
          <h3 style={{ margin: '4px 0 0 0' }}>{meta?.title || 'YouTube Video'}</h3>
          <div className="small">by {meta?.author_name || 'Unknown'} ? estimated duration {meta?.estimatedDuration ? fmtTime(meta.estimatedDuration) : '?'}</div>
        </div>
        {meta?.thumbnail_url && (
          <img src={meta.thumbnail_url} alt="thumbnail" style={{ width: 160, height: 'auto', borderRadius: 12, border: '1px solid var(--border)' }} />
        )}
      </div>

      <hr />

      <div className="grid">
        {clips?.map((clip: any, idx: number) => (
          <div key={idx} className="clip">
            <div className="small">Clip {idx + 1}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <h4 style={{ margin: '4px 0' }}>{clip.title}</h4>
              <div className="badge time">{fmtTime(clip.start)} ? {fmtTime(clip.end)} ({fmtTime(clip.end - clip.start)})</div>
            </div>
            <div className="small" style={{ margin: '6px 0 8px 0' }}>
              <span className="badge">emotion: {clip.emotion || '?'}</span>
              <span className="badge">hook: {clip.hookScore || '?'}</span>
              <span className="badge">share: {clip.shareability || '?'}</span>
            </div>
            <div style={{ color: '#cbd5e1' }} dangerouslySetInnerHTML={{ __html: marked.parse(clip.description || '') as string }} />
            <div style={{ marginTop: 10 }}>
              {(clip.tags || []).map((t: string) => (
                <span key={t} className="badge">#{t}</span>
              ))}
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="button secondary" onClick={() => navigator.clipboard.writeText(clip.title)}>Copy Title</button>
              <button className="button secondary" onClick={() => navigator.clipboard.writeText(clip.description)}>Copy Description</button>
              <button className="button secondary" onClick={() => navigator.clipboard.writeText((clip.tags || []).join(', '))}>Copy Tags</button>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="button" onClick={() => {
          const blob = new Blob([JSON.stringify({ meta, clips }, null, 2)], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'viral_shorts.json';
          a.click();
        }}>Download JSON</button>
        <button className="button secondary" onClick={() => {
          const csvRows = [
            ['start','end','title','description','tags'].join(',')
          ];
          for (const c of clips || []) {
            const row = [c.start, c.end, c.title, (c.description||'').replace(/\n/g,' '), (c.tags||[]).join('|')]
              .map(v => `"${String(v).replace(/"/g,'\"')}"`).join(',');
            csvRows.push(row);
          }
          const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'viral_shorts.csv';
          a.click();
        }}>Download CSV</button>
      </div>
    </div>
  );
}
