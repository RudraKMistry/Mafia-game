
import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile/MobileHome';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return <MobileHome />;
  }

  return <DesktopHome />;
}
