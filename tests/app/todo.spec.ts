import { test, expect } from "@playwright/test";

test("add, complete and filter todos", async ({ page }) => {
  await page.goto("/");

  const input = page.getByPlaceholder("Add a new todo...");
  const addBtn = page.getByRole("button", { name: /add/i });

  // Add todos
  await input.fill("Buy milk");
  await addBtn.click();
  await expect(page.getByText("Buy milk")).toBeVisible();

  await input.fill("Do laundry");
  await input.press("Enter");
  await expect(page.getByText("Do laundry")).toBeVisible();

  // Complete Buy milk
  const buyMilkCheckbox = page.getByLabel("Toggle Buy milk");
  await buyMilkCheckbox.check();
  await expect(buyMilkCheckbox).toBeChecked();

  // Filter: Active
  await page.getByRole("button", { name: /Active/i }).click();
  await expect(page.getByText("Do laundry")).toBeVisible();
  await expect(page.getByText("Buy milk")).toHaveCount(0);

  // Filter: Completed
  await page.getByRole("button", { name: /Completed/i }).click();
  await expect(page.getByText("Buy milk")).toBeVisible();
  await expect(page.getByText("Do laundry")).toHaveCount(0);
});
