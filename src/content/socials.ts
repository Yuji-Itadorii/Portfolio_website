import type { SocialLink } from "./types";
import { profile } from "./profile";

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Yuji-Itadorii",
    icon: "simple-icons:github",
    handle: "@Yuji-Itadorii",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abhay2002rawat/",
    icon: "simple-icons:linkedin",
    handle: "in/abhay2002rawat",
  },
  {
    label: "Medium",
    href: "https://medium.com/@yujii-itadori",
    icon: "simple-icons:medium",
    handle: "@yujii-itadori",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: "lucide:mail",
    handle: profile.email,
  },
];
