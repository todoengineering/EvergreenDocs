import { describe, it, expect } from "vitest";

import EvergreenConfigSchema from "../evergreen-config";

describe("config schema", () => {
  it("works for valid config", () => {
    expect(() => EvergreenConfigSchema.parse(validConfig)).not.toThrow();
  });

  it("fails for invalid config", () => {
    expect(() => EvergreenConfigSchema.parse(invalidConfig)).toThrow();
  });
});

const validConfig = {
  name: "Evergreen Docs",
  description:
    "Evergreen Docs is a GitHub app that helps you keep your documentation up to date. It automatically creates pull requests to update your documentation when your code changes.",
  generates: [
    {
      preset: "readme",
      path: "README.md",
      sections: [
        { name: "Overview" },
        { name: "Installation" },
        { name: "Features" },
        { name: "Contribution" },
        { name: "License" },
      ],
    },
    {
      preset: "translate",
      inputPath: "README.md",
      outputPath: "README.fr.md",
      language: "fr",
    },
  ],
};

const invalidConfig = {
  foo: "bar",
};
