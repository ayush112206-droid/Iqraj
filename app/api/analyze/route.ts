import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'analyzer.py');
    exec(`python3 "${scriptPath}" "${url}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        resolve(NextResponse.json({ error: 'Analysis failed' }, { status: 500 }));
        return;
      }
      try {
        const result = JSON.parse(stdout);
        resolve(NextResponse.json(result));
      } catch (e) {
        resolve(NextResponse.json({ error: 'Failed to parse analyzer output' }, { status: 500 }));
      }
    });
  });
}
