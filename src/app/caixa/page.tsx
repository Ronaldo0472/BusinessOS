import { SectionGrid } from "@/components/section-grid";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { SECTION_LABELS, getSection } from "@/lib/content";

export const metadata = {
  title: "Caixa — BusinessOS",
};

interface CaixaPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function CaixaPage({ searchParams }: CaixaPageProps) {
  const { view: viewParam } = await searchParams;
  const view: ViewMode = viewParam === "list" ? "list" : "grid";
  const items = getSection("caixa");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {SECTION_LABELS.caixa}
          </h1>
          <p className="mt-1 text-muted-foreground">
            A saúde financeira do negócio: fluxo de caixa e operação administrativa.
          </p>
        </div>
        <ViewToggle value={view} />
      </div>

      <SectionGrid items={items} view={view} basePath="/caixa" />
    </div>
  );
}
