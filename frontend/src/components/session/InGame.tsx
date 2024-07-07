'use client';
import dynamic from 'next/dynamic';
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/games/uno_pokemon/components/Game'),
  { ssr: false }
);

function InGame() {
  return <DynamicComponentWithNoSSR />;
}

export default InGame;
