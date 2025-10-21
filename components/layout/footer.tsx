import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

import { siteConfig } from "@/config/site";
import {
  GithubIcon,
  DiscordIcon,
  TwitterIcon,
} from "@/components/common/icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-divider bg-background">
      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary" />
              <span className="text-xl font-bold">Subnet Console</span>
            </div>
            <p className="text-sm text-default-600 max-w-xs">
              Unified dashboard for decentralized cloud computing. Deploy,
              manage, and scale your applications on the Subnet Network.
            </p>
            <div className="flex gap-4">
              <Link
                isExternal
                aria-label="GitHub"
                href={siteConfig.links.github}
              >
                <GithubIcon
                  className="text-default-500 hover:text-primary transition-colors"
                  size={20}
                />
              </Link>
              <Link
                isExternal
                aria-label="Discord"
                href={siteConfig.links.discord}
              >
                <DiscordIcon
                  className="text-default-500 hover:text-primary transition-colors"
                  size={20}
                />
              </Link>
              <Link
                isExternal
                aria-label="Twitter"
                href={siteConfig.links.twitter}
              >
                <TwitterIcon
                  className="text-default-500 hover:text-primary transition-colors"
                  size={20}
                />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/marketplace"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/help"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/api"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/status"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  isExternal
                  className="text-default-600 hover:text-primary"
                  href={siteConfig.links.discord}
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  isExternal
                  className="text-default-600 hover:text-primary"
                  href={siteConfig.links.twitter}
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  isExternal
                  className="text-default-600 hover:text-primary"
                  href={siteConfig.links.github}
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-600 hover:text-primary"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-default-600">
            © {currentYear} Subnet Network. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              className="text-default-600 hover:text-primary"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link className="text-default-600 hover:text-primary" href="/terms">
              Terms of Service
            </Link>
            <Link
              className="text-default-600 hover:text-primary"
              href="/cookies"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
