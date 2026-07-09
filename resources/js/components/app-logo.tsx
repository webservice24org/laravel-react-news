import AppLogoIcon from './app-logo-icon';
import {usePage } from "@inertiajs/react"
export default function AppLogo() {
    const { logos, settings } = usePage().props as any;
    const dashboardLogo = logos?.dashboard;
    
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {dashboardLogo ? (
                        <img
                            src={dashboardLogo.path}
                            alt="Dashboard Logo"
                            className="h-10 w-auto object-contain"
                        />
                    ) : (
                        <span className="font-bold text-xl">
                            {settings.website_name}
                        </span>
                    )}
                </span>
            </div>
        </>
    );
}
