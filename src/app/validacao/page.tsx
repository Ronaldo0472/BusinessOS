import { SectionGrid } from "@/components/section-grid";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { SECTION_LABELS, getSection } from "@/lib/content";

export const metadata = {
  title: "Validação — BusinessOS",
};

interface ValidacaoPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function ValidacaoPage({ searchParams }: ValidacaoPageProps) {
  const { view: viewParam } = await searchParams;
  const view: ViewMode = viewParam === "list" ? "list" : "grid";
  const items = getSection("validacao");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {SECTION_LABELS.validacao}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Testando a oferta no mercado real: o que foi ajustado e o que os
            primeiros clientes ensinaram.
          </p>
        </div>
        <ViewToggle value={view} />
      </div>

      <SectionGrid items={items} view={view} basePath="/validacao" />
    </div>
  );
}
