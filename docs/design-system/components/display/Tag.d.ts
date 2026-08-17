import * as React from "react";
/**
 * Small flavor chip for topics and metadata; optionally removable (used inside MultiSelect).
 */
export interface TagProps {
  /** Background color, e.g. "var(--lime)" | "var(--purple)" | "var(--gold)" */
  flavor?: string;
  /** Show a ✕ and call this on click */
  onRemove?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
