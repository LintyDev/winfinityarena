import StartMenu from '@/components/StartMenu';
import { isMobile } from '@/lib/isMobile';

export default function Home() {
  const mobile = isMobile();
  return (
    <main className="flex flex-col items-center">
      <h1 className="title mt-10">Menu</h1>
      <StartMenu isMobile={mobile} />
    </main>
  );
}
