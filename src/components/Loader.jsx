import React from "react";

const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Centered Lyvo L */}
      <span className="absolute text-4xl font-extrabold text-red-600 select-none z-10" style={{ letterSpacing: '0.05em' }}>L</span>
      {/* Orbiting dots */}
      <span className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-red-600 shadow-lg animate-lyvo-orbit" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}></span>
      <span className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-red-600 shadow-md animate-lyvo-orbit2" style={{ right: 0, top: '50%', transform: 'translate(50%, -50%)' }}></span>
      <span className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-600 via-orange-400 to-red-500 shadow animate-lyvo-orbit3" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}></span>
    </div>
    {/* Custom keyframes for orbit animation */}
    <style>{`
      @keyframes lyvo-orbit {
        0% { transform: rotate(0deg) translateY(-44px) rotate(0deg); }
        100% { transform: rotate(360deg) translateY(-44px) rotate(-360deg); }
      }
      @keyframes lyvo-orbit2 {
        0% { transform: rotate(120deg) translateY(-36px) rotate(-120deg); }
        100% { transform: rotate(480deg) translateY(-36px) rotate(-480deg); }
      }
      @keyframes lyvo-orbit3 {
        0% { transform: rotate(240deg) translateY(-28px) rotate(-240deg); }
        100% { transform: rotate(600deg) translateY(-28px) rotate(-600deg); }
      }
      .animate-lyvo-orbit {
        animation: lyvo-orbit 1.2s linear infinite;
      }
      .animate-lyvo-orbit2 {
        animation: lyvo-orbit2 1.2s linear infinite;
      }
      .animate-lyvo-orbit3 {
        animation: lyvo-orbit3 1.2s linear infinite;
      }
    `}</style>
  </div>
);

export default Loader;