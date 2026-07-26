import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Reveal from './pages/Reveal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:id" element={<Lobby />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/reveal/:id" element={<Reveal />} />
      </Routes>
    </Router>
  );
}

export default App;
