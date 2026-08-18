import * as React from "react";
/**
 * Content/event card: white surface, ink border, hard pixel shadow. Optional full-bleed square poster image on top.
 * @startingPoint section="Components" subtitle="Event card with poster, tags, footer" viewport="700x420"
 */
export interface CardTag { label: string; flavor?: string; }
export interface CardProps {
  /** Full-bleed square image (event poster) above the body */
  image?: string;
  imageAlt?: string;
  /** Small caps label above the title, red by default */
  eyebrow?: string;
  title?: React.ReactNode;
  /** Terse mono metadata line, e.g. "WED, JAN 28 · 7-9PM · Meguro" */
  meta?: string;
  /** Topic chips */
  tags?: (string | CardTag)[];
  /** Slot under the body, e.g. a Button */
  footer?: React.ReactNode;
  /** Background token for the eyebrow capsule, e.g. "var(--lime)" */
  flavor?: string;
  /** Lift on hover (for clickable cards) */
  hoverable?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
