"use client"
import {editProfileThunk} from "@/features/auth/authSlice"
import {useDispatch,useSelector} from "react-redux"
import { useState,useEffect} from "react"
import ProfileImageModal from "../../components/profile/profileImageEditModal"
import { TextField } from "@mui/material"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"
import Link from "next/link"
import { Pencil, ChevronRight,LoaderCircle } from "lucide-react"
import PhoneInput,{ isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { Breadcrumbs, } from "@mui/material"
import { UserRound } from "lucide-react"

export default function Profile(){
  const dispatch=useDispatch()
  const {user,editProfileLoading,isAuthenticated,authInitialised,accessToken}=useSelector((state)=>state.auth)
  const [profileImageModal,setProfileImageModal]=useState(false)
  const [editMode,setEditMode]=useState(false)
  const [error,setError]=useState({})
  const [firstName,setFirstName]=useState(user?.first_name||"")
  const [lastName,setLastName]=useState(user?.last_name||"")
  const [phoneNumber,setPhoneNumber]=useState(user?.phone_number||"")
  
  const params=new URLSearchParams()
  params.set("next","/profile")
  const loginURL=`/login?${params.toString()}`
  const signupURL=`/signup?${params.toString()}`

  useEffect(() => {
  if (user) {
    setFirstName(user.first_name ?? "")
    setLastName(user.last_name ?? "")
    setPhoneNumber(user.phone_number ?? "")
  }
}, [user])

if (!authInitialised) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle size={28} className="animate-spin" />
    </div>
  )
}

if (!user || !isAuthenticated) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">

      <div className="w-full max-w-md rounded-3xl 
                      bg-white dark:bg-gray-900
                      border border-gray-400/70 dark:border-gray-800
                      shadow-xl
                      px-8 py-10 text-center">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center
                        rounded-full
                        bg-blue-50 dark:bg-blue-500/10
                        text-blue-600 dark:text-blue-400">
          <UserRound className="text-blue-600" size={20}/>
        </div>

        <h2 className="text-2xl font-semibold
                       text-gray-900 dark:text-white">
          View Your Profile
        </h2>

        <p className="mt-2 text-sm leading-6
                      text-gray-500 dark:text-gray-400">
          Please log in to access your profile and manage your account.
        </p>

      
        <div className="mt-7 flex flex-col sm:flex-row
                        items-center justify-center gap-3">

          <Link
            href={loginURL}
            className="w-full sm:w-auto min-w-[130px]
                       rounded-xl
                       bg-blue-600 hover:bg-blue-700
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       px-6 py-3
                       text-sm font-semibold text-white
                       shadow-md dark:shadow-blue-500/20
                       transition-all duration-200
                       hover:-translate-y-0.5
                       active:translate-y-0
                       active:scale-95
                       text-center"
          >
            Log in
          </Link>

          <Link
            href={signupURL}
            className="w-full sm:w-auto min-w-[130px]
                       rounded-xl
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       px-6 py-3
                       text-sm font-semibold
                       text-gray-800 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       hover:border-gray-400 dark:hover:border-gray-600
                       transition-all duration-200 shadow-md dark:shadow-white/10
                       hover:-translate-y-0.5
                       active:translate-y-0
                       active:scale-95
                       text-center"
          >
            Sign up
          </Link>

        </div>

      </div>
    </div>
  )
}

 const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
        ? user.profile_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${user.profile_image}`
    : process.env.NEXT_PUBLIC_GUEST_USER_DP

  const handleSubmit=async(e)=>{
            e.preventDefault()
            const newErrors={}
            if (!firstName.trim()){
                newErrors.firstName="Please fill this field"
            }
            if (!lastName.trim()){
                newErrors.lastName="Please fill this field"
            }
           if (!phoneNumber || !phoneNumber.trim()) {
            newErrors.phoneNumber = "Please fill this field"
           }
         else if (!isValidPhoneNumber(phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number"
        }
            setError(newErrors)
            if (Object.keys(newErrors).length>0){
                return
            }
            const data={}
            if (firstName !== user.first_name){
                data.first_name=firstName
            }
            if (lastName !== user.last_name){
                data.last_name=lastName
            }
            if (phoneNumber !== user.phone_number){
                data.phone_number=phoneNumber
            }
            if (Object.keys(data).length===0){
                return 
            }
            try{
                await dispatch(editProfileThunk(data)).unwrap()
                dispatch(setSnackbarMessage("Profile successfully updated"))
                setEditMode(false)
               
            }
            catch(error){
                dispatch(setSnackbarMessage("Something went wrong.Please try again"))
            }
  }

  const handleOnCancel=()=>{
        setEditMode(false)
        setFirstName(user?.first_name)
        setLastName(user?.last_name)
        setPhoneNumber(user?.phone_number)

  }


     if (!authInitialised) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <div className="p-5 rounded-xl shadow-xl flex justify-center items-center bg-white dark:bg-gray-900">
                <LoaderCircle
                    size={28}
                    className="animate-spin text-gray-700 dark:text-gray-200"
                />
            </div>
        </div>
    )
}
 return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">

        {/* Breadcrumb */}
        <div className="mx-auto w-full max-w-4xl mb-6">
            <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRight size={18} />}
            >
                <Link
                    href="/"
                    className="text-blue-500 font-semibold dark:text-blue-400"
                >
                    Home
                </Link>

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Profile
                </span>
            </Breadcrumbs>
        </div>


            <div className="mx-auto w-full max-w-3xl">

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-8">

                    {/* Profile header */}
                    <div className="flex flex-col items-center">

                        <div className="relative w-32 h-32">
                            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-800">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setProfileImageModal(true)}
                                className="absolute bottom-0 right-0 p-2 rounded-full
                                bg-white dark:bg-gray-800
                                text-gray-700 dark:text-gray-200
                                shadow-lg border border-gray-200 dark:border-gray-700
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                transition active:scale-95"
                            >
                                <Pencil size={17} />
                            </button>
                        </div>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 flex flex-col gap-5"
                    >

                        <TextField
                            label="First Name"
                            required
                            type="text"
                            value={firstName}
                            disabled={!editMode}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={Boolean(error.firstName)}
                            helperText={error.firstName}
                            fullWidth
                        />

                        <TextField
                            label="Last Name"
                            required
                            type="text"
                            value={lastName}
                            disabled={!editMode}
                            onChange={(e) => setLastName(e.target.value)}
                            error={Boolean(error.lastName)}
                            helperText={error.lastName}
                            fullWidth
                        />

                        <div>
                            <PhoneInput
                                international
                                defaultCountry="IN"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                disabled={!editMode}
                                placeholder="Enter phone number"
                                className="flex items-center
                                rounded-lg
                                border border-gray-300
                                dark:border-gray-700
                                bg-white dark:bg-gray-900
                                px-3 py-2
                                text-gray-900 dark:text-white
                                focus-within:border-blue-500"
                            />

                            {error.phoneNumber && (
                                <p className="text-sm text-red-600 mt-1">
                                    {error.phoneNumber}
                                </p>
                            )}
                        </div>


                        {!editMode ? (

                            <button
                                type="button"
                                onClick={() => setEditMode(true)}
                                className="w-full rounded-lg bg-blue-500
                                text-white px-4 py-3 font-semibold
                                hover:bg-blue-600
                                transition active:scale-[0.99]"
                            >
                                Edit Profile
                            </button>

                        ) : (

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={editProfileLoading}
                                    className="flex-1 rounded-lg bg-blue-500
                                    text-white px-4 py-3 font-semibold
                                    hover:bg-blue-600
                                    transition active:scale-[0.99]
                                    flex items-center justify-center"
                                >
                                    {editProfileLoading ? (
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOnCancel}
                                    className="flex-1 rounded-lg
                                    bg-gray-100 dark:bg-gray-800
                                    text-gray-800 dark:text-gray-200
                                    px-4 py-3 font-semibold
                                    hover:bg-gray-200 dark:hover:bg-gray-700
                                    transition active:scale-[0.99]"
                                >
                                    Cancel
                                </button>

                            </div>

                        )}

                    </form>

                </div>

            </div>

        {profileImageModal && (
            <ProfileImageModal
                onClose={() => setProfileImageModal(false)}
            />
        )}

    </div>
)
}