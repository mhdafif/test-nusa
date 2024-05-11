import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach } from "vitest";
import { vi } from "vitest";

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

beforeAll(() => {
  process.env.BASE_URL = "https://jsonplaceholder.typicode.com/";
});

beforeEach(async () => {
  vi.resetModules();
});

afterEach(() => {
  cleanup();
});
