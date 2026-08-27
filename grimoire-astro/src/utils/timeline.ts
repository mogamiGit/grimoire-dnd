import { getCollection } from 'astro:content';

export interface MarkerEvent {
  type: 'death' | 'disappearance';
  date: Date;
  title: string;
  href: string;
  location?: string;
  cause?: string;
}

export interface DiaryEntry {
  date: Date;
  label: string;
  title: string;
  href: string;
  campaignDay?: number;
  location?: string;
  markers: MarkerEvent[];
}

function isDiary(doc: { id: string; data: Record<string, unknown> }): boolean {
  const tags = doc.data.tags as string[] | undefined;
  return (
    Array.isArray(tags) &&
    tags.includes('diary') &&
    doc.id.startsWith('notes/diario/') &&
    !doc.id.endsWith('/index.mdx') &&
    !doc.id.endsWith('/index.md')
  );
}

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() >= 2000;
}

function docHref(id: string): string {
  const slug = id.replace(/\.(mdx?|md)$/, '');
  return `/${slug}/`;
}

function dateToISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getTimeline(): Promise<DiaryEntry[]> {
  const allDocs = await getCollection('docs');
  const entries: DiaryEntry[] = [];
  const markers: MarkerEvent[] = [];

  for (const doc of allDocs) {
    const data = doc.data as Record<string, unknown>;

    if (isDiary(doc)) {
      const date = data.date;
      if (!isValidDate(date)) continue;
      entries.push({
        date,
        label: date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: (data.title as string) ?? doc.id,
        href: docHref(doc.id),
        campaignDay: data.campaign_day as number | undefined,
        location: data.location as string | undefined,
        markers: [],
      });
    }

    if (data.status === 'muerto' && isValidDate(data.death_date)) {
      markers.push({
        type: 'death',
        date: data.death_date,
        title: (data.title as string) ?? doc.id,
        href: docHref(doc.id),
        location: data.death_location as string | undefined,
        cause: data.death_cause as string | undefined,
      });
    }

    if (data.status === 'desaparecido' && isValidDate(data.disappearance_date)) {
      markers.push({
        type: 'disappearance',
        date: data.disappearance_date,
        title: (data.title as string) ?? doc.id,
        href: docHref(doc.id),
        location: data.disappearance_location as string | undefined,
      });
    }
  }

  for (const marker of markers) {
    const key = dateToISO(marker.date);
    entries.find((e) => dateToISO(e.date) === key)?.markers.push(marker);
  }

  return entries.sort((a, b) => a.date.getTime() - b.date.getTime());
}
