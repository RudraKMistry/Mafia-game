import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../contexts/ThemeContext';
import GameDesktop from './GameDesktop';
import MobileGame from './mobile/MobileGame';
import ModernDesktopGame from './modern/ModernDesktopGame';
import ModernMobileGame from './modern/ModernMobileGame';

export default function Game() {
  const { id: roomId } = useParams();
  const gameStateData = useGameState(roomId);
  
  // We consider screens narrower than 768px (Tailwind 'md' breakpoint) to be mobile.
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();

  if (theme === 'modern') {
    return isMobile ? <ModernMobileGame gameStateData={gameStateData} /> : <ModernDesktopGame gameStateData={gameStateData} />;
  }

  if (isMobile) {
    return <MobileGame gameStateData={gameStateData} />;
  }

  return <GameDesktop gameStateData={gameStateData} />;
}
