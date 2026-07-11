import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/content-editor";
import { getItem } from "@/lib/content";

interface DirecaoItemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DirecaoItemPageProps) {
  const { slug } = await params;
  const item = getItem("direcao", slug);
  return { title: item ? `${item.title} — BusinessOS` : "BusinessOS" };
}

export default async function DirecaoItemPage({ params }: DirecaoItemPageProps) {
  const { slug } = await params;
  const item = getItem("direcao", slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Direção</p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>

      <ContentEditor section="direcao" slug={slug} item={item} />
    </div>
  );
}
