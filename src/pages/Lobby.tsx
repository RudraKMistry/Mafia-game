
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../contexts/ThemeContext';
import DesktopLobby from './DesktopLobby';
import MobileLobby from './mobile/MobileLobby';
import ModernDesktopLobby from './modern/ModernDesktopLobby';
import ModernMobileLobby from './modern/ModernMobileLobby';

export default function Lobby() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();

  if (theme === 'modern') {
    return isMobile ? <ModernMobileLobby /> : <ModernDesktopLobby />;
  }

  return isMobile ? <MobileLobby /> : <DesktopLobby />;
}
