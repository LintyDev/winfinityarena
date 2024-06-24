import { isMobile } from '@/lib/isMobile';
import { redirect } from 'next/navigation';

function ControllerLayout({ children }: { children: React.ReactNode }) {
  const mobile = isMobile();
  if (!mobile) {
    redirect('/session');
  }
  return <>{children}</>;
}

export default ControllerLayout;
