import { toggle } from '../../../logic/toggleApperance';
import style from './index.module.scss';

interface SwitchProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export function Switch(props: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      className={`${style.switch}`}
      onClick={props.onClick}
    >
      <span className={style.check}>
        <span className={style.icon}>{props.children}</span>
      </span>
    </button>
  );
}

export function SwitchApperance() {
  return (
    <Switch onClick={toggle}>
      <div className={style.sun}>
        <div className="i-carbon-sun w-full h-full"></div>
      </div>
      <div className={style.moon}>
        <div className="i-carbon-moon w-full h-full"></div>
      </div>
    </Switch>
  );
}
