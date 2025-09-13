import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto">

      <h1 className="text-xl text-center font-bold">
  <span className="bg-white px-2 rounded inline-block">
    <span className="text-green-600">Bio</span>
    <span className="text-gray-900">Raksha</span>
  </span>
</h1>

        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BioRaksha. All rights reserved.
        </div>
      </div>

    </footer>
  );
};

export default Footer;
