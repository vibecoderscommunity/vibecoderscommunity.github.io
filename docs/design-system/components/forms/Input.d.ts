import * as React from "react";
/**
 * Text field: mono type, ink border, inset pixel shadow on focus. Label set in pixel caps.
 * @startingPoint section="Components" subtitle="Mono text field with pixel-caps label" viewport="700x160"
 */
export interface InputProps {
  label?: string;
  /** Helper text under the field */
  hint?: string;
  /** Error message; turns border red */
  error?: string;
  /** Leading glyph/text inside the field, e.g. "@" or "▸" */
  prefix?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
