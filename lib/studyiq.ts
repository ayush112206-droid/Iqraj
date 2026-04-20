export const STATIC_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMjcyNzQwIiwicm9sZSI6IlVTRVIiLCJJcC1BZGRyZXNzIjoiMTI3LjAuMC4xIiwiVXNlci1BZ2VudCI6IkFtYXpvbiBDbG91ZEZyb250IiwiaWF0IjoxNzc0OTQ0NzI0LCJ1c2VySWQiOiJzdHVkeS52MS5mYmNkMzIzNjBjZTM2MjEwYzJhZTYzYjljNWIzMjJmZCIsInBsYXRmb3JtIjoiV0VCIiwiaXNzdWVyIjoiYWRkYTI0Ny5jb20iLCJleHAiOjE4MDY0ODA3MjR9.g-GUM5uspfDywwP7S3zy2zlU6SvH20akdbyPZNtdE5mOStWcmpYNdV5ZJhHVufiFQP1Wn1FgIyHcr72iERDTog";

export const CONTENT_ENDPOINTS = [
  (id: string) => `https://backend.studyiq.net/app-content-ws/v2/course/getDetails?courseId=${id}`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/v1/course/getDetails?courseId=${id}&languageId=`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/v1/course/content?courseId=${id}`,
  (id: string) => `https://backend.studyiq.net/app-content-ws/course/lectures?courseId=${id}`,
];

export const IQ_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Platform": "WEB",
  "Authorization": STATIC_TOKEN,
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Referer": "https://www.studyiq.com/",
  "Origin": "https://www.studyiq.com",
};

export interface ContentItem {
  id?: string | number;
  name?: string;
  title?: string;
  parentTitle?: string;
  videoUrl?: string;
  video_url?: string;
  textUploadUrl?: string;
  pdfUrl?: string;
  contentId?: string;
}

export interface Subject {
  name: string;        // from parentTitle field
  videos: ContentItem[];
  pdfs: ContentItem[];
}

export interface Batch {
  id: number;
  title: string;
  price: string;
  mrp: string;
  validity: string;
}

export async function fetchCourseContent(courseId: string): Promise<{items: ContentItem[], courseTitle: string}> {
  // This is intended to be called from the server or API routes
  for (const makeUrl of CONTENT_ENDPOINTS) {
    try {
      const res = await fetch(makeUrl(courseId), { headers: IQ_HEADERS });
      if (!res.ok) continue;
      const data = await res.json();
      const items: ContentItem[] = data.data ?? data.courseContent ?? data.lectures ?? [];
      if (items.length > 0) {
        return { items, courseTitle: data.courseTitle ?? data.title ?? "" };
      }
    } catch { continue; }
  }
  return { items: [], courseTitle: "" };
}

export function parseSubjects(items: ContentItem[]): Subject[] {
  if (!items.length) return [];

  const subjectNames: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const subj = item.parentTitle || "General";
    if (!seen.has(subj)) {
      seen.add(subj);
      subjectNames.push(subj);
    }
  }

  return subjectNames.map(name => {
    const subjectItems = items.filter(i => (i.parentTitle || "General") === name);
    return {
      name,
      videos: subjectItems.filter(i => i.videoUrl || i.video_url),
      pdfs:   subjectItems.filter(i => i.textUploadUrl || i.pdfUrl),
    };
  }).filter(s => s.videos.length > 0 || s.pdfs.length > 0);
}

export function getVideoUrl(item: ContentItem): string {
  return item.videoUrl || item.video_url || "";
}

export function getPdfUrl(item: ContentItem): string {
  return item.textUploadUrl || item.pdfUrl || "";
}

export function getItemName(item: ContentItem): string {
  return item.name || item.title || "Untitled";
}
