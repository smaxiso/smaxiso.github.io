"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import siteConfig from "@/data/site-config.json";

export default function Header() {
    const [toggle, setToggle] = useState(false);
    const [activeLink, setActiveLink] = useState("#home");
    const [theme, setTheme] = useState("light");
    const [scrolled, setScrolled] = useState(false);

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            // Header shadow
            if (window.scrollY >= 200) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Active link highlighting
            const sections = document.querySelectorAll("section[id]");
            const scrollY = window.scrollY;

            sections.forEach((current: any) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveLink("#" + sectionId);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`l-header ${scrolled ? "shadow-md" : ""}`}>
            <nav className="nav bd-grid">
                <Link href="/" className="nav__logo">
                    {siteConfig.navigation.logo}
                </Link>

                <div className={`nav__menu ${toggle ? "show" : ""}`} id="nav-menu">
                    <ul className="nav__list">
                        {siteConfig.navigation.items.map((item) => (
                            <li key={item.href} className="nav__item">
                                <Link
                                    href={item.href}
                                    className={`nav__link ${activeLink === item.href ? "active-link" : ""}`}
                                    onClick={() => setToggle(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* Theme Toggle in Menu for Mobile */}
                        <li className="nav__item">
                            <button
                                onClick={toggleTheme}
                                className="nav__link cursor-pointer border-none bg-transparent"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'light' ? <i className='bx bx-moon'></i> : <i className='bx bx-sun'></i>}
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="nav__toggle" onClick={() => setToggle(!toggle)}>
                    <i className="bx bx-menu"></i>
                </div>
            </nav>
        </header>
    );
}
