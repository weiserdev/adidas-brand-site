import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { contactItems, menuSections, socialLinks } from "@/data/footer"

const Footer = () => (
    <footer className="footerbg relative z-50">
        <hr className="text-white w-full h-[1px]" />
        <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Logo and social section */}
                <div>
                    <Link href="/" className="flex text-white w-fit">
                        <Image
                            src="/other/logo-transparent.png"
                            alt="logo"
                            width={400}
                            height={400}
                            className="h-12 w-auto invert"
                        />
                    </Link>

                    <p className="mt-6 max-w-[12rem] leading-relaxed text-white">
                        Through sport, we have the power to change lives
                    </p>

                    <ul className="mt-8 flex gap-6 md:gap-8">
                        {socialLinks.map((social) => (
                            <li key={social.name}>
                                <Link
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-white transition hover:text-white/75"
                                >
                                    <span className="sr-only">{social.name}</span>
                                    <Icon icon={social.icon} className="size-6" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Menu sections */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
                    {menuSections.map((section) => (
                        <div key={section.title}>
                            <p className="text-lg font-medium text-white">{section.title}</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        {link === "Live Chat" ? (
                                            <Link
                                                href="#"
                                                className="group flex gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                                            >
                                                <span className="text-white transition group-hover:text-white/75">
                                                    {link}
                                                </span>
                                                <span className="relative flex size-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                                                    <span className="relative inline-flex size-2 rounded-full bg-teal-500"></span>
                                                </span>
                                            </Link>
                                        ) : (
                                            <Link
                                                href="#"
                                                className="text-white transition hover:text-white/75"
                                            >
                                                {link}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact section */}
                    <div>
                        <p className="text-lg font-medium text-white">Contact Us</p>
                        <ul className="mt-8 space-y-4 text-sm">
                            {contactItems.map((item) => (
                                <li
                                    key={item.text}
                                    className="flex items-start gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                                >
                                    <Icon icon={item.icon} className="size-5 shrink-0 text-white" />
                                    {item.isAddress ? (
                                        <address className="flex-1 not-italic text-white max-w-[15rem]">
                                            {item.text}
                                        </address>
                                    ) : (
                                        <Link href={item.href as string} className="flex-1 text-white">
                                            {item.text}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 border-t border-gray-100 pt-6">
                <div className="sm:flex sm:justify-between sm:text-left">
                    <p className="text-sm text-white">
                        <span className="block sm:inline">All rights reserved.</span>{" "}
                        <Link
                            href="#"
                            className="inline-block text-white underline transition hover:text-white/75"
                        >
                            Terms & Conditions
                        </Link>{" "}
                        <span>&middot;</span>{" "}
                        <Link
                            href="#"
                            className="inline-block text-white underline transition hover:text-white/75"
                        >
                            Privacy Policy
                        </Link>
                    </p>

                    <p className="mt-4 text-sm text-white sm:order-first sm:mt-0">
                        &copy; 2025 Adidas AG
                    </p>

                </div>
            </div>
            <p className=" pt-4 text-sm text-white sm:order-first sm:mt-0 max-w-xl">
                This project is for educational and showcase purposes only.
                Adidas® is a registered trademark of Adidas AG. This site is not affiliated with or endorsed by Adidas AG.
            </p>

            <div className="flex justify-start items-center mt-4 pb-4">
                <Link
                    href="https://github.com/weiserdev/adidas-brand-site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-2 text-white hover:text-gray-300 transition-colors"
                >
                    <Icon icon="mdi:github" width="24" height="24" className="text-white" />
                    <span>weiserdev</span>
                </Link>
            </div>
        </div>
    </footer>
)

export default Footer
