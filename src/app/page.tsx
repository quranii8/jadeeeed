import { HomeHero } from "@/components/home/HomeHero";
import { ContinueReading } from "@/components/home/ContinueReading";
import { SectionWall } from "@/components/home/SectionWall";
import { ProphetsBand } from "@/components/home/ProphetsBand";
import { HadithOfDay } from "@/components/home/HadithOfDay";
import { RecitersHighlight } from "@/components/home/RecitersHighlight";

// the verse of the day turns over daily
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ContinueReading />
      <SectionWall />
      <HadithOfDay />
      <ProphetsBand />
      <RecitersHighlight />
    </>
  );
}
