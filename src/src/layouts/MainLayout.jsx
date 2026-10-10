/**
 * MainLayout.jsx: Layout for normal pages: Navbar on top, the current page in the middle (<Outlet />), Footer at the bottom.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col paper-grid text-ink relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
