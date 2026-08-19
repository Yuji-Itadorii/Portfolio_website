import { animate, scroll } from "motion";
import { NARROW_QUERY, REDUCED_MOTION_QUERY } from "~/lib/motion";

/**
 * Drives the 12 hero layers from scroll position.
 *
 * The original implementation registered twelve separate unthrottled scroll
 * listeners, each writing `style.left` — which forces layout on every single
 * scroll event. This registers twelve WAAPI animations against ONE scroll
 * timeline. Because every animation is composite-only (transform), Motion
 * compiles them to a native ScrollTimeline that runs off the main thread where
 * the browser supports it, and falls back to a single shared rAF loop where it
 * doesn't. One code path, no @supports branching.
 */
export function initParallax(stage: HTMLElement): () => void {
  const reduce = window.matchMedia(REDUCED_MOTION_QUERY);
  const narrow = window.matchMedia(NARROW_QUERY);

  let stops: (() => void)[] = [];

  const teardown = () => {
    for (const stop of stops) stop();
    stops = [];
    for (const el of stage.querySelectorAll<HTMLElement>(".hero-layer")) {
      el.style.transform = "";
      // Twelve full-viewport promoted layers is real GPU memory on a phone.
      // Hand it back whenever the effect isn't running.
      el.style.willChange = "";
    }
  };

  const setup = () => {
    teardown();

    // Reduced motion: leave every layer at its identity transform. Because the
    // base state is identity rather than an offset, that is a complete,
    // intentional-looking illustration — not a half-shifted broken one.
    if (reduce.matches) return;

    // Damp rather than disable on small screens: the effect still reads, but
    // costs a fraction of the compositing work on a mid-range phone.
    const amp = narrow.matches ? 0.45 : 1;

    for (const el of stage.querySelectorAll<HTMLElement>(".hero-layer")) {
      const dx = Number(el.dataset.dx ?? 0) * amp;
      const dy = Number(el.dataset.dy ?? 0) * amp;
      const scale = 1 + (Number(el.dataset.scale ?? 1) - 1) * amp;

      el.style.willChange = "transform";

      stops.push(
        scroll(
          animate(
            el,
            {
              transform: [
                "translate3d(0vw, 0vh, 0) scale(1)",
                `translate3d(${dx}vw, ${dy}vh, 0) scale(${scale})`,
              ],
            },
            // Linear is not a style choice. Any easing makes the layers lag
            // the scroll position and the whole thing feels rubbery.
            { ease: "linear" },
          ),
          { target: stage, offset: ["start start", "end start"] },
        ),
      );
    }
  };

  setup();

  // Re-evaluate if the user flips the OS motion setting or rotates the device,
  // so neither needs a page reload to take effect.
  reduce.addEventListener("change", setup);
  narrow.addEventListener("change", setup);

  return () => {
    reduce.removeEventListener("change", setup);
    narrow.removeEventListener("change", setup);
    teardown();
  };
}
