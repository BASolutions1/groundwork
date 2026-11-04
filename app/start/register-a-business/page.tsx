import { notFound } from "next/navigation";
import { StagePage } from "@/components/stage/StagePage";
import { getStageBySlug } from "@/lib/stages/content";
import { stageMetadata } from "@/lib/stages/seo";

const SLUG = "register-a-business";

export function generateMetadata() {
  const stage = getStageBySlug(SLUG);
  if (!stage) return {};
  return stageMetadata(stage);
}

export default function Page() {
  const stage = getStageBySlug(SLUG);
  if (!stage) notFound();
  return <StagePage stage={stage} />;
}
