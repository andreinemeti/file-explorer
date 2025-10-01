import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { FileSystemEntry } from '../types';
import { toKB } from '../lib/common';

type Props = {
  items: readonly FileSystemEntry[];
  onOpen: (entry: FileSystemEntry) => void;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  onNavigateUp: () => void;
  path: string;
};

export default function FileList(props: Props) {

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

 
  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    return () => {
      window.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]); 

  useEffect(() => {
    if (props.selectedIndex < 0) return;
    const el = itemRefs.current[props.selectedIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [props.selectedIndex]);

  function onKeyPress(keyboardEvent: KeyboardEvent) {

    const isNavigateUpKey =
      keyboardEvent.key === 'Escape' ||
      keyboardEvent.key === 'Backspace' ||
      keyboardEvent.key === 'ArrowLeft';

    if (isNavigateUpKey) {
      keyboardEvent.preventDefault();
      props.onNavigateUp();
      return;
    }

    const totalItemCount = props.items.length;
    if (totalItemCount === 0) return;

    if (keyboardEvent.key === 'ArrowDown') {
      keyboardEvent.preventDefault();
      props.setSelectedIndex((previousSelectedIndex) => {
        // If nothing is selected, start at the first item
        if (previousSelectedIndex < 0) return 0;

        // If we’re already at the last item, stay there
        const isAtLastItem = previousSelectedIndex + 1 >= totalItemCount;
        if (isAtLastItem) return totalItemCount - 1;

        // Otherwise, move down by one
        return previousSelectedIndex + 1;
      });
      return;
    }

    if (keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      props.setSelectedIndex((previousSelectedIndex) => {
        // If nothing is selected, start at the last item
        if (previousSelectedIndex < 0) return totalItemCount - 1;

        // If we’re already at the first item, stay there
        const isAtFirstItem = previousSelectedIndex - 1 < 0;
        if (isAtFirstItem) return 0;

        // Otherwise, move up by one
        return previousSelectedIndex - 1;
      });
      return;
    }

    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'ArrowRight') {
      keyboardEvent.preventDefault();
      const hasASelection = props.selectedIndex >= 0;
      if (!hasASelection) return;

      const selectedItem = props.items[props.selectedIndex];
      if (selectedItem) props.onOpen(selectedItem);
    }
  }

  const goUp = () => {
    
  }
  return (
    <div className="filelist">
        {props.path !== '' && <button className="filelist__go-up-btn" type="button" title="Go up" aria-label="Go up"
        onClick={() => props.onNavigateUp()}>&#8593; Up one level
        </button>}

      {props.items.length > 0 ? (
        <div className="filelist__scroll-container" ref={scrollRef}>
          {props.items.map((e, i) => (
            <button
              key={e.path}
              ref={(el) => { itemRefs.current[i] = el; }}
              onClick={() => props.onOpen(e)}
              className={`filelist__row ${i === props.selectedIndex ? 'is-selected' : ''}`}
              title={e.name}
              tabIndex={-1}
              type="button"
            >
              <span className="filelist__icon">
                {e.type === 'directory' ? '📁' : '📄'}
              </span>
              <span className="filelist__name">{e.name}</span>
              <span className="filelist__meta">
                {e.type === 'file' ? toKB(e.size) : 'dir'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="filelist__empty">The folder is empty.</div>
      )}
    </div>
  );
}
