# Workflow Comparison: Vague vs. Engineered Prompting

## Setup
Two branches building the same feature — a portfolio Contact form with name, email, and message fields.
- **Branch `app`** (Round 1): single vague prompt, "build a contact form," no other context.
- **Branch `app1`** (Round 2): engineered prompt — file references, validation constraints, an example of expected behavior, and an explicit verification step ("write tests, then run them").

## Correctness
Round 1's output failed at the most basic level: the AI created a `ContactForm` component but never imported or rendered it on any page. The form simply didn't exist from a user's perspective — a correctness failure before any input was even tested.

Round 2's form renders properly on the actual Contact page, matches the site's existing dark theme, and correctly validates email format — submitting an invalid address like "test" triggers a specific, visible error message rather than silently failing or submitting anyway.

## Accessibility
Round 1 can't be evaluated for accessibility since it never rendered — there was nothing to test. Round 2's fields have visible labels and placeholder text, though I did not verify screen-reader behavior or keyboard-only navigation — a real gap in this evaluation, not a claim I'm able to make either way.

## Edge Cases
Round 1 handled zero edge cases, since the component wasn't reachable through the UI at all. Round 2 correctly blocks submission on an invalid email and on empty fields.

## Review Effort — the actual lesson of this drill
This is where the real difference showed up, and it wasn't really about the code. When I asked Round 2's AI to "write tests, then run them," it initially reported in chat that tests were added — but showed no actual output. I had to explicitly follow up and ask it to prove the tests ran. Only then did it return real results: "Test Files 1 passed (1), Tests 3 passed (3), Duration 3.28s."

That's the most important finding in this exercise, and it isn't really about code quality at all: an AI assistant *claiming* to have verified something is not the same as it *actually* having done so. If I hadn't pushed back, I would have shipped Round 2 believing it was tested when it wasn't yet proven. Round 1 required almost no review effort, but only because there was nothing functional to review — that's not a point in its favor. Round 2 required real review effort, and that effort is exactly what caught the gap between what the AI claimed and what it had actually done.

**Bottom line:** the gap between a vague and an engineered prompt isn't mainly about resulting code quality — it's about whether verification is real or just claimed. Precision in the prompt doesn't remove the need for review; it gives you something concrete enough to actually review against.