
import { toKB } from '../lib/common';
import type { FileSystemEntry } from '../types';


type Props = { entry: FileSystemEntry | null };

export default function DetailsPanel(props: Props ) {
  if (!props.entry) return <div className="panel panel--hint">Select a file or directory</div>;

  const isDir = props.entry.type === 'directory';

  return (
    <div className="panel">
      <div className="panel__title-row">
        <span
          className="panel__thumb"
          role="img"
          aria-label={isDir ? 'Folder' : 'File'}
          title={isDir ? 'Folder' : 'File'}
        >
          {isDir ? '📁' : '📄'}
        </span>
        <div className="panel__title">{props.entry.name || '/'}</div>
      </div>

      <dl className="panel__grid">
        <dt>Type</dt><dd>{props.entry.type}</dd>

        {props.entry.type === 'file' && (
          <>
            <dt>Size</dt>
            <dd title={`${props.entry.size ?? 0} bytes`}>{toKB(props.entry.size)}</dd>
          </>
        )}

        <dt>Created</dt><dd>{new Date(props.entry.createdAt).toLocaleString()}</dd>
        <dt>Modified</dt><dd>{new Date(props.entry.modifiedAt).toLocaleString()}</dd>

        <dt>Path</dt>
        <dd
          className={'panel__path'}
          title={props.entry.path || '/'}
        >
          <span id="pathText" className="panel__path-text">{props.entry.path || '/'}</span>
         
        </dd>
      </dl>
    </div>
  );
}
