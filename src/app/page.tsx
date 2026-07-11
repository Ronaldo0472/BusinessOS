import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SECTIONS, SECTION_LABELS, getSection } from "@/lib/content";

const SECTION_DESCRIPTIONS: Record<string, string> = {
  founder: "Motivação, objetivo e estilo de vida por trás do negócio.",
  direcao: "Visão de longo prazo e as grandes apostas estratégicas.",
  validacao: "Hipóteses, experimentos e evidências de mercado.",
  caixa: "Saúde financeira, fluxo de caixa e sustentabilidade.",
};

export default function Home() {
  const sections = SECTIONS.map((section) => ({
    section,
    label: SECTION_LABELS[section],
    description: SECTION_DESCRIPTIONS[section],
    count: getSection(section).length,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">BusinessOS</h1>
        <p className="mt-1 text-muted-foreground">
          Painel de gestão pessoal e estratégica do negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(({ section, label, description, count }) => (
          <Link key={section} href={`/${section}`} className="block h-full">
            <Card className="h-full transition-colors duration-150 hover:bg-muted/50 dark:hover:bg-white/10">
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{label}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {count} {count === 1 ? "item" : "itens"}
                  </span>
                </div>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
