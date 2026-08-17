import * as React from "react";
/**
 * Multi-pick dropdown: chosen items render as removable Tags in the trigger; menu rows show pixel checkboxes.
 * @startingPoint section="Components" subtitle="Multi-select with tag chips" viewport="700x280"
 */
export interface MultiSelectOption { value: string; label: string; }
export interface MultiSelectProps {
  label?: string;
  options: (string | MultiSelectOption)[];
  /** Selected values */
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function MultiSelect(props: MultiSelectProps): JSX.Element;
