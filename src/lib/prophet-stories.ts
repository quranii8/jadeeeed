/**
 * قصص الأنبياء الموثّقة — مولّدة من content/prophet-stories.spec.json
 * عبر `npm run build:prophets`. لا تعدّل src/data/prophet-stories.json يدوياً.
 */
import data from "@/data/prophet-stories.json";

export interface Ayah {
  n: number;
  text: string;
}
export interface VerseGroup {
  surah: number;
  surahName: string;
  from: number;
  to: number;
  ayat: Ayah[];
}
export interface StoryStage {
  title: string;
  summary: string;
  verses: VerseGroup[];
}
export interface StoryHadith {
  collection: string;
  number: number;
  text: string;
  context: string | null;
  url: string;
}
export interface StoryPlace {
  name: string;
  lat: number;
  lng: number;
  note: string;
  approx?: boolean;
}
export interface StorySource {
  kind: "quran" | "hadith";
  label: string;
  href: string;
  text: string;
}
export interface StoryParagraph {
  text: string;
  sources: StorySource[];
}
/** لقطة من الفيلم: آية واحدة بنصّها وترجمتها (Sahih International) ومشهدها */
export interface FilmShot {
  scene: string;
  surah: number;
  ayah: number;
  surahName: string;
  surahNameEn: string;
  ar: string;
  en: string;
}
export interface ProphetStory {
  id: string;
  title: string;
  intro: string;
  places: StoryPlace[];
  stages: StoryStage[];
  hadith: StoryHadith[];
  story: StoryParagraph[];
  film: FilmShot[];
}

export const PROPHET_STORIES = data as ProphetStory[];

export const getProphetStory = (id: string) => PROPHET_STORIES.find((p) => p.id === id);
