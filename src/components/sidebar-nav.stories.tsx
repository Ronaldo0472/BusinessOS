import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarNav, type SidebarNavGroup } from "./sidebar-nav";

const mockGroups: SidebarNavGroup[] = [
  {
    section: "founder",
    label: "Founder",
    href: "/founder",
    items: [
      { slug: "objetivo", title: "Objetivo", href: "/founder/objetivo" },
      {
        slug: "estilo-de-vida",
        title: "Estilo de vida",
        href: "/founder/estilo-de-vida",
      },
    ],
  },
  {
    section: "direcao",
    label: "Direção",
    href: "/direcao",
    items: [
      { slug: "visao", title: "Visão de longo prazo", href: "/direcao/visao" },
    ],
  },
  {
    section: "validacao",
    label: "Validação",
    href: "/validacao",
    items: [],
  },
  {
    section: "caixa",
    label: "Caixa",
    href: "/caixa",
    items: [],
  },
];

const meta: Meta<typeof SidebarNav> = {
  title: "Components/SidebarNav",
  component: SidebarNav,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    groups: mockGroups,
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SidebarNav>;

export const Default: Story = {};
