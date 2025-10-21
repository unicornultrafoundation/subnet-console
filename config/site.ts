export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Subnet Console",
  description:
    "Unified web dashboard for Users and Providers in the Subnet Network — a decentralized cloud platform for compute, storage, and AI workloads.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      label: "Applications",
      href: "/applications",
    },
    {
      label: "Providers",
      href: "/providers",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Deployments",
      href: "/dashboard/user/deployments",
    },
    {
      label: "Monitoring",
      href: "/dashboard/user/monitoring",
    },
    {
      label: "Billing",
      href: "/dashboard/user/billing",
    },
    {
      label: "My Apps",
      href: "/dashboard/user/apps",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Support",
      href: "/help",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/subnet-network/subnet-console",
    twitter: "https://twitter.com/SubnetNetwork",
    docs: "https://docs.subnet.network",
    discord: "https://discord.gg/subnet",
    sponsor: "https://subnet.network/sponsor",
  },
};
