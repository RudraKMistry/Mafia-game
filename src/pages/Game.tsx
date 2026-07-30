import { useParams } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useGameState } from '../hooks/useGameState';
import GameDesktop from './GameDesktop';
import MobileGame from './mobile/MobileGame';
import EdoGame from './edo/EdoGame';
import EdoMobileGame from './edo-mobile/EdoMobileGame';

export default function Game() {
  const { id } = useParams();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const gameStateData = useGameState(id);

  const theme = localStorage.getItem('mafia_theme') || 'edo';

  if (isMobile) {
    if (theme === 'edo') return <EdoMobileGame gameStateData={gameStateData} />;
    return <MobileGame gameStateData={gameStateData} />;
  }

  if (theme === 'edo') {
    return <EdoGame gameStateData={gameStateData} />;
  }

  return <GameDesktop gameStateData={gameStateData} />;
}
