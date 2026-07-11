"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveItemAction } from "@/lib/actions";
import type { ContentItem, Status } from "@/lib/content";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "not_started", label: "Não iniciado" },
  { value: "in_progress", label: "Em progresso" },
  { value: "done", label: "Concluído" },
];

export interface ContentEditorProps {
  section: string;
  slug: string;
  item: ContentItem;
}

export function ContentEditor({ section, slug, item }: ContentEditorProps) {
  const [title, setTitle] = useState(item.title);
  const [summary, setSummary] = useState(item.summary);
  const [status, setStatus] = useState<Status>(item.status);
  const [tags, setTags] = useState(item.tags.join(", "));
  const [aiContext, setAiContext] = useState(item.ai_context);
  const [body, setBody] = useState(item.body);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await saveItemAction({
          section,
          slug,
          frontmatter: {
            title,
            summary,
            status,
            ai_context: aiContext,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          },
          body,
        });
        toast.success("Alterações salvas.");
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível salvar. Tente novamente.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="summary">Resumo</Label>
          <Input
            id="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ai-context">Contexto para IA</Label>
          <div className="flex h-9 items-center gap-2">
            <Switch
              id="ai-context"
              checked={aiContext}
              onCheckedChange={setAiContext}
            />
            <span className="text-sm text-muted-foreground">
              {aiContext ? "Incluído no contexto" : "Fora do contexto"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="body">Conteúdo</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-72 font-mono text-sm"
        />
      </div>

      <div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
