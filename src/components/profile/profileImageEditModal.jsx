"use client"
import { useState,useRef } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice";
import { Trash2,Plus,X ,LoaderCircle} from "lucide-react";
import {deleteProfileImageThunk,addProfileImage} from "@/features/auth/authSlice"
import Cropper from "react-easy-crop"


export default function ProfileImageModal({onClose}){
    const dispatch=useDispatch()
    const inputRef=useRef()
    const {user,deleteProfileImageLoading,addProfileImageLoading}=useSelector((state)=>state.auth)
    const [selectedImage,setSelectedImage]=useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels,setCroppedAreaPixels]=useState(null)
    const [editMode,setEditMode]=useState(false)
    const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
        ? user.profile_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${user.profile_image}`
    : process.env.NEXT_PUBLIC_GUEST_USER_DP
    
    const handleImageDelete=async()=>{
        try
       {
         const response=await dispatch(deleteProfileImageThunk()).unwrap()
         dispatch(setSnackbarMessage(response.message))
       }
       catch(error){
        dispatch(setSnackbarMessage(error.message))
       }
    }
   
   
    const getCroppedImage=async(imageSource)=>{
            const image=new Image()
            image.crossOrigin = "anonymous"
            image.src=imageSource
            await new Promise((resolve)=>{
                image.onload=resolve
            })
            const canvas=document.createElement("canvas")
            const ctx=canvas.getContext("2d")
            const {x,y,width,height}=croppedAreaPixels
            canvas.width=width
            canvas.height=height
            ctx.drawImage(
                image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            )
            return new Promise((resolve)=>{
            canvas.toBlob((blob)=>{
                const file=new File(
                    [blob],
                    "profile-image.jpeg",
                    {type:"image/jpeg"}
                )
                resolve(file)
            },"image/jpeg")
        })

    }

     const handleProfileImageSubmit=async(imageSource)=>{
        const croppedImage=await getCroppedImage(imageSource)
        const formData=new FormData();
        if (croppedImage){
            formData.append("profile_image",croppedImage)
        }
        try
       { 
        const response=await dispatch(addProfileImage(formData)).unwrap()
        dispatch(setSnackbarMessage(response.message||"Upload successfull"))
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        if (editMode){
            setEditMode(false)
        }
    }
    catch(error){
        dispatch(setSnackbarMessage(error.message||"Could not upload image"))
    }
    }
   
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}>

       <div
    className="relative bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-xl p-8"
    onClick={(e) => e.stopPropagation()}
>

       <>
        {user.profile_image ? (
     <div className="relative w-full flex flex-col items-center gap-6">

    <button
        type="button"
        onClick={onClose}
        className="absolute top-0 right-0 rounded-md shadow-md active:scale-95 text-black dark:text-white"
    >
        <X size={30} />
    </button>

    {editMode ? (
        <>
            <div className="relative w-80 h-80">
                <Cropper
                    image={profileImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) => {
                        setCroppedAreaPixels(croppedAreaPixels)
                    }}
                />
            </div>

            <button
                type="button"
                onClick={() =>
                    handleProfileImageSubmit(
                       profileImage
                    )
                }
                disabled={addProfileImageLoading}
                className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold
                        shadow-md transition-all duration-200 hover:scale-105
                        hover:bg-blue-600 hover:shadow-lg
                        active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                {addProfileImageLoading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                ) : (
                    "Save"
                )}
            </button>
        </>
    ) : (
        <>
            <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                    src={profileImage}
                    alt={user.email}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex gap-3">
               <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="
                        px-5 py-2.5
                        rounded-lg
                        bg-blue-500
                        text-white
                        font-semibold
                        shadow-md
                        transition-all duration-200
                        hover:bg-blue-600
                        hover:shadow-lg
                        active:scale-95
                    "
                >
                    Edit
                </button>

               <button
                type="button"
                onClick={handleImageDelete}
                disabled={deleteProfileImageLoading}
                className="
                    p-3
                    rounded-lg
                    bg-red-50 dark:bg-red-950/40
                    text-red-600 dark:text-red-400
                    shadow-md
                    transition-all duration-200
                    hover:bg-red-100 dark:hover:bg-red-900/50
                    hover:shadow-lg
                    active:scale-95
                "
            >
                    {deleteProfileImageLoading ? (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Trash2 size={18} />
                    )}
                </button>
            </div>
        </>
    )}
</div>
    ) :(
       <>
            <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={(event)=>setSelectedImage(event.target.files[0])}
            className="hidden"
            />
                <div className="flex flex-col gap-2">
                        {selectedImage?(
                            <>
                            <div className="relative">
                             <div className="w-80 h-80">
                            <Cropper
                                image={URL.createObjectURL(selectedImage)}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedAreaPixels) => {
                                    setCroppedAreaPixels(croppedAreaPixels)
                                }}
                            />
                        </div>
                            <button
                            type="button"
                            onClick={()=>setSelectedImage(null)}
                            className="p-4 rounded-md absolute top-2 right-2 shadow-md active:scale-95 text-black"
                            ><X size={18}/></button>
                            </div>
                            </>
                        ):(
                            <div className="w-24 h-24 group aspect-square flex items-center justify-center border border-dashed border-slate-800" 
                            onClick={()=>inputRef.current?.click()}>
                            <Plus className="hover:scale-105 text-black font-semibold " size={24}/>
                            </div>
                        )}
                    
                    <button
                    type="button"
                    onClick={()=>handleProfileImageSubmit(URL.createObjectURL(selectedImage))}
                    disabled={!selectedImage || addProfileImageLoading }
                    className="active:scale-95 rounded-md p-2 bg-blue-500 text-white shadow-md hover:scale-105 duration-300 transition-transform"
                    >
                        {addProfileImageLoading?(<LoaderCircle size={18} className="animate-spin font-semibold"/>)
                        :"Upload Photo"}

                    </button>
                </div>
        </>
        )}
        </>
        </div>
        </div>

    )

}