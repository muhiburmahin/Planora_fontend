'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-12 border-t border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="text-xl font-bold">Planora</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Professional event management platform for organizing amazing events.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="hover:text-primary transition-colors">
                                    Explore Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Legal</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-primary transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Contact</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                <a href="mailto:hello@planora.com" className="hover:text-primary transition-colors">
                                    hello@planora.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                                    +1 (555) 123-4567
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-primary" />
                                <span>New York, USA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-400">
                        © 2026 Planora. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            title="Facebook"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            title="Twitter"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            title="LinkedIn"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            title="Instagram"
                        >
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

