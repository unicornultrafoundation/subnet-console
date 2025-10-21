"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import NextLink from "next/link";
import clsx from "clsx";
import {
  ChevronDown,
  User,
  BarChart3,
  ShoppingCart,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/common/icons";
import { useWallet } from "@/hooks/use-wallet";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isConnected,
    address,
    formatAddress,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
    clearError,
    isMetaMaskInstalled,
  } = useWallet();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeroUINavbar
      className={clsx(
        "border-b border-divider/50 glass-enhanced-dark px-8 navbar-height sticky-navbar",
        isScrolled && "navbar-scrolled",
      )}
      maxWidth="full"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink className="flex items-center gap-2" href="/">
            <Logo size={32} />
            <p className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Subnet Console
            </p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {siteConfig.navItems.map((item) => (
          <NavbarItem key={item.href}>
            <NextLink
              className={clsx(
                "text-foreground hover:text-primary transition-colors px-3 py-2",
                "data-[active=true]:text-primary data-[active=true]:font-medium",
              )}
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="gap-6" justify="end">
        <NavbarItem className="pr-6">
          {!isClient ? (
            <div className="w-32 h-10 bg-default-200 rounded-lg animate-pulse" />
          ) : isConnected ? (
            <div className="mr-4">
              {/* Combined Wallet Info & Dropdown */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-md hover:bg-gradient-to-r hover:from-primary/15 hover:to-secondary/15 transition-all duration-200 cursor-pointer">
                    {/* Wallet Icon */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-white/20">
                        <span className="text-white text-sm font-bold">🦊</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-background" />
                    </div>

                    {/* Wallet Details */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {formatAddress(address!)}
                        </span>
                        <Chip
                          className="text-xs"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          Connected
                        </Chip>
                      </div>
                      <span className="text-xs text-default-500">
                        MetaMask Wallet
                      </span>
                    </div>

                    {/* Dropdown Arrow */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <ChevronDown className="text-default-600" size={14} />
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Wallet Actions"
                  className="bg-white border border-gray-200 shadow-2xl min-w-56 p-2 rounded-xl"
                  variant="flat"
                >
                  {/* Profile Header */}
                  <DropdownItem
                    key="profile"
                    className="h-auto p-4 cursor-default hover:bg-transparent"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <User className="text-white" size={20} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          Wallet Connected
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-mono text-xs text-primary">
                            {formatAddress(address!)}
                          </p>
                          <Button
                            className="min-w-0 w-5 h-5 p-0"
                            size="sm"
                            variant="light"
                            onClick={() =>
                              navigator.clipboard.writeText(address!)
                            }
                          >
                            <Copy className="text-gray-500" size={12} />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          MetaMask Wallet
                        </p>
                      </div>
                    </div>
                  </DropdownItem>

                  {/* Divider */}
                  <DropdownItem key="divider1" className="h-1 p-0 my-2">
                    <div className="w-full h-px bg-gray-200" />
                  </DropdownItem>

                  {/* Navigation Items */}
                  <DropdownItem
                    key="dashboard"
                    as={NextLink}
                    className="h-10 p-3 rounded-lg hover:bg-primary/5"
                    endContent={
                      <ExternalLink className="text-gray-400" size={12} />
                    }
                    href="/user"
                    startContent={
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="text-primary" size={14} />
                      </div>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Dashboard
                      </span>
                      <span className="text-xs text-gray-500">
                        • View deployments
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="marketplace"
                    as={NextLink}
                    className="h-10 p-3 rounded-lg hover:bg-secondary/5"
                    endContent={
                      <ExternalLink className="text-gray-400" size={12} />
                    }
                    href="/marketplace"
                    startContent={
                      <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <ShoppingCart className="text-secondary" size={14} />
                      </div>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Marketplace
                      </span>
                      <span className="text-xs text-gray-500">
                        • Browse providers
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="settings"
                    as={NextLink}
                    className="h-10 p-3 rounded-lg hover:bg-warning/5"
                    endContent={
                      <ExternalLink className="text-gray-400" size={12} />
                    }
                    href="/settings"
                    startContent={
                      <div className="w-6 h-6 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Settings className="text-warning-600" size={14} />
                      </div>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Settings
                      </span>
                      <span className="text-xs text-gray-500">
                        • Account preferences
                      </span>
                    </div>
                  </DropdownItem>

                  {/* Divider */}
                  <DropdownItem key="divider2" className="h-1 p-0 my-2">
                    <div className="w-full h-px bg-gray-200" />
                  </DropdownItem>

                  {/* Disconnect */}
                  <DropdownItem
                    key="disconnect"
                    className="h-10 p-3 rounded-lg hover:bg-danger/5 text-danger-600"
                    startContent={
                      <div className="w-6 h-6 rounded-lg bg-danger/10 flex items-center justify-center">
                        <LogOut className="text-danger-600" size={14} />
                      </div>
                    }
                    onClick={disconnectWallet}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Disconnect Wallet
                      </span>
                      <span className="text-xs text-danger-500">
                        • Sign out
                      </span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <div className="flex flex-col items-end mr-4">
              <Button
                className={`connect-wallet-btn px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !isMetaMaskInstalled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                title={
                  !isMetaMaskInstalled
                    ? "MetaMask is not installed"
                    : "Connect your wallet"
                }
                onClick={connectWallet}
              >
                {isLoading
                  ? "Connecting..."
                  : !isMetaMaskInstalled
                    ? "Install MetaMask"
                    : "Connect Wallet"}
              </Button>

              {/* Error Message */}
              {error && (
                <div
                  className="mt-2 text-xs text-danger-500 max-w-48 text-right cursor-pointer hover:text-danger-600 transition-colors"
                  role="button"
                  tabIndex={0}
                  title="Click to dismiss"
                  onClick={clearError}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      clearError();
                    }
                  }}
                >
                  {error}
                </div>
              )}

              {/* MetaMask Install Prompt */}
              {!isMetaMaskInstalled && (
                <div className="mt-2 text-xs text-warning-500 max-w-48 text-right">
                  Install MetaMask to connect your wallet
                </div>
              )}
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link as={NextLink} color="foreground" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={NextLink}
            className="w-full"
            color="primary"
            href="/marketplace"
            variant="flat"
          >
            Get Started
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
