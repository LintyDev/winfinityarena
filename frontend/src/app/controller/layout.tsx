import { SocketControllerProvider } from '@/contexts/SocketControllerContext';
import { isMobile } from '@/lib/isMobile';
import { redirect } from 'next/navigation';

function ControllerLayout({ children }: { children: React.ReactNode }) {
  const mobile = isMobile();
  if (!mobile) {
    redirect('/session');
  }
  return <SocketControllerProvider>{children}</SocketControllerProvider>;
}

export default ControllerLayout;
