import * as React from "react";
/**
 * Dropdown select: pixel-bordered trigger, hard-shadow menu, ▾ glyph caret, red ▮ marks the pick.
 * @startingPoint section="Components" subtitle="Dropdown with hard-shadow menu" viewport="700x260"
 */
export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  label?: string;
  /** Strings or {value,label} objects */
  options: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
