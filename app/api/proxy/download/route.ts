import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 3600; // Allow longer streams where supported

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const title = searchParams.get('title') || 'StudyIQ_Video';
  const targetBandwidth = searchParams.get('bandwidth');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const fetchHeaders = {
      "Accept": "*/*",
      "Referer": "https://appx-play.akamai.net.in/",
      "User-Agent": "Mozilla/5.0"
    };

    // 1. Fetch initial playlist
    let res = await fetch(url, { headers: fetchHeaders });
    if (!res.ok) throw new Error('Failed to fetch initial playlist');
    let text = await res.text();
    let baseUrl = new URL('.', url).toString();

    // 2. Resolve Master Playlist to Media Playlist
    if (text.includes('#EXT-X-STREAM-INF')) {
      const lines = text.split('\n');
      let highestBandwidth = 0;
      let selectedSubPlaylist = '';

      const targetBwNum = targetBandwidth ? parseInt(targetBandwidth, 10) : 0;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
          const match = lines[i].match(/BANDWIDTH=(\d+)/);
          const bw = match ? parseInt(match[1], 10) : 0;
          const nextLine = lines[i + 1]?.trim();
          
          if (nextLine && !nextLine.startsWith('#')) {
            // Match exactly if target provided, else fallback to max bandwidth
            if (targetBwNum > 0 && bw === targetBwNum) {
              selectedSubPlaylist = nextLine;
              break; 
            }
            if (targetBwNum === 0 && bw >= highestBandwidth) {
              highestBandwidth = bw;
              selectedSubPlaylist = nextLine;
            }
          }
        }
      }

      if (!selectedSubPlaylist && lines.length > 0) {
          // Fallback if specific bandwidth mismatch
          for (let i = 0; i < lines.length; i++) {
             if (lines[i].startsWith('#EXT-X-STREAM-INF') && lines[i + 1] && !lines[i + 1].startsWith('#')) {
                 selectedSubPlaylist = lines[i + 1].trim();
                 break;
             }
          }
      }

      if (selectedSubPlaylist) {
        const subUrl = new URL(selectedSubPlaylist, baseUrl).toString();
        res = await fetch(subUrl, { headers: fetchHeaders });
        if (!res.ok) throw new Error('Failed to fetch media playlist');
        text = await res.text();
        baseUrl = new URL('.', subUrl).toString();
      }
    }

    // 3. Extract TS segments
    const lines = text.split('\n');
    const segments: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        segments.push(new URL(trimmed, baseUrl).toString());
      }
    }

    if (segments.length === 0) {
      return new NextResponse('No video segments found in playlist', { status: 400 });
    }

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const fetchSegment = async (idx: number, retries = 3): Promise<Uint8Array | null> => {
      for (let i = 0; i < retries; i++) {
        try {
          const segRes = await fetch(segments[idx], { headers: fetchHeaders });
          if (!segRes.ok) continue;
          return new Uint8Array(await segRes.arrayBuffer());
        } catch (err) {
          if (i === retries - 1) return null;
        }
      }
      return null;
    };

    // Create a ReadableStream with high concurrency
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const concurrency = 10;
          let fetchIndex = 0;
          let yieldIndex = 0;
          const fetchMap = new Map<number, Promise<Uint8Array | null>>();

          while (yieldIndex < segments.length) {
            // Keep up to 'concurrency' fetches in flight
            while (fetchIndex < segments.length && fetchMap.size < concurrency) {
              fetchMap.set(fetchIndex, fetchSegment(fetchIndex));
              fetchIndex++;
            }

            // Await the strictly next segment in line
            const chunk = await fetchMap.get(yieldIndex);
            fetchMap.delete(yieldIndex);

            if (chunk) {
              controller.enqueue(chunk);
            } else {
              console.warn(`Segment ${yieldIndex} completely failed after retries. Skipping.`);
            }
            yieldIndex++;
          }
          controller.close();
        } catch (err) {
          console.error('Stream generation error:', err);
          controller.error(err);
        }
      }
    });

    const responseHeaders = new Headers({
      'Content-Type': 'video/mp2t',
      'Content-Disposition': `attachment; filename="${safeTitle}_full.ts"`,
      'Access-Control-Allow-Origin': '*'
    });

    return new NextResponse(stream, { headers: responseHeaders });
  } catch (err: any) {
    console.error('Download setup error:', err);
    return new NextResponse(`Download Error: ${err.message}`, { status: 500 });
  }
}
