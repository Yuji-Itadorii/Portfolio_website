const ENDPOINT = "https://api.web3forms.com/submit";

const GENERIC_ERROR = "Something went wrong. Email me directly instead.";

interface FieldRule {
  name: string;
  validate: (value: string) => string | null;
}

const RULES: FieldRule[] = [
  {
    name: "name",
    validate: (v) => (v.trim().length >= 2 ? null : "Please enter your name."),
  },
  {
    name: "email",
    // Deliberately permissive. Strict email regexes reject valid addresses;
    // the real check is whether the reply lands.
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid email."),
  },
  {
    name: "message",
    validate: (v) => (v.trim().length >= 10 ? null : "A little more detail, please."),
  },
];

export function initContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>("#cf-submit");

  const setStatus = (message: string, state: "success" | "error" | "pending" | "") => {
    if (!status) return;
    status.textContent = message;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
    // Errors need to interrupt; success can wait for a natural pause.
    status.setAttribute("role", state === "error" ? "alert" : "status");
  };

  const showFieldError = (name: string, message: string | null) => {
    const input = form.elements.namedItem(name);
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (slot) slot.textContent = message ?? "";
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  };

  const validate = (): boolean => {
    const data = new FormData(form);
    let firstInvalid: string | null = null;

    for (const rule of RULES) {
      const value = String(data.get(rule.name) ?? "");
      const error = rule.validate(value);
      showFieldError(rule.name, error);
      if (error && !firstInvalid) firstInvalid = rule.name;
    }

    if (firstInvalid) {
      const input = form.elements.namedItem(firstInvalid);
      if (input instanceof HTMLElement) input.focus();
      setStatus("Please fix the highlighted fields.", "error");
      return false;
    }
    return true;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Validation failure must not hit the network — that's what makes the
    // form testable without sending mail.
    if (!validate()) return;

    void send();
  });

  async function send() {
    if (submit) submit.disabled = true;
    setStatus("Sending…", "pending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      // Web3Forms is inconsistent: 200/400 return { success, body: { message } }
      // while 429 returns a flat { success, message }. Read both shapes.
      const json: unknown = await response.json().catch(() => null);
      const payload = (json ?? {}) as {
        success?: boolean;
        message?: string;
        body?: { message?: string };
      };

      if (response.ok && payload.success === true) {
        form.reset();
        for (const rule of RULES) showFieldError(rule.name, null);
        setStatus("Thanks — I'll get back to you.", "success");
      } else {
        setStatus(payload.body?.message ?? payload.message ?? GENERIC_ERROR, "error");
      }
    } catch {
      setStatus(GENERIC_ERROR, "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  }
}
