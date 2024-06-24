import HeaderSession from '@/components/session/HeaderSession';
import { isMobile } from '@/lib/isMobile';
import { redirect } from 'next/navigation';

function SessionLayout({ children }: { children: React.ReactNode }) {
  const mobile = isMobile();
  if (mobile) {
    redirect('/controller');
  }
  return (
    <>
      <HeaderSession />
      {children}
    </>
  );
}

export default SessionLayout;
