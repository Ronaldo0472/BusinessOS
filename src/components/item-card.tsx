import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/content";

export interface ItemCardData {
  slug: string;
  title: string;
  summary: string;
  status: Status;
}

export interface ItemCardProps {
  item: ItemCardData;
  href: string;
  /** Layout variant: "grid" renders a tall card, "list" a wide, shorter one. */
  view?: "grid" | "list";
}

const STATUS_LABEL: Record<Status, string> = {
  not_started: "Não iniciado",
  in_progress: "Em progresso",
  done: "Concluído",
};

const STATUS_VARIANT: Record<Status, "outline" | "secondary" | "default"> = {
  not_started: "outline",
  in_progress: "secondary",
  done: "default",
};

export function ItemCard({ item, href, view = "grid" }: ItemCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card
        className={cn(
          "h-full transition-colors duration-150 hover:bg-muted/50 dark:hover:bg-white/10",
          view === "list" && "py-4"
        )}
      >
        <CardHeader className="gap-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <Badge variant={STATUS_VARIANT[item.status]}>
              {STATUS_LABEL[item.status]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {item.summary}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
