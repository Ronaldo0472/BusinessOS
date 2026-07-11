import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/content-editor";
import { getItem } from "@/lib/content";

interface FounderItemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FounderItemPageProps) {
  const { slug } = await params;
  const item = getItem("founder", slug);
  return { title: item ? `${item.title} — BusinessOS` : "BusinessOS" };
}

export default async function FounderItemPage({ params }: FounderItemPageProps) {
  const { slug } = await params;
  const item = getItem("founder", slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Founder</p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>

      <ContentEditor section="founder" slug={slug} item={item} />
    </div>
  );
}
