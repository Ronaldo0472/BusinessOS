import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const SECTIONS = ["founder", "direcao", "validacao", "caixa"] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  founder: "Founder",
  direcao: "Direção",
  validacao: "Validação",
  caixa: "Caixa",
};

export type Status = "not_started" | "in_progress" | "done";

export const STATUS_LABELS: Record<Status, string> = {
  not_started: "Não iniciado",
  in_progress: "Em progresso",
  done: "Concluído",
};

export interface ContentFrontmatter {
  title: string;
  slug: string;
  section: Section;
  status: Status;
  updated_at: string;
  ai_context: boolean;
  summary: string;
  tags: string[];
  order: number;
}

export interface ContentItem extends ContentFrontmatter {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function sectionDir(section: string): string {
  return path.join(CONTENT_DIR, section);
}

function normalizeFrontmatter(
  raw: Record<string, unknown>,
  fallbackSlug: string,
  fallbackSection: string
): ContentFrontmatter {
  return {
    title: typeof raw.title === "string" ? raw.title : fallbackSlug,
    slug: typeof raw.slug === "string" ? raw.slug : fallbackSlug,
    section: (typeof raw.section === "string" ? raw.section : fallbackSection) as Section,
    status: (typeof raw.status === "string" ? raw.status : "not_started") as Status,
    updated_at:
      typeof raw.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
    ai_context: typeof raw.ai_context === "boolean" ? raw.ai_context : false,
    summary: typeof raw.summary === "string" ? raw.summary : "",
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    order: typeof raw.order === "number" ? raw.order : 0,
  };
}

/**
 * Reads every markdown item inside content/{section}/ and returns their
 * parsed frontmatter (without the markdown body, which is not needed for
 * listing views).
 */
export function getSection(section: string): ContentItem[] {
  const dir = sectionDir(section);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith(".md"));

  const items = files.map((file) => {
    const slug = file.replace(/\.md$/i, "");
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = normalizeFrontmatter(data, slug, section);
    return { ...frontmatter, body: content.trim() };
  });

  return items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

/**
 * Reads a single content item (frontmatter + raw markdown body).
 * Returns null when the file does not exist.
 */
export function getItem(section: string, slug: string): ContentItem | null {
  const fullPath = path.join(sectionDir(section), `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = normalizeFrontmatter(data, slug, section);

  return { ...frontmatter, body: content.trim() };
}

export interface SaveItemInput {
  frontmatter: Partial<ContentFrontmatter>;
  body: string;
}

/**
 * Rewrites content/{section}/{slug}.md with the given frontmatter + body,
 * always refreshing `updated_at` to the current timestamp.
 */
export async function saveItem(
  section: string,
  slug: string,
  data: SaveItemInput
): Promise<void> {
  const dir = sectionDir(section);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fullPath = path.join(dir, `${slug}.md`);

  const existing = fs.existsSync(fullPath)
    ? matter(fs.readFileSync(fullPath, "utf8")).data
    : {};

  const merged = normalizeFrontmatter(
    { ...existing, ...data.frontmatter, section, slug },
    slug,
    section
  );

  merged.updated_at = new Date().toISOString();

  const file = matter.stringify(data.body ?? "", merged);
  fs.writeFileSync(fullPath, file, "utf8");
}
