import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fetchOEmbed } from '../../../lib/youtube';
import { fetchYouTubeTranscript, segmentsToPlainText } from '../../../lib/transcript';
import { generateClipsWithOpenAI } from '../../../lib/llm';

const Body = z.object({
  url: z.string().url(),
  transcript: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { url, transcript } = Body.parse(json);

    const [meta, segments] = await Promise.all([
      fetchOEmbed(url),
      transcript?.trim() ? Promise.resolve([]) : fetchYouTubeTranscript(url)
    ]);

    const transcriptText = transcript?.trim() || segmentsToPlainText(segments);

    if (!transcriptText) {
      return new Response('No transcript available. Paste transcript manually for best results.', { status: 422 });
    }

    const clips = await generateClipsWithOpenAI({
      transcriptWithTimestamps: transcriptText,
      videoTitle: meta?.title,
      videoAuthor: meta?.author_name
    });

    // Estimate duration from last timestamp if we have segments
    const estimatedDuration = segments.length ? Math.floor((segments[segments.length - 1].start || 0) + (segments[segments.length - 1].dur || 0)) : undefined;

    return Response.json({
      meta: {
        title: meta?.title,
        author_name: meta?.author_name,
        thumbnail_url: meta?.thumbnail_url,
        estimatedDuration
      },
      clips
    });
  } catch (e: any) {
    const msg = e?.message || 'Unexpected error';
    const status = msg.includes('OPENAI_API_KEY') ? 500 : 400;
    return new Response(msg, { status });
  }
}
