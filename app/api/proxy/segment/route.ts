import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get('base');
  const file = searchParams.get('file');

  if (!base || !file) {
    return new NextResponse('Missing base or file parameter', { status: 400 });
  }

  const segmentUrl = base + file;
  try {
    const response = await axios.get(segmentUrl, {
      headers: {
        "accept": "*/*",
        "Referer": "https://appx-play.akamai.net.in/"
      },
      responseType: 'stream'
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      }
    }

    // @ts-ignore
    return new NextResponse(response.data, {
      status: response.status,
      headers: headers,
    });
  } catch (err: any) {
    console.error('Error fetching segment:', err.message);
    return new NextResponse('Proxy error: ' + err.message, { status: 500 });
  }
}
