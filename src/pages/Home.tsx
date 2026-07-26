
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../contexts/ThemeContext';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile/MobileHome';
import ModernDesktopHome from './modern/ModernDesktopHome';
import ModernMobileHome from './modern/ModernMobileHome';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();

  if (theme === 'modern') {
    return isMobile ? <ModernMobileHome /> : <ModernDesktopHome />;
  }

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
