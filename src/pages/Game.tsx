
import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useMediaQuery } from '../hooks/useMediaQuery';
import GameDesktop from './GameDesktop';
import MobileGame from './mobile/MobileGame';

export default function Game() {
  const { id: roomId } = useParams();
  const gameStateData = useGameState(roomId);
  
  // We consider screens narrower than 768px (Tailwind 'md' breakpoint) to be mobile.
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return <MobileGame gameStateData={gameStateData} />;
  }

  return <GameDesktop gameStateData={gameStateData} />;
}
