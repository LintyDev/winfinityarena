import Image from 'next/image';

function LoadingView() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src={'/img/logoloading.png'}
        alt="Winfinity Loading"
        width={200}
        height={200}
        priority={true}
      />
      <p className="subtitle">Chargement en cours...</p>
    </div>
  );
}

export default LoadingView;
