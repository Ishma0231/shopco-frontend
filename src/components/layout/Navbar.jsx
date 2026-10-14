"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {usePathname,useRouter,useSearchParams } from "next/navigation";
import {useSelector,useDispatch} from "react-redux"
import { getProducts } from "@/services/productService";
import {logoutUser} from "@/features/auth/authSlice"
import {
  Menu,
  Search,
  ShoppingCart,
  X,
  ChevronDown,
  Moon,
  Heart,
  Sun,LogOut,LoaderCircle
} from "lucide-react";
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice";

export default function Navbar() {
    const pathName=usePathname()
    const [showTopBar, setShowTopBar] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isMobileShopOpen, setIsMobileShopOpen] = useState(false); // mobile
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router=useRouter()
    const [isAccountOpen,setIsAccountOpen]=useState(false)
    const dispatch=useDispatch()
    const {isAuthenticated,logoutLoading,user}=useSelector((state)=>state.auth)
    const [searchText, setSearchText] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const searchParams=useSearchParams()
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(true);

 const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
        ? user.profile_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${user.profile_image}`
    : process.env.NEXT_PUBLIC_GUEST_USER_DP
    
    
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(()=>{
    if (!showSuggestions||!searchText.trim()){
        setSearchSuggestions([])
        return
    }
    const timer=setTimeout(async()=>{
    try{
        const response=await getProducts({
            search:searchText,
            page_size:6
        })
        setSearchSuggestions(response.data.results||[])
    }
      catch (error) {
            console.error(error);
            setSearchSuggestions([]);
    }
    },300);
    return ()=>clearTimeout(timer)

  },[searchText,showSuggestions])

  const handleLogout=async()=>{
    try{
        const response=await dispatch(logoutUser()).unwrap()
        dispatch(setSnackbarMessage(response.message))
    }
    catch(error){
        dispatch(setSnackbarMessage(error.message))
    }
  }
 const handleMainSearch=(value=searchText)=>{
    if (!value.trim()){
        const searchKey=searchParams.get("search")
        if (searchKey){
            const params=new URLSearchParams(searchParams.toString())
            params.delete("search")
            setSearchSuggestions([])
            router.push(`/products?${params.toString()}`)
            
        }
        else{
           return
        }

    }
    const searchKey=searchParams.get("search")
    if (value===searchKey){
        return
    }
        else{
            const params=new URLSearchParams(searchParams.toString())
            params.set("search",value)
            setSearchSuggestions([])
            router.push(`/products?${params.toString()}`)
        }

 }
  if (pathName==="/order/success"){
        return null
    }

  return (
<header className="fixed top-0 left-0 w-full z-50 border border-black/30 bg-white shadow-md text-black dark:bg-zinc-900 dark:text-white">     
     {showTopBar && (
        <div className="bg-black dark:bg-zinc-950  text-white px-4 py-2 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto relative flex items-center justify-center">
                <p className="text-center">
                Sign up and get 20% off to your first order.{" "}
                <Link href="/signup" className="underline font-medium cursor-pointer active:scale-95">
                    Sign Up Now
                </Link>
                </p>

                <button
                onClick={() => setShowTopBar(false)}
                className="absolute right-0  active:scale-95 transition-transform"
                >
                <X size={16} />
                </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto h-16 px-2 flex items-center gap-4">
        {!isMobileSearchOpen ? (
          <>
            <button
              className="md:hidden  active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

            <Link href="/" className="text-3xl font-black tracking-tight">
              SHOP.CO
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm ml-4">
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="flex items-center gap-1  active:scale-95 transition-transform"
              >
                Shop <ChevronDown size={16} />
              </button>

              <Link href="#">On Sale</Link>
            <Link href="/products?is_new_arrival=true">
                      New Arrivals
                  </Link>
              <Link href="#">Brands</Link>
            </nav>

           <div className="hidden relative md:flex flex-1 max-w-xl">
            <div className="w-full h-11 px-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center gap-2">
                <Search onClick={() => handleMainSearch()} size={18} />

                <input
                    type="text"
                    value={searchText}
                    onChange={(e) =>{ 
                        setSearchText(e.target.value)
                        setShowSuggestions(true)
                    }}
                    placeholder="Search for products..."
                    className="w-full bg-transparent outline-none text-sm"
                />
            </div>

            {showSuggestions && searchSuggestions.length > 0 && searchText.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-zinc-800">
                    {searchSuggestions.map((product) => {
                        const productName = product.name;
                        
                        return (
                            <button
                                key={product.id}
                                type="button"
                               onClick={() => {
                                            setSearchText(product.name);
                                            setShowSuggestions(false);
                                            setSearchSuggestions([]);
                                            handleMainSearch(product.name);
                                        }}
                                 className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                {productName}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                className="md:hidden  active:scale-95 transition-transform"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <Search size={28} />
              </button>
                {mounted && (
                <button
                    onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className={`hidden md:flex relative items-center w-20 h-10 rounded-full p-1 transition-all duration-300 shadow-inner active:scale-95 transition-transform ${
                    theme === "dark"
                        ? "bg-zinc-900"
                        : "bg-zinc-200 shadow-md"
                    }`}
                >
                    <div
                    className={`absolute top-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                        theme === "dark"
                        ? "translate-x-10 bg-black-600" 
                        : "translate-x-0 bg-amber-500"
                    }`}
                    >
                    {theme === "dark" ? (
                        <Moon size={18} className="text-white" />
                    ) : (
                        <Sun size={18} className="text-white" />
                    )}
                    </div>

                    <div className="w-full flex justify-between px-2">
                    <Sun
                        size={16}
                        className={
                        theme === "dark"
                            ? "text-zinc-500"
                            : "text-zinc-400"
                        }
                    />
                    <Moon
                        size={16}
                        className={
                        theme === "dark"
                            ? "text-zinc-400"
                            : "text-zinc-400"
                        }
                    />
                    </div>
                </button>
                )}
                <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="flex h-9 w-9 items-center justify-center rounded-full
                                text-[#d8055d]
                                transition-all duration-200
                                hover:bg-[#E31B23]/10
                                hover:scale-105
                                active:scale-95"
                    >
                        <Heart size={22} strokeWidth={3} fill="currentColor" />
                    </Link>

              <button type="button"
              onClick={()=>router.push("/cart")}
              className="active:scale-95 transition-transform">
                <ShoppingCart size={28} />
              </button>

                <div className="relative">
                  <button
                  type="button"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="h-9 w-9 flex items-center overflow-hidden rounded-full border border-gray-200 transition-transform active:scale-95 dark:border-gray-700"
                  aria-label="Account"
              >
                 <img
                    src={
                        isAuthenticated && user?.profile_image
                            ? profileImage
                            : "/images/guestUser.avif"
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                />
              </button>
              {isAccountOpen && (
       <div className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-zinc-800">

            {isAuthenticated ? (
                <>
                    <Link
                        href="/order"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                        My Orders
                    </Link>
                    <Link
                        href="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                       My Profile
                    </Link>

                    <button
                        type="button"
                        disabled={logoutLoading}
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                        {logoutLoading ? (
                            <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                            <>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                        Login
                    </Link>

                    <Link
                        href="/signup"
                        onClick={() => setIsAccountOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                        Sign Up
                    </Link>
                    <Link
                        href="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                    >
                        Profile
                    </Link>
                </>
            )}

        </div>
    )}
              </div>

            </div>
          </>
        ) : (
          <div className="w-full relative flex items-center gap-3 ">
            <div className="flex-1 h-11 px-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center gap-2">
              <Search onClick={()=>handleMainSearch()} size={18} />
              <input
                autoFocus
                type="text"
                onChange={(e)=>{setSearchText(e.target.value)}}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <button className="active:scale-95 transition-transform" onClick={() => setIsMobileSearchOpen(false)}>
              <X size={24} />
            </button>
            {searchSuggestions.map((product) => {
           
                    return (
                        <button
                            key={product.id}
                            type="button"
                           onClick={() => {
                                setSearchText(product.name);
                                setSearchSuggestions([]);
                                handleMainSearch(product.name);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                        >
                            {product.name}
                        </button>
                    );
                })}
                        </div>
        )}
      </div>

      {isShopOpen && (
    <div className="hidden md:block px-4 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3 text-sm">
            <Link href="/products">All Products</Link>

            <Link href="/products?category=men">
                Men
            </Link>

            <Link href="/products?category=women">
                Women
            </Link>

            <Link href="/products?category=kids">
                Kids
            </Link>

            <Link href="/products?style=casual">
                Casual
            </Link>

            <Link href="/products?style=formal">
                Formal
            </Link>

            <Link href="/products?style=party">
                Party
            </Link>

            <Link href="/products?style=gym">
                Gym
            </Link>
        </div>
    </div>
)}

    
      <div
        className={`fixed inset-0 z-50 bg-black/40 md:hidden ${
          isMobileMenuOpen ? " opacity-100 " : " opacity-0 pointer-events-none "
        } transition-opacity duration-300`} onClick={()=>setIsMobileMenuOpen(false)}
      >                
                {/* Sidebar */}
         <div
      className={`w-72 h-full bg-white dark:bg-zinc-800 p-5 space-y-4  transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`} onClick={(e)=>e.stopPropagation()}
    >               
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Menu</h2>

                    <button className="active:scale-95 transition-transform" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                    </button>
                </div>

                {/* Shop with dropdown */}
                <div>
                    <button
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                    className="flex items-center justify-between w-full font-medium "
                    >
                    Shop
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${
                        isMobileShopOpen ? "rotate-180" : ""
                        }`}
                    />
                    </button>

                    {isMobileShopOpen && (
                  <div className="pl-4 mt-2 space-y-2 text-sm">
                      <Link href="/products" className="block">
                          All Products
                      </Link>

                      <Link href="/products?category=men" className="block">
                          Men
                      </Link>

                      <Link href="/products?category=women" className="block">
                          Women
                      </Link>

                      <Link href="/products?category=kids">
                          Kids
                      </Link>

                      <Link href="/products?style=casual" className="block">
                          Casual
                      </Link>

                      <Link href="/products?style=formal" className="block">
                          Formal
                      </Link>

                      <Link href="/products?style=party" className="block">
                          Party
                      </Link>

                      <Link href="/products?style=gym" className="block">
                          Gym
                      </Link>
                  </div>
              )}
       </div>

             <Link href="#" className="block">On Sale</Link>
               <Link href="/products?is_new_arrival=true" className="block">
                                New Arrivals
                            </Link>
                <Link href="#" className="block">Brands</Link>

                {/* Theme Toggle */}
                <div className="pt-4 border-t">
                    {mounted && (
                    <button
                        onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="flex items-center gap-2"
                    >
                        {theme === "dark" ? (
                        <>
                            <Sun size={18} /> Light Mode
                        </>
                        ) : (
                        <>
                            <Moon size={18} /> Dark Mode
                        </>
                        )}
                    </button>
                    )}
                </div>
                </div>
            </div>
            
    </header>
  );
}