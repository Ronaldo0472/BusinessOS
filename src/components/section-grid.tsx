import { ItemCard, type ItemCardData } from "@/components/item-card";
import type { ViewMode } from "@/components/view-toggle";
import { cn } from "@/lib/utils";

export interface SectionGridProps {
  items: ItemCardData[];
  view: ViewMode;
  /** Base path used to build each item's detail link, e.g. "/founder". */
  basePath: string;
}

export function SectionGrid({ items, view, basePath }: SectionGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum item cadastrado nesta seção ainda.
      </p>
    );
  }

  return (
    <div
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-3"
      )}
    >
      {items.map((item) => (
        <ItemCard
          key={item.slug}
          item={item}
          href={`${basePath}/${item.slug}`}
          view={view}
        />
      ))}
    </div>
  );
}
