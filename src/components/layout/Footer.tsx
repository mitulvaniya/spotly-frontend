"use client";

import React from "react";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 pt-16 pb-8 text-muted-foreground font-sans">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-1">
                            SPOTLY<span className="text-primary animate-pulse">.</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            The premium city discovery platform. Uncovering the best dining, nightlife, and hidden gems in your city.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialLink icon={Instagram} href="#" />
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Facebook} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Discover</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/trending">Trending Now</FooterLink></li>
                            <li><FooterLink href="/new">New Arrivals</FooterLink></li>
                            <li><FooterLink href="/categories">Categories</FooterLink></li>
                            <li><FooterLink href="/events">Local Events</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/about">About Us</FooterLink></li>
                            <li><FooterLink href="/careers">Careers</FooterLink></li>
                            <li><FooterLink href="/business">For Business</FooterLink></li>
                            <li><FooterLink href="/contact">Contact Support</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>123 Innovation Dr,<br />Tech City, ST 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>hello@spotly.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p>&copy; {new Date().getFullYear()} SPOTLY Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </Link>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-primary transition-colors block w-fit">
            {children}
        </Link>
    );
}
