import React from "react";

const About = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 pb-12 px-4">
    <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 mb-2">
          <img 
            src="/Lyvo_no_bg.png" 
            alt="Lyvo Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About <span className="text-red-600">Lyvo</span><span className="text-black">+</span></h1>
      </div>
      <p className="text-lg text-gray-700 mb-4">
        Lyvo+ is a modern co-living platform designed to connect room seekers and property owners, making shared living easy, safe, and enjoyable. Our mission is to simplify the process of finding, listing, and managing co-living spaces with trust and transparency.
      </p>
      <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Lyvo. All rights reserved.</p>
    </div>
  </div>
);

export default About;