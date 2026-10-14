"use client"

import { Provider } from "react-redux"
import {store} from "@/store/store"
import { ThemeProvider } from "next-themes"
import AuthInitializer from "@/components/auth/AuthInitializer"
import { GoogleOAuthProvider } from "@react-oauth/google"
export default function Providers({children}){
    
    return (
        <Provider store={store}>
            <AuthInitializer>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem>
            {children}
            </ThemeProvider>
            </GoogleOAuthProvider>
            </AuthInitializer>
        </Provider>
    )
}

