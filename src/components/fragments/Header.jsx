import React from 'react';

const Header = () => {
  return (
    <header className="bg-white  w-full h-[7rem] flex items-center justify-center  top-0 z-50">
      <div className="flex items-center space-x-6">
        <img
          src="./assets/snap.png"
          alt="Logo"
          className="w-11 h-11"
        />
        <ul className="flex space-x-6 text-[1rem] font-medium">
          <li><a href="/underprocess" className="popblack underline-offset-4 font-semibold underline decoration-2 decoration-underline decoration-blue-500 hover:text-red-600 transition">Docs</a></li>
          <li><a href="/features" className="text-gray-800    hover:text-red-600 transition">Features</a></li>
          <li><a href="/notfound" className="line-through underline-offset-8 decoration-red-500 font-bold hover:text-red-600 transition">Pricing</a></li>
          <li><a href="/about" className="text-gray-800  hover:text-red-600 transition">About</a></li>
          <li><a href="#fooder"  className='popblack underline-offset-4 font-semibold underline decoration-2 decoration-wavy decoration-red-500'>Contact Me</a></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
