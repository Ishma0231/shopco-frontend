"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector,useDispatch } from "react-redux"
import Rating from "@mui/material/Rating"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

import { getProducts } from "@/services/productService"
import { getAllReviews } from "@/services/reviewService"

import ProductCard from "@/components/product/productCard"
import ProductGridSkeleton from "@/components/homePage/homeProductCardGridSkeleton"
import ReviewGridSkeleton from "@/components/homePage/reviewCardGridSkeleton"
import AuthModal from "@/components/auth/authModal"



export default function HomePage() {
    const [newArrivals, setNewArrivals] = useState([])
    const [newArrivalsLoading, setNewArrivalsLoading] = useState(false)

    const [topSelling, setTopSelling] = useState([])
    const [topSellingLoading, setTopSellingLoading] = useState(false)

    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(false)

    const [openAuthModal, setOpenAuthModal] = useState(false)
    const dispatch=useDispatch()
    const { user,isAuthenticated,authInitialised} = useSelector((state) => state.auth)

    useEffect(() => {
      if (!authInitialised){
        return
      }
      const hasSeenAuthModal=localStorage.getItem("auth_modal_seen")
      if (hasSeenAuthModal){
        return
      }

      let timer
      if (authInitialised && user===null && !isAuthenticated){
         timer=setTimeout(()=>{
          setOpenAuthModal(true)
        localStorage.setItem("auth_modal_seen", "true")
          },2000)
         
      }
         return ()=>{clearTimeout(timer)}
    }, [authInitialised])


    console.log("profile",user?.profile_image||"nothing")
    useEffect(()=>{
         if (!authInitialised){
        return
      }
         const fetchNewArrivals = async () => {
            try {
                setNewArrivalsLoading(true)

                const response = await getProducts({
                    is_new_arrival: true,
                    ordering: "-created_at",
                    page_size: 4
                })
                console.log("New arrivals response:", response.data);
                setNewArrivals(response.data.results || [])
            } catch (error) {
                console.error("Failed to fetch new arrivals:", error)
                setNewArrivals([])
            } finally {
                setNewArrivalsLoading(false)
            }
        }

        fetchNewArrivals()
    },[authInitialised])

    useEffect(() => {
       if (!authInitialised){
        return
      }
        const fetchTopSelling = async () => {
            try {
                setTopSellingLoading(true)

                const response = await getProducts({
                    ordering: "-rating",
                    page_size: 4
                })
                 console.log("top seller  response:", response.data);
                setTopSelling(response.data.results || [])
            } catch (error) {
                console.error("Failed to fetch top selling:", error)
                setTopSelling([])
            } finally {
                setTopSellingLoading(false)
            }
        }

        fetchTopSelling()
    }, [authInitialised])

    useEffect(() => {
       if (!authInitialised){
        return
      }
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true)

                const response = await getAllReviews({
                    ordering: "-rating",
                    page_size: 5
                })

                setReviews(response.data.results || [])
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
                setReviews([])
            } finally {
                setReviewsLoading(false)
            }
        }

        fetchReviews()
    }, [authInitialised])

    const handleWishlistToggle=async(product)=>{
            if (!isAuthenticated){
                setOpenAuthModal(true)
                return
            }
            try{
                if(product.wishlist_data?.is_wishlisted){
                    const response=await dispatch(removeWishlistItemThunk(
                        product.wishlist_data.wishlist_id
                    )).unwrap();
                    dispatch(
                        updateProductWishlist({
                            productId:product.id,
                            isWishlisted:false,
                            wishlistId:null
                        })
                    )
                    
                }
                else{
                    const response=await dispatch(addWishlistItem(
                        {variant:product.featured_variant_id}
                    )).unwrap();
                    dispatch(
                        updateProductWishlist({
                            productId:product.id,
                            isWishlisted:true,
                            wishlistId:response.wishlist_id
                        })
                    )
                   
                }
            }
            catch(error){
                console.error(error)
            }
         }

    return (
        <main className="w-full dark:bg-zinc-950">

            <section className="flex md:max-h-[900px] flex-col md:flex-row overflow-hidden dark:text-white">

                <div className="flex w-full flex-col px-6 py-20 md:w-1/2 md:px-12 lg:px-16">
                    <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
                        FIND CLOTHES
                        THAT MATCHES
                        YOUR STYLE
                    </h1>

                    <p className="mt-6 max-w-lg text-sm text-gray-600 dark:text-gray-300 md:text-base">
                        Browse through our diverse range of meticulously
                        crafted garments, designed to bring out your
                        individuality and cater to your sense of style.
                    </p>

                    <Link
                        href="/products"
                        className="mt-7 w-fit rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:scale-105 dark:bg-white dark:text-black"
                    >
                        Shop Now
                    </Link>

                    <div className="mt-10 grid max-w-lg grid-cols-3">
                        <div>
                            <p className="text-2xl font-bold md:text-3xl">
                                200+
                            </p>
                            <p className="text-xs text-gray-500">
                                International Brands
                            </p>
                        </div>

                        <div className="border-l border-gray-300 pl-4">
                            <p className="text-2xl font-bold md:text-3xl">
                                2,000+
                            </p>
                            <p className="text-xs text-gray-500">
                                High-Quality Products
                            </p>
                        </div>

                        <div className="border-l border-gray-300 pl-4">
                            <p className="text-2xl font-bold md:text-3xl">
                                30,000+
                            </p>
                            <p className="text-xs text-gray-500">
                                Happy Customers
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full aspect-square md:w-1/2 overflow-hidden flex justify-center">
                    <img
                        src="/images/herobanner.avif"
                        alt="Fashion collection"
                        className=" h-full w-full object-cover"
                    />
                </div>

            </section>
            <div className="w-full  h-24 bg-black">
                 <img
                 src="/images/brandborder.avif"
                 alt="brands"
                 className="h-full w-full object-cover"
                 />
            </div>


            <section className="px-4 py-16 md:px-8 lg:px-12">

                <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                    NEW ARRIVALS
                </h2>

                {newArrivalsLoading || !authInitialised ? (
                    <ProductGridSkeleton />
                ) : (
                    <>
                        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 px-10 min-[500px]:px-3">
                            {newArrivals.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onWishlistToggle={handleWishlistToggle}
                                    openAuthModal={() => setOpenAuthModal(true)}
                                />
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/products?is_new_arrival=true"
                                className="inline-block rounded-full border active:scale-95 border-black px-8 py-3 text-sm font-medium transition duration-300 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                                View All
                            </Link>
                        </div>
                    </>
                )}

            </section>


            <section className="px-4 py-16 md:px-8 lg:px-12">

                <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                    TOP SELLING
                </h2>

                {topSellingLoading ||!authInitialised ? (
                    <ProductGridSkeleton />
                ) : (
                    <>
                        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 px-10 min-[500px]:px-3">
                            {topSelling.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onWishlistToggle={handleWishlistToggle}
                                    openAuthModal={() => setOpenAuthModal(true)}
                                />
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/products?ordering=-rating"
                                className="inline-block rounded-full border active:scale-95 border-black px-8 py-3 text-sm font-medium transition duration-300 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                                View All
                            </Link>
                        </div>
                    </>
                )}

            </section>


            <section className="px-4 mx-2 py-16 md:px-16 md:mx-8 lg:px-12">

                <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                    BROWSE BY STYLE
                </h2>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 dark:text-black">

                    <Link
                        href="/products?style=casual"
                        className="group relative block h-[400px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="/images/casual2.avif"
                            alt="Casual"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4 bg-white rounded-full p-2 shadow-md">
                            <h3 className="text-xl font-bold">
                                Casual
                            </h3>
                        </div>
                    </Link>

                    <Link
                        href="/products?style=formal"
                        className="group relative block h-[400px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="/images/formal2.avif"
                            alt="Formal"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4 bg-white rounded-full p-2 shadow-md">
                            <h3 className="text-xl font-bold">
                                Formal
                            </h3>
                        </div>
                    </Link>

                    <Link
                        href="/products?style=party"
                        className="group relative block h-[400px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="/images/party.avif"
                            alt="Party"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4 bg-white rounded-full p-2 shadow-md">
                            <h3 className="text-xl font-bold">
                                Party
                            </h3>
                        </div>
                    </Link>

                    <Link
                        href="/products?style=gym"
                        className="group relative block h-[400px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="/images/gym.avif"
                            alt="Gym"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4 bg-white rounded-full p-2 shadow-md">
                            <h3 className="text-xl font-bold">
                                Gym
                            </h3>
                        </div>
                    </Link>

                </div>

            </section>


            <section className="px-4 py-16 md:px-8 lg:px-12">

                <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
                    OUR HAPPY CUSTOMERS
                </h2>

                {reviewsLoading || !authInitialised ? (
                    <ReviewGridSkeleton />
                ) : (
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2
                            },
                            
                        }}
                        loop={reviews.length > 1}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id}>
                                <article className="h-[200px] rounded-2xl border border-gray-600/40 p-6 dark:border-zinc-700">

                                    <Rating
                                        value={review.rating}
                                        readOnly
                                        size="small"
                                    />

                                   <p className="font-semibold">{review.first_name} {review.last_name}</p>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-800 dark:text-gray-300">
                                        {review.comment}
                                    </p>

                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

            </section>


            {openAuthModal && (
                <AuthModal
                    onClose={() => setOpenAuthModal(false)}
                />
            )}

        </main>
    )
}