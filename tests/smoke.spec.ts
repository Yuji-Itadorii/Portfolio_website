import { test, expect } from "@playwright/test";

/**
 * Deliberately small. This guards the handful of things that break silently on
 * a portfolio — dead links, a 404ing resume, a theme toggle that stops
 * persisting — rather than re-testing that HTML renders.
 */

test.describe("page structure", () => {
  test("has exactly one h1, and it is the name", async ({ page }) => {
    await page.goto("/");
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toHaveText("Abhay Rawat");
  });

  test("every nav anchor resolves to a real section", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("nav[aria-label='Primary'] a[href^='#']")
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).getAttribute("href")!));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await expect(page.locator(href), `${href} should exist`).toHaveCount(1);
    }
  });

  test("the skip link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveClass(/skip-link/);
  });

  test("SEO essentials are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("meta[name='description']")).toHaveCount(1);
    await expect(page.locator("link[rel='canonical']")).toHaveCount(1);
    await expect(page.locator("meta[property='og:image']")).toHaveCount(1);
    await expect(page.locator("script[type='application/ld+json']")).toHaveCount(1);
  });
});

test.describe("assets", () => {
  test("og image, favicon and robots.txt all resolve", async ({ request }) => {
    for (const path of ["/og.png", "/favicon.svg", "/robots.txt", "/sitemap-index.xml"]) {
      const response = await request.get(path);
      expect(response.status(), `${path} should be 200`).toBe(200);
    }
  });

  test("the resume link is either absent or resolves — never a dead link", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const link = page.locator("a[href$='.pdf']").first();

    if ((await link.count()) === 0) {
      test.info().annotations.push({
        type: "note",
        description: "No resume PDF in the build; CTA correctly fell back to email.",
      });
      return;
    }

    const href = await link.getAttribute("href");
    expect((await request.get(href!)).status()).toBe(200);
  });
});

test.describe("theme", () => {
  test("toggles and persists across a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const initial = await html.getAttribute("data-theme");

    await page.locator("[data-theme-toggle]").first().click();
    const flipped = initial === "dark" ? "light" : "dark";
    await expect(html).toHaveAttribute("data-theme", flipped);

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", flipped);
  });
});

test.describe("contact form", () => {
  test("blocks invalid input without touching the network", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("[data-contact-form]");
    if ((await form.count()) === 0) {
      // No Web3Forms key in this build — assert the documented fallback.
      // Scoped to #contact: the mobile menu dialog also holds a mailto link,
      // and while closed it is present in the DOM but not visible.
      await expect(page.locator("#contact a[href^='mailto:']").first()).toBeVisible();
      return;
    }

    let requests = 0;
    await page.route("https://api.web3forms.com/**", (route) => {
      requests += 1;
      return route.abort();
    });

    await page.locator("#cf-submit").click();
    await expect(page.locator("[data-form-status]")).toHaveAttribute("role", "alert");
    expect(requests, "invalid submit must not hit the API").toBe(0);
  });

  test("renders the success state from a mocked response", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("[data-contact-form]");
    test.skip((await form.count()) === 0, "No Web3Forms key configured in this build.");

    await page.route("https://api.web3forms.com/submit", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "Email sent successfully!" }),
      }),
    );

    await page.fill("#cf-name", "Test Person");
    await page.fill("#cf-email", "test@example.com");
    await page.fill("#cf-message", "This is a long enough test message.");
    await page.locator("#cf-submit").click();

    await expect(page.locator("[data-form-status]")).toHaveAttribute("data-state", "success");
  });
});

const IDENTITY = ["none", "matrix(1, 0, 0, 1, 0, 0)"];
const MOTION_CHUNK = /\/parallax\.[A-Za-z0-9_-]+\.js$/;

test.describe("hero", () => {
  // Contexts are built explicitly here rather than via test.use({reducedMotion}),
  // which did not reliably apply the emulation inside a describe block.
  test("under reduced motion, the Motion chunk is never fetched", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();

    const scripts: string[] = [];
    page.on("request", (r) => {
      if (r.resourceType() === "script") scripts.push(r.url());
    });

    await page.goto(baseURL!);
    // Confirm the emulation actually took, so this can't silently pass.
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      true,
    );

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(2000);

    // The ~1 KB scheduler still loads — it must, to notice a motion toggle.
    // The dynamically imported Motion chunk must not.
    expect(
      scripts.filter((u) => MOTION_CHUNK.test(u)),
      "Motion must not load under prefers-reduced-motion",
    ).toHaveLength(0);

    const transforms = await page
      .locator(".hero-layer")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
    expect(transforms.length).toBeGreaterThan(0);
    for (const t of transforms) expect(IDENTITY).toContain(t);

    await ctx.close();
  });

  test("with motion allowed, layers actually translate on scroll", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();

    await page.goto(baseURL!);
    await page.waitForTimeout(1200); // idle-deferred import
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(600);

    const transforms = await page
      .locator(".hero-layer")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));

    const moved = transforms.filter((t) => !IDENTITY.includes(t));
    expect(moved.length, "parallax should be driving the layers").toBeGreaterThan(0);

    await ctx.close();
  });
});

test.describe("layout", () => {
  // The role rotator uses white-space: nowrap; without an explicit
  // minmax(0, 1fr) hero track it pushed the document into overflow below 360px.
  for (const width of [320, 390, 768, 1440, 2560]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));
      await page.waitForTimeout(300);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `document overflows by ${overflow}px`).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("404", () => {
  test("renders and is noindex", async ({ page }) => {
    await page.goto("/404.html");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
  });
});
