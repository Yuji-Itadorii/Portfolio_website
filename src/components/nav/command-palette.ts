/**
 * Cmd/Ctrl-K command palette. No dependencies — a native <dialog> supplies the
 * focus trap, Esc handling and inert background.
 */
export function initCommandPalette(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-palette]");
  if (!dialog) return;

  const input = dialog.querySelector<HTMLInputElement>("[data-palette-input]");
  const empty = dialog.querySelector<HTMLElement>("[data-palette-empty]");
  const commands = [...dialog.querySelectorAll<HTMLButtonElement>("[data-command]")];

  let matches = commands;
  let activeIndex = 0;

  const paint = () => {
    commands.forEach((command) => {
      const index = matches.indexOf(command);
      const listItem = command.parentElement;
      if (listItem) listItem.hidden = index === -1;
      command.setAttribute("aria-selected", String(index === activeIndex && index !== -1));
    });

    if (empty) empty.hidden = matches.length > 0;
    matches[activeIndex]?.scrollIntoView({ block: "nearest" });
  };

  const filter = (query: string) => {
    const needle = query.trim().toLowerCase();
    matches = needle
      ? commands.filter((command) => (command.dataset.search ?? "").includes(needle))
      : commands;
    activeIndex = 0;
    paint();
  };

  const open = () => {
    if (dialog.open) return;
    if (input) input.value = "";
    filter("");
    dialog.showModal();
    input?.focus();
  };

  const run = (command: HTMLButtonElement) => {
    const { action, value = "" } = command.dataset;
    dialog.close();

    switch (action) {
      case "scroll":
        document.getElementById(value)?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "theme":
        document.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.click();
        break;
      case "copy-email":
        void navigator.clipboard?.writeText(value);
        break;
      case "open":
        window.open(value, value.startsWith("http") ? "_blank" : "_self", "noopener");
        break;
    }
  };

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });

  document.querySelector<HTMLButtonElement>("[data-open-palette]")?.addEventListener("click", open);

  input?.addEventListener("input", () => filter(input.value));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length === 0) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      activeIndex = (activeIndex + delta + matches.length) % matches.length;
      paint();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const command = matches[activeIndex];
      if (command) run(command);
    }
  });

  for (const command of commands) {
    command.addEventListener("click", () => run(command));
  }

  // Click the backdrop to dismiss.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
