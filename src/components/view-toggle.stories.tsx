import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ViewToggle } from "./view-toggle";

const meta: Meta<typeof ViewToggle> = {
  title: "Components/ViewToggle",
  component: ViewToggle,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ViewToggle>;

export const Grid: Story = {
  args: {
    value: "grid",
  },
};

export const List: Story = {
  args: {
    value: "list",
  },
};
