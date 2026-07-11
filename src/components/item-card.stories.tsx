import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ItemCard } from "./item-card";

const meta: Meta<typeof ItemCard> = {
  title: "Components/ItemCard",
  component: ItemCard,
  parameters: {
    layout: "padded",
  },
  args: {
    href: "/founder/objetivo",
  },
};

export default meta;

type Story = StoryObj<typeof ItemCard>;

export const NotStarted: Story = {
  args: {
    view: "grid",
    item: {
      slug: "objetivo",
      title: "Objetivo",
      summary:
        "A motivação pessoal por trás deste negócio — por que ele existe e para quem.",
      status: "not_started",
    },
  },
};

export const InProgress: Story = {
  args: {
    view: "grid",
    item: {
      slug: "estilo-de-vida",
      title: "Estilo de vida",
      summary:
        "O estilo de vida que você busca viver através deste negócio — rotina, liberdade, geografia, tempo.",
      status: "in_progress",
    },
  },
};

export const Done: Story = {
  args: {
    view: "grid",
    item: {
      slug: "visao",
      title: "Visão de longo prazo",
      summary: "Onde este negócio deve estar em 5 anos.",
      status: "done",
    },
  },
};

export const ListView: Story = {
  args: {
    view: "list",
    item: {
      slug: "objetivo",
      title: "Objetivo",
      summary:
        "A motivação pessoal por trás deste negócio — por que ele existe e para quem.",
      status: "not_started",
    },
  },
};
