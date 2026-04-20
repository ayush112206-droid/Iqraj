import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const fetchHeaders = {
      "Accept": "*/*",
      "Referer": "https://appx-play.akamai.net.in/",
      "User-Agent": "Mozilla/5.0"
    };

    const res = await fetch(url, { headers: fetchHeaders });
    if (!res.ok) throw new Error('Failed to fetch master playlist');
    const text = await res.text();

    const qualities = [];

    if (text.includes('#EXT-X-STREAM-INF')) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
          const bwMatch = lines[i].match(/BANDWIDTH=(\d+)/);
          const resMatch = lines[i].match(/RESOLUTION=(\d+x\d+)/);
          const bandwidth = bwMatch ? parseInt(bwMatch[1], 10) : 0;
          const resolution = resMatch ? resMatch[1] : 'Auto';
          const height = resolution !== 'Auto' ? parseInt(resolution.split('x')[1], 10) : 0;
          const streamUrl = lines[i + 1]?.trim();

          if (streamUrl && !streamUrl.startsWith('#')) {
            qualities.push({
              bandwidth,
              resolution,
              height,
              streamUrl
            });
          }
        }
      }
    }

    // Sort descending by height, then bandwidth
    qualities.sort((a, b) => b.height - a.height || b.bandwidth - a.bandwidth);

    // Remove direct duplicates (same height and bandwidth)
    const uniqueQualities = qualities.filter((q, index, self) =>
      index === self.findIndex((t) => (
        t.height === q.height && t.bandwidth === q.bandwidth
      ))
    );

    // Estimate file sizes by calculating total video duration
    let estimatedDuration = 0;
    if (uniqueQualities.length > 0) {
      try {
        const sampleQuality = uniqueQualities[uniqueQualities.length - 1];
        let mediaUrl = sampleQuality.streamUrl;
        if (!mediaUrl.startsWith('http')) {
           mediaUrl = new URL(mediaUrl, new URL('.', url).toString()).toString();
        }
        const mediaRes = await fetch(mediaUrl, { headers: fetchHeaders });
        if (mediaRes.ok) {
          const mediaText = await mediaRes.text();
          const extinfMatches = mediaText.match(/#EXTINF:([\d.]+)/g);
          if (extinfMatches) {
            for (const match of extinfMatches) {
              const val = parseFloat(match.replace('#EXTINF:', ''));
              if (!isNaN(val)) estimatedDuration += val;
            }
          }
        }
      } catch (e) {
        console.error('Error fetching sample media playlist for duration', e);
      }
    }

    const qualitiesWithSize = uniqueQualities.map(q => {
      let estimatedSizeMB = 0;
      if (estimatedDuration > 0 && q.bandwidth > 0) {
        const sizeBytes = (q.bandwidth * estimatedDuration) / 8;
        estimatedSizeMB = sizeBytes / (1024 * 1024);
      }
      return { ...q, estimatedSizeMB };
    });

    return NextResponse.json({ success: true, qualities: qualitiesWithSize });
  } catch (err: any) {
    console.error('Error parsing qualities:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
