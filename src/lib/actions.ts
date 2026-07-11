"use server";

import { revalidatePath } from "next/cache";
import { saveItem, type ContentFrontmatter } from "@/lib/content";

export interface SaveItemActionInput {
  section: string;
  slug: string;
  frontmatter: Partial<ContentFrontmatter>;
  body: string;
}

/**
 * Server Action used by the ContentEditor client component to persist
 * edits to a content item's markdown file on disk.
 */
export async function saveItemAction(input: SaveItemActionInput): Promise<{ ok: true }> {
  const { section, slug, frontmatter, body } = input;

  await saveItem(section, slug, { frontmatter, body });

  revalidatePath(`/${section}`);
  revalidatePath(`/${section}/${slug}`);

  return { ok: true };
}
