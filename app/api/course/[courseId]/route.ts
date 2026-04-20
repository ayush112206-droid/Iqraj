import { NextResponse } from 'next/server';

const STATIC_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMjcyNzQwIiwicm9sZSI6IlVTRVIiLCJJcC1BZGRyZXNzIjoiMTI3LjAuMC4xIiwiVXNlci1BZ2VudCI6IkFtYXpvbiBDbG91ZEZyb250IiwiaWF0IjoxNzc0OTQ0NzI0LCJ1c2VySWQiOiJzdHVkeS52MS5mYmNkMzIzNjBjZTM2MjEwYzJhZTYzYjljNWIzMjJmZCIsInBsYXRmb3JtIjoiV0VCIiwiaXNzdWVyIjoiYWRkYTI0Ny5jb20iLCJleHAiOjE4MDY0ODA3MjR9.g-GUM5uspfDywwP7S3zy2zlU6SvH20akdbyPZNtdE5mOStWcmpYNdV5ZJhHVufiFQP1Wn1FgIyHcr72iERDTog";

const IQ_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Platform": "WEB",
  "Authorization": STATIC_TOKEN,
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Referer": "https://www.studyiq.com/",
  "Origin": "https://www.studyiq.com",
};

const ENDPOINTS = [
  (id: string) => `https://backend.studyiq.net/app-content-ws/v2/course/getDetails?courseId=${id}`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/v1/course/getDetails?courseId=${id}&languageId=`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/v1/course/content?courseId=${id}`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/course/lectures?courseId=${id}`,
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  for (const makeUrl of ENDPOINTS) {
    try {
      const res = await fetch(makeUrl(courseId), {
        headers: IQ_HEADERS,
        next: { revalidate: 1800 },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const items = json.data ?? json.courseContent ?? json.lectures ?? [];
      if (Array.isArray(items) && items.length > 0) {
        return NextResponse.json({
          success: true,
          items,
          courseTitle: json.courseTitle ?? json.title ?? '',
        });
      }
    } catch { continue; }
  }

  return NextResponse.json({ success: false, items: [], courseTitle: '' }, { status: 404 });
}
