import { notFound } from "next/navigation";

import { ModuleSectionPage } from "@/components/module-section-page";
import { hasModuleSection } from "@/lib/dashboard-config";

export default async function TrackingSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!hasModuleSection("tracking", section)) {
    notFound();
  }

  return <ModuleSectionPage pathname={`/tracking/${section}`} />;
}
