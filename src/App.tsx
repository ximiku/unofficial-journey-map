import { ArchivePanel } from './components/archive/ArchivePanel';
import { EndingPage } from './components/endings/EndingPage';
import { HomePage } from './components/layout/HomePage';
import { MapPage } from './components/layout/MapPage';
import { useGame } from './state/GameContext';

export default function App() {
  const { state } = useGame();

  return (
    <main className={state.presentationMode ? 'app presentation-mode' : 'app'}>
      {state.view === 'home' && <HomePage />}
      {state.view === 'map' && <MapPage />}
      {state.view === 'archive' && <ArchivePanel />}
      {state.view === 'ending' && <EndingPage />}
    </main>
  );
}
