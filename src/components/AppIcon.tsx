import {
  AlarmClock, Anchor, AudioWaveform, BarChart3, Bed, Bell, Bird, BookOpen, Bookmark, Check,
  CircleCheck, CloudFog, CloudSun, Coins, Compass, Contrast, Gem, Globe, HandHeart, Handshake,
  Heart, Home, Inbox, Info, Languages, Leaf, Library, Lightbulb, Link, Lock, Megaphone, Mic,
  Moon, MoonStar, Mountain, PenLine, Repeat, Ruler, Scale, Scroll, ScrollText, Search, Settings,
  Sparkle, Sparkles, Sprout, Star, Sun, Sunrise, Sunset, Swords, Target, TriangleAlert,
  TriangleRight, Type, Users, UtensilsCrossed, Volume2, Waves, Wrench, X, Zap,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/** مسجد — بنفس أسلوب أيقونات lucide */
function MosqueIcon(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 2v2" />
      <path d="M7 11a5 5 0 0 1 10 0" />
      <path d="M6 21V11h12v10" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
      <path d="M3 21V9" />
      <path d="M21 21V9" />
      <path d="M2 21h20" />
    </svg>
  );
}

/** الكعبة */
function KaabaIcon(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M12 11v10" />
      <path d="m4 10.5 8 4 8-4" />
    </svg>
  );
}

const ICONS: Record<string, LucideIcon | ((p: LucideProps) => JSX.Element)> = {
  "alarm-clock": AlarmClock,
  anchor: Anchor,
  "audio-waveform": AudioWaveform,
  "bar-chart": BarChart3,
  bed: Bed,
  bell: Bell,
  bird: Bird,
  "book-open": BookOpen,
  bookmark: Bookmark,
  check: Check,
  "circle-check": CircleCheck,
  "cloud-fog": CloudFog,
  "cloud-sun": CloudSun,
  coins: Coins,
  compass: Compass,
  contrast: Contrast,
  gem: Gem,
  globe: Globe,
  "hand-heart": HandHeart,
  handshake: Handshake,
  heart: Heart,
  home: Home,
  inbox: Inbox,
  info: Info,
  kaaba: KaabaIcon,
  languages: Languages,
  leaf: Leaf,
  library: Library,
  lightbulb: Lightbulb,
  link: Link,
  lock: Lock,
  megaphone: Megaphone,
  mic: Mic,
  moon: Moon,
  "moon-star": MoonStar,
  mosque: MosqueIcon,
  mountain: Mountain,
  "pen-line": PenLine,
  repeat: Repeat,
  ruler: Ruler,
  scale: Scale,
  scroll: Scroll,
  "scroll-text": ScrollText,
  search: Search,
  settings: Settings,
  sparkle: Sparkle,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  sun: Sun,
  sunrise: Sunrise,
  sunset: Sunset,
  swords: Swords,
  target: Target,
  "triangle-alert": TriangleAlert,
  "triangle-right": TriangleRight,
  type: Type,
  users: Users,
  utensils: UtensilsCrossed,
  "volume-2": Volume2,
  waves: Waves,
  wrench: Wrench,
  x: X,
  zap: Zap,
};

export type AppIconName = keyof typeof ICONS;

/**
 * أيقونة خطية موحّدة بدل الإيموجي.
 * حجمها 1em ولونها currentColor، فتأخذ حجم ولون النص المحيط بها.
 */
export function AppIcon({
  name,
  className = "",
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? BookOpen;
  return (
    <Icon
      size="1em"
      strokeWidth={strokeWidth}
      className={`inline-block shrink-0 align-[-0.125em] ${className}`}
      aria-hidden="true"
    />
  );
}
