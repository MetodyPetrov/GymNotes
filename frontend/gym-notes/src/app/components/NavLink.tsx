'use client';

import Link from "next/link";
import { LinkInfo } from "./Navigation";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    link: LinkInfo,
    index: number,
    children: string,
    props?: any
}

export default function NavLink({ link, index, children, ...props }:  NavLinkProps) {
    const path = usePathname();
    
    return (
        <Link 
            href={link.to}
            style={{ transition: 'all 0.4s' }}
            {...props}>
            {children}
        </Link>
    );
}