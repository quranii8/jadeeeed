/**
 * جلب التفاسير من المصدر الصحيح.
 * أغلب التفاسير من api.alquran.cloud، لكن الطبري وابن كثير غير موجودين هناك
 * (المعرّف الخاطئ كان يرجع نص الآية بدل التفسير)، فنجلبهما من api.quran.com.
 */

const ALQURAN_API = "https://api.alquran.cloud/v1";
const QURAN_COM_API = "https://api.quran.com/api/v4";

/** معرّف التفسير في الموقع → رقمه في api.quran.com */
const QURAN_COM_TAFSIR_IDS: Record<string, number> = {
  "ar.tabari": 15,
  "ar.ibnkatheer": 14,
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

/** تحويل HTML التفسير إلى نص عادي بفقرات */
export function htmlToText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<\/p>\s*/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|nbsp|quot|#39|lt|gt);/g, (m) => ENTITIES[m] ?? m)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** تفسير آية واحدة */
export async function fetchAyahTafsir(tafsirId: string, surah: number, ayah: number): Promise<string> {
  const qcId = QURAN_COM_TAFSIR_IDS[tafsirId];
  if (qcId) {
    const d = await getJson(`${QURAN_COM_API}/tafsirs/${qcId}/by_ayah/${surah}:${ayah}`);
    return htmlToText(d?.tafsir?.text ?? "");
  }
  const d = await getJson(`${ALQURAN_API}/ayah/${surah}:${ayah}/${tafsirId}`);
  if (d?.data?.edition?.identifier !== tafsirId) throw new Error("wrong edition");
  return d?.data?.text ?? "";
}

/** تفسير عدة تفاسير لنفس الآية (للمقارنة) — كل تفسير يُجلب لحاله حتى لا يُفسد واحدٌ الباقي */
export async function fetchAyahTafsirs(
  tafsirIds: string[],
  surah: number,
  ayah: number
): Promise<Array<{ id: string; text: string }>> {
  const results = await Promise.allSettled(tafsirIds.map((id) => fetchAyahTafsir(id, surah, ayah)));
  return tafsirIds.map((id, i) => {
    const r = results[i];
    return { id, text: r.status === "fulfilled" ? r.value : "" };
  });
}

/** تفسير سورة كاملة، مرتّب حسب رقم الآية (index 0 = الآية 1) */
export async function fetchSurahTafsir(tafsirId: string, surah: number): Promise<string[]> {
  const qcId = QURAN_COM_TAFSIR_IDS[tafsirId];
  if (qcId) {
    const texts: string[] = [];
    let page: number | null = 1;
    while (page) {
      const d: any = await getJson(
        `${QURAN_COM_API}/tafsirs/${qcId}/by_chapter/${surah}?per_page=50&page=${page}`
      );
      for (const t of d?.tafsirs ?? []) {
        const ayah = parseInt(String(t.verse_key).split(":")[1], 10);
        if (ayah > 0) texts[ayah - 1] = htmlToText(t.text ?? "");
      }
      page = d?.pagination?.next_page ?? null;
    }
    return texts;
  }
  const d = await getJson(`${ALQURAN_API}/surah/${surah}/${tafsirId}`);
  if (d?.data?.edition?.identifier !== tafsirId) throw new Error("wrong edition");
  return (d?.data?.ayahs ?? []).map((a: any) => a.text ?? "");
}
