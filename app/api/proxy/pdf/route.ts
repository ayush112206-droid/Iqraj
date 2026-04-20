import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const forwardHeaders: any = {
      accept: req.headers.get('accept') || 'application/pdf,application/octet-stream,*/*',
      referer: 'https://appx-play.akamai.net.in/',
      'user-agent': req.headers.get('user-agent') || 'Mozilla/5.0',
    };

    const range = req.headers.get('range');
    if (range) {
      forwardHeaders.Range = range;
    }

    const upstream = await axios.get(url, {
      headers: forwardHeaders,
      responseType: 'stream',
      validateStatus: (status) => status < 400
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    
    const incomingHeaders = upstream.headers || {};
    headers.set('content-type', (incomingHeaders['content-type'] as string) || 'application/pdf');
    if (incomingHeaders['content-length']) headers.set('content-length', incomingHeaders['content-length'] as string);
    if (incomingHeaders['accept-ranges']) headers.set('accept-ranges', incomingHeaders['accept-ranges'] as string);
    if (incomingHeaders['content-range']) headers.set('content-range', incomingHeaders['content-range'] as string);
    if (incomingHeaders['last-modified']) headers.set('last-modified', incomingHeaders['last-modified'] as string);
    if (incomingHeaders['etag']) headers.set('etag', incomingHeaders['etag'] as string);

    headers.set('content-disposition', 'inline; filename="document.pdf"');

    // @ts-ignore
    return new NextResponse(upstream.data, {
      status: upstream.status,
      headers: headers,
    });
  } catch (err: any) {
    console.error('Error fetching PDF:', err.message);
    return new NextResponse('Proxy error: ' + err.message, { status: 500 });
  }
}
