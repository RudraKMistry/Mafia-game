
import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopLobby from './DesktopLobby';
import MobileLobby from './mobile/MobileLobby';

export default function Lobby() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return <MobileLobby />;
  }

  return <DesktopLobby />;
}
