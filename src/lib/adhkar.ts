/**
 * الأذكار: كتاب حصن المسلم كاملاً (١٣٥ باباً) بنصه، مع العدد والفضل والمصدر لكل ذكر،
 * يبنيه scripts/build-hisn.py في hisn-almuslim.json. ويُلحق به باب أدعية من القرآن.
 */
import hisn from "./hisn-almuslim.json";

export interface Dhikr {
  text: string;
  count: number;
  reference?: string;
  benefit?: string;
}

export interface DhikrCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  group: string;
  items: Dhikr[];
}

export type DhikrGroup = { id: string; title: string; icon: string };
export const ADHKAR_GROUPS: DhikrGroup[] = [...(hisn.groups as DhikrGroup[]), { id: "quran", title: "أدعية من القرآن", icon: "book-open" }];
export const HISN_SOURCE = hisn.source;

const iconOf = (g: string) => ADHKAR_GROUPS.find((x) => x.id === g)?.icon ?? "hand-heart";

const HISN: DhikrCategory[] = (hisn.chapters as { id: string; title: string; group: string; items: Dhikr[] }[]).map((c) => ({
  id: c.id,
  title: c.title,
  group: c.group,
  icon: iconOf(c.group),
  description: `${c.items.length} ${c.items.length === 1 ? "ذكر" : c.items.length === 2 ? "ذكران" : "أذكار"} من حصن المسلم`,
  items: c.items,
}));

const QURAN_DUAA: DhikrCategory[] = [
  {
    id: "duaa",
    title: "أدعية مأثورة",
    icon: "hand-heart",
    description: "أدعية من القرآن والسنة لجميع الحاجات",
    group: "quran",
    items: [
      {
        text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
        count: 1,
        reference: "البقرة 201",
      },
      {
        text: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.",
        count: 1,
        reference: "البقرة 286",
      },
      {
        text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ.",
        count: 1,
        reference: "آل عمران 8",
      },
      {
        text: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.",
        count: 1,
        reference: "آل عمران 147",
      },
      {
        text: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ.",
        count: 1,
        reference: "الأعراف 23",
      },
      {
        text: "رَبِّ اشْرَحْ لِي صَدْرِي. وَيَسِّرْ لِي أَمْرِي. وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي. يَفْقَهُوا قَوْلِي.",
        count: 1,
        reference: "طه 25-28",
      },
      {
        text: "رَبِّ زِدْنِي عِلْمًا.",
        count: 1,
        reference: "طه 114",
      },
      {
        text: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.",
        count: 1,
        reference: "الفرقان 74",
      },
      {
        text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ، وَأَعُوذُ بِكَ مِنَ العَجْزِ وَالكَسَلِ، وَأَعُوذُ بِكَ مِنَ الجُبْنِ وَالبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.",
        count: 1,
        reference: "رواه البخاري",
      },
      {
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الهُدَى وَالتُّقَى وَالعَفَافَ وَالغِنَى.",
        count: 1,
        reference: "رواه مسلم",
      },
      {
        text: "اللَّهُمَّ مُصَرِّفَ القُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ.",
        count: 1,
        reference: "رواه مسلم",
      },
      {
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
        count: 1,
        reference: "رواه ابن ماجه",
      },
    ],
  },
];

export const ADHKAR: DhikrCategory[] = [...HISN, ...QURAN_DUAA];
export const ADHKAR_TOTAL = ADHKAR.reduce((n, c) => n + c.items.length, 0);

export const getCategoryById = (id: string) => ADHKAR.find((c) => c.id === id);
