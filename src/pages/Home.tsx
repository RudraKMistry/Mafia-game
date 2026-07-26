
import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile/MobileHome';
import EdoHome from './edo/EdoHome';
import EdoMobileHome from './edo-mobile/EdoMobileHome';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const theme = localStorage.getItem('mafia_theme') || '1930s';

  if (isMobile) {
    if (theme === 'edo') return <EdoMobileHome />;
    return <MobileHome />;
  }

  if (theme === 'edo') {
    return <EdoHome />;
  }

  return <DesktopHome />;
}
