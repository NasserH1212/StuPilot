import { IconBook, IconCalendar, IconHome, IconPerson, IconPlus } from "../icons/icons";
import styles from "./BottomNavigation.module.css";

export type NavKey = "profile" | "courses" | "week" | "today";

const items: ReadonlyArray<{ key: NavKey; label: string; Icon: typeof IconHome }> = [
  { key: "profile", label: "حسابي", Icon: IconPerson },
  { key: "courses", label: "المقررات", Icon: IconBook },
];

const trailingItems: ReadonlyArray<{
  key: NavKey;
  label: string;
  Icon: typeof IconHome;
}> = [
  { key: "week", label: "الأسبوع", Icon: IconCalendar },
  { key: "today", label: "اليوم", Icon: IconHome },
];

export interface BottomNavigationProps {
  readonly active: NavKey;
  readonly onNavigate: (key: NavKey) => void;
  readonly captureOpen: boolean;
  readonly onToggleCapture: () => void;
  readonly className?: string;
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  readonly item: { key: NavKey; label: string; Icon: typeof IconHome };
  readonly active: NavKey;
  readonly onNavigate: (key: NavKey) => void;
}) {
  const { key, label, Icon } = item;
  return (
    <button
      type="button"
      className={styles.item}
      aria-current={active === key ? "page" : undefined}
      onClick={() => onNavigate(key)}
    >
      <Icon className={styles.icon} />
      <span className={styles.label} dir="auto">
        {label}
      </span>
    </button>
  );
}

/**
 * Motion: the center "+" rotates 45° into "×" over 180ms ease-out while
 * Quick Capture is open, reversing on close; the 56px hit area never moves.
 * Reduced motion: swap instantly. Adapted from "warm-goose" by JkHuger on
 * Uiverse.io — see THIRD_PARTY_NOTICES.md.
 */
export function BottomNavigation({
  active,
  onNavigate,
  captureOpen,
  onToggleCapture,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      className={[styles.nav, className].filter(Boolean).join(" ")}
      aria-label="التنقل الرئيسي"
    >
      {items.map((item) => (
        <NavItem key={item.key} item={item} active={active} onNavigate={onNavigate} />
      ))}
      <span className={styles.captureSlot}>
        <button
          type="button"
          className={styles.fab}
          aria-expanded={captureOpen}
          aria-label="إضافة سريعة"
          onClick={onToggleCapture}
        >
          <span className={styles.fabIcon}>
            <IconPlus />
          </span>
        </button>
      </span>
      {trailingItems.map((item) => (
        <NavItem key={item.key} item={item} active={active} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
