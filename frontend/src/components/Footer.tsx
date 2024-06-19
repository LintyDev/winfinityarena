'use client';

import { useRouter } from 'next/navigation';

function Footer() {
  const router = useRouter();

  const goToAbout = () => {
    router.push('/about');
  };

  return (
    <div className="footer">
      <small>
        © 2024 - <span className="text-simple">WinfinityArena</span> -{' '}
        <span className="underline cursor-pointer" onClick={goToAbout}>
          v1.0.0RC1
        </span>
      </small>
    </div>
  );
}

export default Footer;
