import { SVGAttributes } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const {logos} = usePage().props as any;
    const {seo} = usePage().props as any;
    const loginLogo = logos?.favicon;
    return (
        <Link href="/">
                {loginLogo ? (
                    <img
                        src={loginLogo.path}
                        alt={loginLogo.alt ?? "Logo"}
                        className="h-12"
                    />
                ) : (
                    <span className="text-2xl font-bold">
                        {seo?.site_name}
                    </span>
                )}
            </Link>
    );
}
