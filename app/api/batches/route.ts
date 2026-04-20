import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://raj-iq-api.onrender.com/api/batches', {
      next: { revalidate: 0 }, // Disable cache for debugging deployment
    });

    if (!res.ok) {
      console.error('Batches API failed with status:', res.status);
      const text = await res.text();
      console.error('Batches API response body:', text);
      return NextResponse.json({ data: [] }, { status: 500 });
    }
    
    const json = await res.json();
    // Sort by id descending
    const sorted = (json.data ?? []).sort((a: {id:number}, b: {id:number}) => b.id - a.id);
    return NextResponse.json({ success: true, data: sorted });
  } catch (error) {
    console.error('Batches API Error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
