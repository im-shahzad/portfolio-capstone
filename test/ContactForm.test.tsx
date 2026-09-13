import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ContactForm from "@/components/ContactForm";

describe("ContactForm", () => {
  it("shows validation errors when all fields are submitted empty", async () => {
    render(<ContactForm />);

    const form = screen.getByRole("button", { name: /send message/i }).closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("shows email validation error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Jane"
    );
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "not-an-email"
    );
    await user.type(
      screen.getByRole("textbox", { name: /message/i }),
      "Hello"
    );

    // Submit the form directly via fireEvent (more reliable in jsdom)
    const form = screen.getByRole("button", { name: /send message/i }).closest("form")!;
    fireEvent.submit(form);

    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Name is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Message is required")
    ).not.toBeInTheDocument();
  });

  it("clears field error when user starts typing in that field", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Submit empty to trigger errors
    const form = screen.getByRole("button", { name: /send message/i }).closest("form")!;
    fireEvent.submit(form);
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    // Start typing — error should clear
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "J"
    );
    expect(
      screen.queryByText("Name is required")
    ).not.toBeInTheDocument();
  });

  it("shows confirmation message on valid submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Jane"
    );
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "jane@example.com"
    );
    await user.type(
      screen.getByRole("textbox", { name: /message/i }),
      "Hello there"
    );

    const form = screen.getByRole("button", { name: /send message/i }).closest("form")!;
    fireEvent.submit(form);

    expect(
      await screen.findByRole("heading", { name: /message sent!/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/thanks for reaching out/i)
    ).toBeInTheDocument();
  });

  it("allows sending another message after successful submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill and submit
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Jane"
    );
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "jane@example.com"
    );
    await user.type(
      screen.getByRole("textbox", { name: /message/i }),
      "Hello"
    );

    const form = screen.getByRole("button", { name: /send message/i }).closest("form")!;
    fireEvent.submit(form);

    // Click "Send another message"
    await user.click(
      screen.getByRole("button", { name: /send another message/i })
    );

    // Form should be back with empty fields
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /message/i })).toHaveValue("");
  });
});
