import Header from '@/components/Header';

function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default WebLayout;
