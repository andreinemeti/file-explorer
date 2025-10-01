
type Props = {
    path: string;
    onNavigate: (path: string) => void;
};

export default function Breadcrumbs(props: Props) {

  const parts = props.path.split('/').filter(segment => segment !== '');
  const crumbs: string[] = ["/"]; 
  let cumulativePath = "";
  for (let index = 0; index < parts.length; index++) {
    const currentSegment = parts[index];
    cumulativePath = cumulativePath ? `${cumulativePath}/${currentSegment}` : currentSegment;
    crumbs.push(`/${cumulativePath}`);
  }
// Result: ["/", "/photos", "/photos/2024", "/photos/2024/summer"]
  

  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        {crumbs.map((crumb, index) => {
          const label = index === 0 ? 'root' : parts[index - 1];
          return (
            <li key={crumb} className="breadcrumbs__item">
              {index > 0 && <span className="breadcrumbs__sep">/</span>}
              <button
                className="breadcrumbs__btn"
                onClick={() => props.onNavigate(index === 0 ? '' : crumb.slice(1))}
                title={label}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
