import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "accept": "*/*",
        "Referer": "https://appx-play.akamai.net.in/"
      }
    });

    const base = url.substring(0, url.lastIndexOf('/') + 1);
    
    // Rewrite segments to go through our proxy
    // /api/proxy/segment?base=...&file=...
    const playlist = response.data.replace(
      /^(?!#)([^\r\n]+)$/gm,
      (line: string) => {
        if (line.startsWith('http') || line.startsWith('#')) return line;
        return `/api/proxy/segment?base=${encodeURIComponent(base)}&file=${encodeURIComponent(line)}`;
      }
    );

    return new NextResponse(playlist, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Error fetching playlist:', err.message);
    return new NextResponse('Proxy error: ' + err.message, { status: 500 });
  }
}
