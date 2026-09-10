import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
