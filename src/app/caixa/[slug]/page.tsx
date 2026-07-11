import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/content-editor";
import { getItem } from "@/lib/content";

interface CaixaItemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaixaItemPageProps) {
  const { slug } = await params;
  const item = getItem("caixa", slug);
  return { title: item ? `${item.title} — BusinessOS` : "BusinessOS" };
}

export default async function CaixaItemPage({ params }: CaixaItemPageProps) {
  const { slug } = await params;
  const item = getItem("caixa", slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Caixa</p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>

      <ContentEditor section="caixa" slug={slug} item={item} />
    </div>
  );
}
