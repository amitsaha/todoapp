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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /add/i });

    // Add "Buy milk"
    await userEvent.clear(input);
    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);
    await waitFor(() => {
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
    });

    // Add "Do laundry"
    await userEvent.type(input, "Do laundry{enter}");
    await waitFor(() => {
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });

    // Mark "Buy milk" as completed
    const buyMilkCheckbox = canvas.getByLabelText("Toggle Buy milk");
    const doLaundryCheckbox = canvas.getByLabelText("Toggle Do laundry");
    await userEvent.click(buyMilkCheckbox);

    await waitFor(() => {
      expect(buyMilkCheckbox).toBeChecked();
      expect(doLaundryCheckbox).not.toBeChecked();
    });

    // --- FILTER TESTS ---
    const allBtn = canvas.getByRole("button", { name: /All/i });
    const activeBtn = canvas.getByRole("button", { name: /Active/i });
    const completedBtn = canvas.getByRole("button", { name: /Completed/i });

    // Show only active tasks
    await userEvent.click(activeBtn);
    await waitFor(() => {
      expect(canvas.queryByText("Buy milk")).not.toBeInTheDocument();
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });

    // Show only completed tasks
    await userEvent.click(completedBtn);
    await waitFor(() => {
      expect(canvas.queryByText("Do laundry")).not.toBeInTheDocument();
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
    });

    // Show all tasks
    await userEvent.click(allBtn);
    await waitFor(() => {
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });

    // --- SORTING TESTS ---
    const sortBtn = canvas.getByRole("button", { name: /Sort:/i });

    // Default is "Newest First" => "Do laundry" first
    await waitFor(() => {
      const items = canvas.getAllByRole("listitem");
      const firstText = within(items[0]).getByText(/Do laundry/).textContent;
      expect(firstText).toContain("Do laundry");
    });

    // Toggle to ascending (oldest first) => "Buy milk" should now be first
    await userEvent.click(sortBtn);
    await waitFor(() => {
      const items = canvas.getAllByRole("listitem");
      const firstText = within(items[0]).getByText(/Buy milk/).textContent;
      expect(firstText).toContain("Buy milk");
    });
  },
};
