/* eslint-disable jsx-a11y/label-has-associated-control */
import "./styles.css";

export interface SwitchProps {
  id: string;
  isClicked?: boolean;

  onClick?: () => unknown;
}

export default function Switch(props: SwitchProps) {
  const { id, isClicked = false, onClick } = props;
  return (
    <label htmlFor={id} className="relative switch">
      <input
        type="checkbox"
        className="w-px h-px absolute top-0 left-0"
        id={id}
        checked={isClicked}
        onChange={() => onClick?.()}
      />
      <div className="toggleBackground"></div>
    </label>
  );
}
