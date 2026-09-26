import styles from "./SegmentedControl.module.css";

export interface SegmentedControlOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
}

export interface SegmentedControlProps<Value extends string> {
  readonly options: ReadonlyArray<SegmentedControlOption<Value>>;
  readonly value: Value;
  readonly onChange: (value: Value) => void;
  readonly "aria-label": string;
  readonly className?: string;
}

export function SegmentedControl<Value extends string>({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps<Value>) {
  return (
    <div
      className={[styles.track, className].filter(Boolean).join(" ")}
      role="group"
      {...rest}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.segment}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          <span dir="auto">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
