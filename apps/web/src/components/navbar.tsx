import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  Button,
  buttonVariants,
} from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

interface MenuItem {
  title: string;
  description: string;
  icon: JSX.Element;
  href?: string;
}

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

function MenuItemLink({ item }: { item: MenuItem }) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      )}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-sm leading-snug text-muted-foreground">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

const menuItems = {
  products: [
    {
      title: "Blog",
      description: "The latest industry news, updates, and info",
      icon: <Book className="size-5 shrink-0" />,
    },
    {
      title: "Company",
      description: "Our mission is to innovate and empower the world",
      icon: <Trees className="size-5 shrink-0" />,
    },
    {
      title: "Careers",
      description: "Browse job listing and discover our workspace",
      icon: <Sunset className="size-5 shrink-0" />,
    },
    {
      title: "Support",
      description:
        "Get in touch with our support team or visit our community forums",
      icon: <Zap className="size-5 shrink-0" />,
    },
  ],
  resources: [
    {
      title: "Help Center",
      description: "Get all the answers you need right here",
      icon: <Zap className="size-5 shrink-0" />,
    },
    {
      title: "Contact Us",
      description:
        "We are here to help you with any questions you have",
      icon: <Sunset className="size-5 shrink-0" />,
    },
    {
      title: "Status",
      description:
        "Check the current status of our services and APIs",
      icon: <Trees className="size-5 shrink-0" />,
    },
    {
      title: "Terms of Service",
      description: "Our terms and conditions for using our services",
      icon: <Book className="size-5 shrink-0" />,
    },
  ],
};

const footerLinks = [
  { title: "Press", href: "/" },
  { title: "Contact", href: "/" },
  { title: "Imprint", href: "/" },
  { title: "Sitemap", href: "/" },
  { title: "Legal", href: "/" },
  { title: "Cookie Settings", href: "/" },
];

const navLinks = [
  { title: "Pricing", href: "/" },
  { title: "Blog", href: "/" },
];

export function Navbar() {
  return (
    <section className="py-4">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="hidden justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO_URL}
              alt="logo"
              width={80}
              height={40}
              priority
            />
          </Link>
          <div className="flex items-center gap-6 justify-center flex-grow">
            <div className="flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  className={cn(
                    "text-muted-foreground",
                    navigationMenuTriggerStyle(),
                    buttonVariants({
                      variant: "ghost",
                    })
                  )}
                  href={link.href}
                >
                  {link.title}
                </Link>
              ))}

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-80 p-3">
                        {menuItems.products.map((item) => (
                          <li key={item.title}>
                            <MenuItemLink item={item} />
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-80 p-3">
                        {menuItems.resources.map((item) => (
                          <li key={item.title}>
                            <MenuItemLink item={item} />
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={LOGO_URL}
                // className="w-8"
                alt="logo"
                width={80}
                height={80}
                priority
              />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                    >
                      <Image
                        src={LOGO_URL}
                        // className="w-8"
                        alt="logo"
                        width={80}
                        height={80}
                        priority
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mb-8 mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="font-semibold"
                    >
                      {link.title}
                    </Link>
                  ))}

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem
                      value="products"
                      className="border-b-0"
                    >
                      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                        Products
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {menuItems.products.map((item) => (
                          <MenuItemLink
                            key={item.title}
                            item={item}
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="resources"
                      className="border-b-0"
                    >
                      <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                        Resources
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {menuItems.resources.map((item) => (
                          <MenuItemLink
                            key={item.title}
                            item={item}
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 justify-start">
                    {footerLinks.map((link) => (
                      <Link
                        key={link.title}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                          }),
                          "justify-start text-muted-foreground"
                        )}
                        href={link.href}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-col gap-3">
                    <Button variant="outline">Log in</Button>
                    <Button>Sign up</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
