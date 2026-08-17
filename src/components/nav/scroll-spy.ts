/**
 * Marks the nav link for whichever section currently occupies the middle of
 * the viewport.
 *
 * One IntersectionObserver with an asymmetric rootMargin — not scroll maths.
 * The margin collapses the observation zone to a horizontal band across the
 * middle of the screen, so exactly one section is "active" at a time and the
 * state doesn't flicker at boundaries.
 */
export function initScrollSpy(): void {
  const links = new Map<string, HTMLAnchorElement[]>();

  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")) {
    const id = link.dataset.navLink;
    if (!id) continue;
    const existing = links.get(id);
    if (existing) existing.push(link);
    else links.set(id, [link]);
  }

  if (links.size === 0) return;

  const setActive = (activeId: string | null) => {
    for (const [id, group] of links) {
      for (const link of group) {
        if (id === activeId) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
    }
  };

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }

      // Preserve document order rather than intersection-callback order.
      const active = [...links.keys()].find((id) => visible.has(id)) ?? null;
      setActive(active);
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );

  for (const id of links.keys()) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
}
