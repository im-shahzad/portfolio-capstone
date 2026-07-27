import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ContactForm from "@/components/ContactForm";

function getLastForm() {
  const forms = screen.getAllByTestId("contact-form");
  return forms[forms.length - 1];
}

describe("ContactForm", () => {
  it("shows errors when all fields are empty", async () => {
    render(<ContactForm />);
    const form = getLastForm();

    fireEvent.submit(form);

    expect(within(form).getByText("Name is required")).toBeInTheDocument();
    expect(within(form).getByText("Email is required")).toBeInTheDocument();
    expect(within(form).getByText("Message is required")).toBeInTheDocument();
  });

  it("shows email error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const form = getLastForm();

    await user.type(
      within(form).getByPlaceholderText("Your name"),
      "Jane"
    );
    await user.type(
      within(form).getByPlaceholderText("you@example.com"),
      "test"
    );
    await user.type(
      within(form).getByPlaceholderText("How can I help?"),
      "Hello"
    );

    fireEvent.submit(form);

    expect(
      within(form).getByText("Please enter a valid email")
    ).toBeInTheDocument();
    expect(
      within(form).queryByText("Name is required")
    ).not.toBeInTheDocument();
    expect(
      within(form).queryByText("Message is required")
    ).not.toBeInTheDocument();
  });

  it("shows confirmation message on valid submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const form = getLastForm();

    await user.type(
      within(form).getByPlaceholderText("Your name"),
      "Jane"
    );
    await user.type(
      within(form).getByPlaceholderText("you@example.com"),
      "jane@example.com"
    );
    await user.type(
      within(form).getByPlaceholderText("How can I help?"),
      "Hello there"
    );

    fireEvent.submit(form);

    expect(screen.getByText("Message sent!")).toBeInTheDocument();
    expect(
      screen.getByText(/thanks for reaching out/i)
    ).toBeInTheDocument();
  });
});
