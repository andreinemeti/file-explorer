import { useEffect, useState } from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import FileList from './components/FileList';
import DetailsPanel from './components/DetailsPanel';
import { getFiles, getFileDetails } from './lib/api';
import type { FileSystemEntry } from './types';
import KeyLegend from "./components/KeyLegend";
import logo from "./assets/img/logo.png";
import { SplashAnimation } from './components/SplashAnimation';

type AppState = {
  path: string;
  entries: FileSystemEntry[];
  selectedFileDetails: FileSystemEntry | null;
  loading: boolean;
  error: string | null;
  selectedIndex: number;
  showSplash: boolean;
};

const initialState: AppState = {
  path: '',
  entries: [],
  selectedFileDetails: null,
  loading: true,
  error: null,
  selectedIndex: -1,
  showSplash: true,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

async function showDirectory(dirPath: string, previewCurrentDir = false) {
  try {
    const allFiles = await getFiles(dirPath);

    setState(prev => ({
      ...prev,
      loading: false,
      error: null,
      path: dirPath,
      entries: allFiles.entries,
      selectedFileDetails: previewCurrentDir ? allFiles.current : null,
      selectedIndex: -1,
    }));
  } catch (e: any) {
    setState(prev => ({
      ...prev,
      loading: false,
      error: e?.message || 'Failed to load',
    }));
  }
}

  useEffect(() => {
    //root directory
    showDirectory('', false);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => 
      setState(prevState => ({ 
      ...prevState, 
        showSplash: false 
      }
    )), 1200);
    return () => clearTimeout(id);
  }, []);

  async function open(entry: FileSystemEntry) {
    if (entry.type === 'directory') {
      await showDirectory(entry.path, true);
    } else {
      const details = await getFileDetails(entry.path);
      setState(prevState => ({ 
        ...prevState, 
        selectedFileDetails: details 
      }
    ));
    }
  }

  function navigateUp() {
    const parts = state.path ? state.path.split('/') : [];

    if (parts.length > 0) parts.pop();

    const parentPath = parts.join('/');

    showDirectory(parentPath);
  }

  function setSelectedIndex(index: number | ((prev: number) => number)) {
    setState(prevState => ({
      ...prevState,
      selectedIndex: typeof index === "function" ? index(prevState.selectedIndex) : index
    }
    ))
  }

  function hideSplashAnimation() {
    setState(prevState => ({
      ...prevState, showSplash: false
    }
    ));
  }
  return (
    <div className="app">
      {state.showSplash && <SplashAnimation onDone={hideSplashAnimation} />}

      <div className="app__header">
        <button
          type="button"
          onClick={() => showDirectory("")}
          title="Go to root"
          className="app__logo-btn"
          aria-label="Go to root"
        >
          <img src={logo} alt="File Explorer logo" className="app__logo" draggable="false" />
        </button>
        <div className="app__legend"><KeyLegend /></div>
      </div>

      <div className="app__breadcrumbs">
        <Breadcrumbs
          path={state.path}
          onNavigate={(path) => showDirectory(path, path !== '' ? true: false)}
        />
      </div>

      {state.error && <div className="banner banner--error">{state.error}</div>}

      <div className="app__main">
        <div className="app__list-col">
          {state.loading ? (
            <div className="panel panel--loading">Loading…</div>
          ) : (
            <FileList
              items={state.entries}
              onOpen={open}
              selectedIndex={state.selectedIndex}
              setSelectedIndex={setSelectedIndex}
              onNavigateUp={navigateUp}
            />
          )}
        </div>
        <div className="app__details-col">
          <DetailsPanel entry={state.selectedFileDetails} />
        </div>
      </div>
    </div>
  );
}
