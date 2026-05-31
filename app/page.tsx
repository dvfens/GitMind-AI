import { Hero } from "@/components/landing/hero";
import { SiteShell } from "@/components/layout/site-shell";

export default function HomePage() {
  return (
    <SiteShell fullWidth background="prism">
      <Hero />
    </SiteShell>
  );
}
