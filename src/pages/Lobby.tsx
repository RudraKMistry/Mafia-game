
import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopLobby from './DesktopLobby';
import MobileLobby from './mobile/MobileLobby';
import EdoLobby from './edo/EdoLobby';

export default function Lobby() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const theme = localStorage.getItem('mafia_theme') || '1930s';

  if (isMobile) {
    return <MobileLobby />;
  }

  if (theme === 'edo') {
    return <EdoLobby />;
  }

  return <DesktopLobby />;
}
