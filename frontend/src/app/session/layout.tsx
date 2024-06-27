import HeaderSession from '@/components/session/HeaderSession';
import { SocketProvider } from '@/contexts/SocketContext';
import { isMobile } from '@/lib/isMobile';
import { redirect } from 'next/navigation';

function SessionLayout({ children }: { children: React.ReactNode }) {
  const mobile = isMobile();
  if (mobile) {
    redirect('/controller');
  }
  return (
    <SocketProvider>
      <HeaderSession />
      {children}
    </SocketProvider>
  );
}

export default SessionLayout;
