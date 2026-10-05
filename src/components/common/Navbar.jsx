import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Upload, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Plus,
  Compass,
  Wand2,
  Code2,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../auth/AuthModal.jsx';
import SearchModal from './SearchModal.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut, isSupabaseConfigured } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener for quick search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Templates', path: '/explore?sort=popular', icon: Layers },
    { name: 'Generator', path: '/generator', icon: Wand2 },
    { name: 'Editor', path: '/editor', icon: Code2 },
    { name: 'Upload', path: '/upload', icon: Upload },
  ];

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileNavOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E1D6] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left: Brand & Navigation */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none">
              <div className="w-7 h-7 rounded-md bg-[#18181B] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                <span>P</span>
                <span className="text-[#F59E0B]">H</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-sm tracking-tight text-[#18181B]">
                  PortfolioHub
                </span>
                <span className="text-[10px] font-mono text-[#D97706] font-semibold uppercase tracking-wider">
                  Dev
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path.includes('?') && location.pathname + location.search === item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#18181B] bg-[#F3EFE6] font-semibold shadow-2xs'
                        : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97706]' : 'text-[#71717A]'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#D97706] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Status, Auth, and Primary Action */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white hover:bg-[#F3EFE6] border border-[#E6E1D6] hover:border-[#D1CBC0] text-xs text-[#52525B] hover:text-[#18181B] transition-all cursor-pointer shadow-2xs"
              title="Search Portfolios (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Search styles...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E6E1D6] rounded text-[#71717A]">
                ⌘K
              </kbd>
            </button>

            {/* Supabase status indicator
            <button 
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-[#52525B] bg-[#F3EFE6] border border-[#E6E1D6] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Click to view Supabase Cloud Status & Connection Settings"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-medium">{isSupabaseConfigured ? 'Supabase' : 'Local'}</span>
            </button> */}

            {/* User or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-md border border-[#E6E1D6] bg-white hover:bg-[#F3EFE6] transition-colors text-xs font-medium text-[#18181B] cursor-pointer shadow-2xs"
                >
                  <span className="max-w-[120px] truncate">
                    {profile?.username || user.email?.split('@')[0]}
                  </span>
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover border border-[#E6E1D6]"
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-white p-1.5 shadow-md z-50 border border-[#E6E1D6] animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#E6E1D6] mb-1">
                      <p className="text-[11px] text-[#71717A]">Signed in as</p>
                      <p className="text-xs font-semibold text-[#18181B] truncate">{user.email || profile?.username}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-bold font-mono">
                          ADMIN ACCESS
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#18181B] hover:bg-[#F3EFE6] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>My Profile & Starred</span>
                    </Link>

                    <Link
                      to="/generator"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#18181B] hover:bg-[#F3EFE6] transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>New Portfolio</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#18181B] hover:bg-[#F3EFE6] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#71717A]" />
                        <span>Platform Admin</span>
                      </Link>
                    )}

                    <div className="border-t border-[#E6E1D6] my-1"></div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-medium text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-[#F3EFE6] text-[#18181B] border border-[#E6E1D6] transition-colors cursor-pointer shadow-2xs"
                >
                  Join
                </button>
              </div>
            )}

            {/* Direct Create Action button with Amber Accent */}
            <Link
              to="/generator"
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create portfolio</span>
            </Link>

          </div>

          {/* Mobile Menu & Search Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#52525B] hover:text-[#18181B] rounded-md hover:bg-[#F3EFE6]"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 text-[#52525B] hover:text-[#18181B] rounded-md hover:bg-[#F3EFE6]"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden border-b border-[#E6E1D6] bg-white p-4 space-y-3 shadow-md animate-in fade-in duration-150">
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-[#F3EFE6] text-[#18181B] font-semibold'
                        : 'text-[#52525B] hover:bg-[#FAF8F5] hover:text-[#18181B]'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#71717A]'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E6E1D6] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#18181B] hover:bg-[#FAF8F5]"
                  >
                    <User className="w-4 h-4 text-[#71717A]" />
                    <span>My Profile ({profile?.username || user.email})</span>
                  </Link>
                  <Link
                    to="/generator"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold bg-[#F59E0B] text-[#18181B]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create portfolio</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="py-2 text-center rounded-md text-xs font-medium border border-[#E6E1D6] text-[#18181B] hover:bg-[#FAF8F5]"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="py-2 text-center rounded-md text-xs font-semibold bg-[#F59E0B] text-[#18181B] hover:bg-[#D97706]"
                  >
                    Create portfolio
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
