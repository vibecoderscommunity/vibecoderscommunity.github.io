import * as React from "react";
/**
 * Pixel-styled action button: hard ink border, offset pixel shadow, lifts on hover, sinks on press.
 * @startingPoint section="Components" subtitle="Pixel button — primary, secondary, inverse, flavor" viewport="700x180"
 */
export interface ButtonProps {
  /** Visual style. "flavor" uses the `flavor` color prop */
  variant?: "primary" | "secondary" | "inverse" | "flavor";
  size?: "sm" | "md" | "lg";
  /** CSS color for variant="flavor" (e.g. "var(--lime)") */
  flavor?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
