import * as React from "react";
/**
 * Site header: paper bar with heavy ink rule, pixel wordmark (or logo image), mono nav links, optional CTA button.
 * @startingPoint section="Components" subtitle="Site nav bar with pixel wordmark" viewport="900x120"
 */
export interface HeaderLink { label: string; href: string; }
export interface HeaderProps {
  /** Logo image; omit to render the Silkscreen wordmark */
  logoSrc?: string;
  links?: HeaderLink[];
  /** href of the current page — underlined red */
  activeHref?: string;
  /** CTA button label, e.g. "RSVP" */
  cta?: string;
  onCtaClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Header(props: HeaderProps): JSX.Element;
