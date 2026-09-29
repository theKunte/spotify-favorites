import { render, screen, fireEvent, within, act } from "@testing-library/react";
import App from "./App";

const tab = (year) => screen.getByRole("tab", { name: new RegExp(year) });
const goTo = (hash) =>
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });

test("opens on the newest year that has a playlist", () => {
  render(<App />);
  expect(tab(2024)).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("heading", { level: 2, name: "2024" })).toBeInTheDocument();
  expect(screen.getByText("Songs I liked 2024")).toBeInTheDocument();
  expect(screen.getByTitle("Spotify playlist for 2024")).toHaveAttribute(
    "src",
    "https://open.spotify.com/embed/playlist/2PqZ6i0tCTtyCcX8JHpAds"
  );
  // 2025 has no playlist yet, so it's hidden
  expect(screen.queryByRole("tab", { name: /2025/ })).not.toBeInTheDocument();
});

test("arrow keys move between years", () => {
  render(<App />);
  fireEvent.keyDown(tab(2024), { key: "ArrowRight" });
  goTo("#2023");
  expect(tab(2023)).toHaveAttribute("aria-selected", "true");
  expect(screen.getByTitle("Spotify playlist for 2023")).toBeInTheDocument();
});

test("the address picks the year", () => {
  goTo("#2022");
  render(<App />);
  expect(tab(2022)).toHaveAttribute("aria-selected", "true");
});

test("visitors don't see editor hints", () => {
  render(<App />);
  expect(screen.queryByText(/Add one in the editor/)).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: /Edit 2024/ })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Add or edit details" })).toHaveAttribute("href", "#2024/edit");
});

test("the editor previews details and writes the years.js entry", () => {
  goTo("#2024/edit");
  render(<App />);
  fireEvent.change(screen.getByLabelText("A note about the year"), { target: { value: "Windows down" } });
  fireEvent.change(screen.getByLabelText("Songs on the playlist"), { target: { value: "50" } });
  fireEvent.change(screen.getByLabelText("Mood"), { target: { value: "loud" } });
  fireEvent.change(screen.getByLabelText("Genres"), { target: { value: "rock, jazz" } });
  fireEvent.click(screen.getByRole("button", { name: "Add a moment" }));
  fireEvent.change(screen.getByLabelText("Moment 1: song number"), { target: { value: "3" } });
  fireEvent.change(screen.getByLabelText("Moment 1: note"), { target: { value: "Road trip" } });
  fireEvent.change(screen.getByLabelText("Songs you both love"), { target: { value: "1, 3" } });
  fireEvent.change(screen.getByLabelText("Song link"), {
    target: { value: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P?si=x" },
  });
  fireEvent.change(screen.getByLabelText("Song"), { target: { value: "Distractions" } });

  // the page updates
  expect(screen.getByText("Windows down", { selector: "p" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Song 3: Road trip" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Play his anthem of 2024: Distractions/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Songs we both love (2)" })).toBeInTheDocument();

  // and the code to paste is ready
  const code = document.getElementById("snippet").textContent;
  expect(code).toContain('title: "Songs I liked 2024",');
  expect(code).toContain('note: "Windows down",');
  expect(code).toContain("songs: 50,");
  expect(code).toContain('genres: ["rock", "jazz"],');
  expect(code).toContain('{ song: 3, note: "Road trip" },');
  expect(code).toContain("shared: [1, 3],");
  expect(code).toContain('anthem: { title: "Distractions", artist: "", service: "spotify", id: "7ouMYWpwJ422jRcDASZB7P" },');

  // drafts survive a reload in this browser
  expect(JSON.parse(localStorage.getItem("soundprint-drafts"))[2024].note).toBe("Windows down");
});

test("playing the anthem swaps the player to that song", () => {
  localStorage.setItem(
    "soundprint-drafts",
    JSON.stringify({ 2024: { anthem: { title: "Distractions", artist: "NxWorries", service: "spotify", id: "t1" } } })
  );
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Play his anthem/ }));
  expect(screen.getByTitle("Spotify player: Distractions")).toHaveAttribute(
    "src",
    "https://open.spotify.com/embed/track/t1"
  );
  fireEvent.click(screen.getByRole("button", { name: "Back to the full playlist" }));
  expect(screen.getByTitle("Spotify playlist for 2024")).toBeInTheDocument();
});

test("a new year can be added from a playlist link", () => {
  goTo("#2024/edit");
  render(<App />);
  const form = screen.getByRole("heading", { name: "Add another year" }).closest("form");
  fireEvent.change(within(form).getByLabelText("Year"), { target: { value: "2025" } });
  fireEvent.change(within(form).getByLabelText("Playlist link"), {
    target: { value: "https://tidal.com/browse/playlist/abcd-1234" },
  });
  fireEvent.click(within(form).getByRole("button", { name: "Add year" }));
  goTo("#2025/edit");
  expect(tab(2025)).toHaveAttribute("aria-selected", "true");
  expect(screen.getByTitle("Tidal playlist for 2025")).toHaveAttribute(
    "src",
    "https://embed.tidal.com/playlists/abcd-1234"
  );
});
