import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://raj-iq-api.onrender.com/api/batches', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ data: [] }, { status: 500 });
    const json = await res.json();
    // Sort by id descending
    const sorted = (json.data ?? []).sort((a: {id:number}, b: {id:number}) => b.id - a.id);
    return NextResponse.json({ success: true, data: sorted });
  } catch (error) {
    console.error('Batches API Error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
