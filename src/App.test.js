import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("opens on the newest year that has a playlist", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "Playlist for 2024" })).toBeInTheDocument();
  expect(screen.getByTitle("Spotify playlist for 2024")).toBeInTheDocument();
});

test("arrow buttons move between years", () => {
  render(<App />);
  fireEvent.click(screen.getByText("▼"));
  expect(screen.getByRole("heading", { name: "Playlist for 2023" })).toBeInTheDocument();
  fireEvent.click(screen.getByText("▲"));
  expect(screen.getByRole("heading", { name: "Playlist for 2024" })).toBeInTheDocument();
});
