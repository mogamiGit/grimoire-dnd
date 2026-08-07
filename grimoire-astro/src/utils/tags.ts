import { getCollection } from 'astro:content';

export interface TaggedDoc {
  id: string;
  title: string;
  slug: string;
  tags: string[];
}

/** Get all docs with their tags */
export async function getAllTaggedDocs(): Promise<TaggedDoc[]> {
  const allDocs = await getCollection('docs');
  return allDocs
    .filter((doc) => {
      const tags = doc.data.tags as string[] | undefined;
      return Array.isArray(tags) && tags.length > 0;
    })
    .map((doc) => ({
      id: doc.id,
      title: (doc.data.title as string) ?? doc.id,
      slug: doc.id,
      tags: doc.data.tags as string[],
    }));
}

/** Map of tag → docs that have it */
export async function getTagMap(): Promise<Map<string, TaggedDoc[]>> {
  const docs = await getAllTaggedDocs();
  const map = new Map<string, TaggedDoc[]>();

  for (const doc of docs) {
    for (const tag of doc.tags) {
      const existing = map.get(tag) ?? [];
      existing.push(doc);
      map.set(tag, existing);
    }
  }

  // Sort docs within each tag alphabetically
  for (const [, docs] of map) {
    docs.sort((a, b) => a.title.localeCompare(b.title, 'es'));
  }

  return map;
}

/** Get all unique tags sorted */
export async function getAllTags(): Promise<string[]> {
  const tagMap = await getTagMap();
  return [...tagMap.keys()].sort((a, b) => a.localeCompare(b, 'es'));
}

/** Group tags by category prefix (part before /) */
export function groupTagsByCategory(tags: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const tag of tags) {
    const slashIndex = tag.indexOf('/');
    const category = slashIndex !== -1 ? tag.substring(0, slashIndex) : '_uncategorized';
    const existing = groups.get(category) ?? [];
    existing.push(tag);
    groups.set(category, existing);
  }

  return groups;
}
