export default function KeyLegend() {
  const Key = ({ children }: { children: React.ReactNode }) => (
    <kbd className="legend__key">{children}</kbd>
  );

  return (
    <div className="legend" aria-label="Keyboard navigation legend" title="Keyboard navigation">
      <div className="legend__group">
        <Key>↑</Key><Key>↓</Key><span className="legend__label">select</span>
      </div>
      <span className="legend__dot">•</span>
      <div className="legend__group">
        <Key>Enter</Key><Key>→</Key><span className="legend__label">open</span>
      </div>
      <span className="legend__dot">•</span>
      <div className="legend__group">
        <Key>Esc</Key><Key>Backspace</Key><Key>←</Key><span className="legend__label">up</span>
      </div>
    </div>
  );
}
