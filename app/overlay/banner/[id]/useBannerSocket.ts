import { SetStateAction, useEffect } from "react";
import { useBannerManagerStore } from "@/app/store/useBannerManagerStore";
import { IBannerManager } from "@/app/types/Banner";
import socket from "@/app/service/socket";

interface IUseBannerSocket {
    setIsExiting: (value: SetStateAction<boolean>) => void;
}

export const useBannerSocket = ({ setIsExiting }: IUseBannerSocket) => {
  
    const { bannerManager, setSelectedBannerInManagerOverlay, updateBannerManagerOverlay } = useBannerManagerStore()

    const isVisible = bannerManager?.isVisible as boolean;
    const id = bannerManager?._id as string

    useEffect(() => {
        const eventName = `server:UpdateBannerManager/${id}`;

        const updateBannerManager = (data:IBannerManager) => {
            if (data.isVisible !== isVisible) {
                setIsExiting(true)

                setTimeout(() => {
                    updateBannerManagerOverlay(id, data)
                }, 1000);

                setTimeout(() => {
                    setIsExiting(false)
                }, 2000);
            } else {    
                setSelectedBannerInManagerOverlay(id, data)
            }  
        }

        socket.on(eventName, updateBannerManager)

        return () => {
            socket.off(eventName, updateBannerManager)
        }

    }, [id])
}