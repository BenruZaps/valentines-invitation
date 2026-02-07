import { FloatingHearts } from "@/components/floating-hearts";
import { ValentineCard } from "@/components/valentine-card";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <FloatingHearts />
      <ValentineCard />
    </main>
  );
}
