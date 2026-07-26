
import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile/MobileHome';
import EdoHome from './edo/EdoHome';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const theme = localStorage.getItem('mafia_theme') || '1930s';

  if (isMobile) {
    return <MobileHome />;
  }

  if (theme === 'edo') {
    return <EdoHome />;
  }

  return <DesktopHome />;
}
