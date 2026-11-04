import { StartIndexPage } from "@/components/stage/StartIndexPage";
import { startIndexMetadata } from "@/lib/stages/seo";

export const metadata = startIndexMetadata();

export default function Page() {
  return <StartIndexPage />;
}
