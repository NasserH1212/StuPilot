import type { SVGProps } from "react";

import styles from "./icons.module.css";

/**
 * Inline line icons traced from the Figma design system. All are stroke-based
 * and colored with `currentColor` so each usage site controls color (and
 * therefore light/dark theming and active/inactive state) through CSS,
 * instead of baking a color into the asset.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "fill" | "xmlns">;

function baseProps(size: number): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    focusable: false,
  };
}

export function IconForwardArrow(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M19 12H5M10 17L5 12L10 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Points left by default (the LTR "back" direction) and mirrors under
 * `:dir(rtl)`, so a single icon serves both locales without a JS branch —
 * matching the Figma "back" icon, which draws this shape and rotates it
 * 180° specifically for its RTL demo.
 */
export function IconChevronBack({ className, ...props }: IconProps) {
  return (
    <svg
      {...baseProps(24)}
      className={[styles.chevronBack, className].filter(Boolean).join(" ")}
      {...props}
    >
      <path
        d="M14 6L8 12L14 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The mirror image of IconChevronBack: points right by default (the LTR
 * "forward" direction) and mirrors under `:dir(rtl)` to point left — the
 * shape the Figma week-navigation "next" control draws directly.
 */
export function IconChevronForward({ className, ...props }: IconProps) {
  return (
    <svg
      {...baseProps(24)}
      className={[styles.chevronForward, className].filter(Boolean).join(" ")}
      {...props}
    >
      <path
        d="M10 6L16 12L10 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDismissCross(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRoute(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M10 13L14 21L21 3L3 10L10 13ZM21 3L10 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLeafBreak(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M4.77683 19.0086C1.77683 7.00859 9.77683 3.00859 19.7768 4.00859C20.7768 16.0086 12.7768 23.0086 4.77683 19.0086ZM4.77683 19.0086L14.7768 9.00859"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconKaabaBreak(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M12 3.5L4 7.5V20.5H20V7.5L12 3.5ZM12 3.5V20.5M4 10.5H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMoonBreak(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M18.9403 16.1077C9.94026 19.1077 3.94026 10.1077 8.94026 3.1077C0.940259 5.1077 0.940259 17.1077 9.94026 20.1077C13.9403 22.1077 18.9403 20.1077 20.9403 16.1077H18.9403Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClouds(props: IconProps) {
  return (
    <svg
      width={38}
      height={24}
      viewBox="0 0 38 24"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path
        d="M1.00753 13.5C-2.99247 5.5 6.00753 3.5 9.00753 7.5C9.00753 -2.5 24.0075 -2.5 25.0075 7.5C35.0075 5.5 37.0075 13.5 30.0075 15.5H3.00753"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M11 0V2M11 20V22M0 11H2M20 11H22M3 3L5 5M17 17L19 19M3 19L5 17M17 5L19 3M11 6C4 6 4 16 11 16C18 16 18 6 11 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M15.8805 13C6.88052 16 0.880518 7 5.88052 0C-2.11948 2 -2.11948 14 6.88052 17C10.8805 19 15.8805 17 17.8805 13H15.8805Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M4 21V19C4 12 20 12 20 19V21M16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M12 20C15 18 19 18 22 20V5C19 3 15 3 12 5C9 3 5 3 2 5V20C5 18 9 18 12 20ZM12 5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M7 3V7M17 3V7M3 10H21M7 14H10M14 14H17M7 18H10M5 5H19C20.3333 5 21 5.66667 21 7V19C21 20.3333 20.3333 21 19 21H5C3.66667 21 3 20.3333 3 19V7C3 5.66667 3.66667 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M3 11L12 3L21 11M5 10V21H19V10M9 21V14H15V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M5 12H19M12 5V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...baseProps(24)} {...props}>
      <path
        d="M5 12L10 17L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Spinner's rotating arc; the parent element owns the 800ms rotation animation. */
export function IconSpinnerArc(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 19.8 19.8"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path
        d="M9.9 0.9C21.9 0.9 21.9 18.9 9.9 18.9C4.9 18.9 0.9 14.9 0.9 9.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRadioIndicator({
  selected,
  ...props
}: IconProps & { readonly selected?: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <circle
        cx="10"
        cy="10"
        r="9.5"
        fill={selected ? "var(--color-accent)" : "var(--color-surface)"}
        stroke="var(--color-border)"
      />
      {selected && <circle cx="10" cy="10" r="4" fill="var(--color-accent-text)" />}
    </svg>
  );
}

export function IconCheckboxTarget({
  checked,
  ...props
}: IconProps & { readonly checked?: boolean }) {
  return (
    <svg
      width={44}
      height={44}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path
        d="M18 10.75H26C30.0041 10.75 33.25 13.9959 33.25 18V26C33.25 30.0041 30.0041 33.25 26 33.25H18C13.9959 33.25 10.75 30.0041 10.75 26V18C10.75 13.9959 13.9959 10.75 18 10.75Z"
        fill={checked ? "var(--color-accent)" : "var(--color-surface)"}
        stroke={checked ? "var(--color-accent)" : "var(--color-border)"}
        strokeWidth="1.5"
      />
      {checked && (
        <path
          d="M15 22L20 27L29 17"
          stroke="var(--color-accent-text)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
