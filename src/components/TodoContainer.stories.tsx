import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, waitFor } from "@storybook/testing-library";
import TodoAppContainer from "./TodoAppContainer";
import { expect } from "@storybook/test";

const meta: Meta<typeof TodoAppContainer> = {
  title: "Todo/TodoAppContainer",
  component: TodoAppContainer,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof TodoAppContainer>;

export const AddTodos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);
    await waitFor(() => {
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
    });

    await userEvent.type(input, "Do laundry{enter}");
    await waitFor(() => {
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });
  },
};

export const ToggleCompletion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add todos
    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /add/i });
    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);
    await userEvent.type(input, "Do laundry{enter}");

    // Toggle "Buy milk"
    const buyMilkCheckbox = await canvas.findByLabelText("Toggle Buy milk");
    const doLaundryCheckbox = await canvas.findByLabelText("Toggle Do laundry");
    await userEvent.click(buyMilkCheckbox);

    await waitFor(() => {
      expect(buyMilkCheckbox).toBeChecked();
      expect(doLaundryCheckbox).not.toBeChecked();
    });
  },
};

export const FilterTodos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add and toggle
    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /add/i });
    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);
    await userEvent.type(input, "Do laundry{enter}");
    await userEvent.click(canvas.getByLabelText("Toggle Buy milk"));

    // Click Active
    await userEvent.click(canvas.getByRole("button", { name: /Active/i }));
    await waitFor(() => {
      expect(canvas.queryByText("Buy milk")).not.toBeInTheDocument();
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });

    // Click Completed
    await userEvent.click(canvas.getByRole("button", { name: /Completed/i }));
    await waitFor(() => {
      expect(canvas.queryByText("Do laundry")).not.toBeInTheDocument();
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
    });

    // Click All
    await userEvent.click(canvas.getByRole("button", { name: /All/i }));
    await waitFor(() => {
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });
  },
};

export const SortTodos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /^add$/i });

    // Add todos
    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);

    await userEvent.type(input, "Do laundry{enter}");

    // Find the sort toggle button (not the label)
    const toggleSortButton = canvas.getByRole("button", { name: /toggle sort/i });

    // Newest first => "Do laundry" should be at the top
    await waitFor(() => {
      const items = canvas.getAllByRole("listitem");
      const firstText = within(items[0]).getByText("Do laundry");
      expect(firstText).toBeInTheDocument();
    });

    // Click toggle => should now be ascending: "Buy milk" comes first
    await userEvent.click(toggleSortButton);

    await waitFor(() => {
      const items = canvas.getAllByRole("listitem");
      const firstText = within(items[0]).getByText("Buy milk");
      expect(firstText).toBeInTheDocument();
    });
  },
};

