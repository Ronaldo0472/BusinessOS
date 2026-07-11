import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/content-editor";
import { getItem } from "@/lib/content";

interface ValidacaoItemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ValidacaoItemPageProps) {
  const { slug } = await params;
  const item = getItem("validacao", slug);
  return { title: item ? `${item.title} — BusinessOS` : "BusinessOS" };
}

export default async function ValidacaoItemPage({ params }: ValidacaoItemPageProps) {
  const { slug } = await params;
  const item = getItem("validacao", slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Validação</p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>

      <ContentEditor section="validacao" slug={slug} item={item} />
    </div>
  );
}
