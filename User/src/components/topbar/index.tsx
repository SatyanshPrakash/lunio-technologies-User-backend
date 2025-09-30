import { Search as SearchIcon, Globe, ShoppingCart, ChevronDown, User as UserIcon, Settings, LogOut, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../assets/button"
import { Input } from "../../assets/input";
import type { JSX } from "react";
import LogoImage from "../../../assets/favicons/lunio mein logo ai febicon png-2-01.png";
import ThemeToggle from "../../assets/ThemeToggle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCart } from "../../store/slices/cartSlice";
import { logout, loadUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const Topbar = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { totalItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(loadUser());
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full flex items-center justify-between px-10 py-[15px] bg-[linear-gradient(135deg,rgba(0,194,255,1)_45%,rgba(138,43,226,1)_100%)]">
      <div className="flex items-center justify-between w-full gap-[113px]">
        <div className="flex items-center gap-[125px]">
          <img
            className="w-[130px] h-[55px]"
            alt="Lunio main logo"
            src={LogoImage}
          />

          <div className="flex items-center w-[468px] h-[52px] bg-white rounded-[30px] border-2 border-solid border-[#4682b4] shadow-[0px_4px_4px_#0000004c]">
            <div className="flex items-center pl-5">
              <SearchIcon className="w-[22px] h-[22px] text-[#4682b4]" />
            </div>
            <Input
              className="border-0 shadow-none h-full font-['Poppins',Helvetica] text-[#4682b4] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="SearchIcon for products"
            />
          </div>
        </div>

      <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={handleCartClick}
            className="relative w-[45px] h-[45px] flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
          >
            <ShoppingCart className="w-6 h-6 text-[#4682b4]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 h-[52px] px-4 bg-white rounded-[10px] border-2 border-solid border-[#7f5af0] shadow-[0px_4px_4px_#0000004c] hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.fullName)
                  )}
                </div>
                <span className="font-['Poppins',Helvetica] font-medium text-[#4682b4] text-sm hidden md:block">
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-[#4682b4]" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/order-history');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile?tab=settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleSignIn}
              className="h-[52px] px-[30px] py-0 bg-white rounded-[10px] border-2 border-solid border-[#7f5af0] shadow-[0px_4px_4px_#0000004c] font-['Poppins',Helvetica] font-normal text-[#4682b4] text-base"
            >
              Sign in
            </Button>
          )}

          <Button className="h-[52px] px-[22px] py-0 bg-coloursecondary rounded-[10px] border-2 border-solid border-white shadow-[0px_4px_4px_#0000004c] font-['Poppins',Helvetica] font-normal text-white text-base">
            <div className="relative w-6 h-6 mr-2.5">
              <div className="relative w-[18px] h-[18px] top-[3px] left-[3px]">
                  <Globe/>
              </div>
            </div>
            EN
          </Button>
        </div>
      </div>
    </header>
  );
};
