import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

import NewsletterPopup from "../components/PopUp";
import Chatbot from "../components/Chatbot";

export default function DefaultLayout() {


    return (
        <>
            <AppHeader />
            <Outlet />
            <NewsletterPopup />
            <Chatbot />
            <AppFooter />
        </>
    )
}