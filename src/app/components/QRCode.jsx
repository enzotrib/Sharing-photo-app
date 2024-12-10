import Image from 'next/image';

const QRCode = ({size}) => {
  return (
    <div className="p-[clamp(0.5rem,1.5vw,2rem)] rounded-2xl">
      <h3 
        className="text-white font-bold mb-[clamp(0.5rem,2vw,1rem)] text-center animate-pulse
                   text-[clamp(1rem,2vw,2rem)]"
        style={{
          textShadow: `
            0 0 clamp(5px,1vw,10px) rgba(255,255,255,0.4),
            0 0 clamp(10px,2vw,20px) rgba(255,255,255,0.2)
          `,
          background: 'linear-gradient(to right, #fff, #e0e0e0, #fff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% auto',
          animation: 'shine 3s linear infinite'
        }}
      >
        ¡Dejanos tu Selfie!
      </h3>
      <div 
        style={{
          filter: `
            drop-shadow(0 0 clamp(5px,1vw,10px) rgba(255,255,255,0.3))
            drop-shadow(0 0 clamp(10px,2vw,20px) rgba(255,255,255,0.2))
          `,
          transition: 'all 0.3s ease'
        }}
        className="hover:brightness-110 hover:scale-105 flex flex-col justify-center items-center
                   bg-white rounded-lg relative w-[clamp(180px,15vw,280px)] h-[clamp(180px,15vw,280px)]"
      >
        <Image 
          src={"/images/qr.png"}
          alt="QR Code para selfie"
          fill
          priority
          className="object-contain p-[0.2rem]"
          sizes="(max-width: 768px) 180px, 280px"
        />
      </div>
    </div>
  );
};

export default QRCode;