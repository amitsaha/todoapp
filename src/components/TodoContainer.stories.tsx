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

    // Add a todo item
    const input = canvas.getByPlaceholderText("Add a new todo...");
    const addButton = canvas.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Buy milk");
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(canvas.getByText("Buy milk")).toBeInTheDocument();
    });

    // Add another item using Enter key
    await userEvent.type(input, "Do laundry{enter}");

    await waitFor(() => {
      expect(canvas.getByText("Do laundry")).toBeInTheDocument();
    });

    // Toggle the first item as completed
    const checkboxes = canvas.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    });

    // Delete the first item
    const deleteButtons = canvas.getAllByText("Delete");
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(canvas.queryByText("Do laundry")).not.toBeInTheDocument();
    });
  },
};
