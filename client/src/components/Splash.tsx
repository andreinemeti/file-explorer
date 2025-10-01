import { useEffect } from 'react';
import logo from '../assets/img/logo.png';

type Props = { onDone: () => void; durationMs?: number };

export default function Splash({ onDone, durationMs = 1200 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs);
    return () => clearTimeout(id);
  }, [onDone, durationMs]);

  return (
    <div className="splash" role="status" aria-label="Loading File Explorer">
      <button className="splash__inner" onClick={onDone} aria-label="Skip intro">
        <img src={logo} alt="File Explorer logo" className="splash__logo" />
      </button>
    </div>
  );
}
