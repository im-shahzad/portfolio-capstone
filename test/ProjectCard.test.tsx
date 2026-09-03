import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  ProjectCardLoading,
  ProjectCardFetching,
  ProjectCardResult,
  ProjectCardError,
} from "@/components/ProjectCard";

const sampleProject = {
  name: "Meme Caption Generator",
  techStack: ["Python", "Gemini API", "Streamlit"],
  problem: "Most AI text generators produce captions that need rewriting.",
  whatIDid: "Built tone options, history, and comparison.",
  outcome: "Reduced iteration friction. Not yet formally user-tested.",
  repoLink: "https://github.com/IMShahzad000/meme-caption-generator",
};

describe("ProjectCard components", () => {
  describe("ProjectCardLoading", () => {
    it("renders the loading state with descriptive text", () => {
      render(<ProjectCardLoading />);

      expect(
        screen.getByText(/looking up project details/i)
      ).toBeInTheDocument();
    });
  });

  describe("ProjectCardFetching", () => {
    it("renders the fetching state with a loading indicator", () => {
      render(<ProjectCardFetching />);

      expect(screen.getByText(/fetching/i)).toBeInTheDocument();
    });
  });

  describe("ProjectCardResult", () => {
    it("renders the project name and all section labels", () => {
      render(<ProjectCardResult data={sampleProject} />);

      expect(
        screen.getByRole("heading", { name: "Meme Caption Generator" })
      ).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Gemini API")).toBeInTheDocument();
      expect(screen.getByText("Streamlit")).toBeInTheDocument();
      expect(screen.getByText(sampleProject.problem)).toBeInTheDocument();
      expect(screen.getByText(sampleProject.whatIDid)).toBeInTheDocument();
      expect(screen.getByText(sampleProject.outcome)).toBeInTheDocument();
    });

    it("renders a repo link with correct href and accessible name", () => {
      render(<ProjectCardResult data={sampleProject} />);

      const repoLink = screen.getByRole("link", { name: /repo/i });
      expect(repoLink).toHaveAttribute(
        "href",
        "https://github.com/IMShahzad000/meme-caption-generator"
      );
      expect(repoLink).toHaveAttribute("target", "_blank");
    });
  });

  describe("ProjectCardError", () => {
    it("renders a graceful error message (not a crash)", () => {
      render(<ProjectCardError />);

      expect(
        screen.getByText(/couldn't load project details/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/feel free to ask me anything else/i)
      ).toBeInTheDocument();
    });
  });
});
