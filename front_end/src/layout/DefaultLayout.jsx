import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

import NewsletterPopup from "../components/PopUp";
import Chatbot from "../components/Chatbot";
import { useShop } from "../contexts/GlobalContext";
import AppSideBarCart from "../components/AppSideBarCart";

export default function DefaultLayout() {
    const { isVisibleCart } = useShop()

    return (
        <>
            <AppHeader />
            <Outlet />
            <NewsletterPopup />
            <Chatbot />
            <AppFooter />
            {

                isVisibleCart && <AppSideBarCart />

            }
        </>
    )
}