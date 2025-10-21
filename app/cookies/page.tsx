"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  Cookie,
  Settings,
  Shield,
  Eye,
  Database,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Cookie className="text-primary" size={20} />
            <span className="text-sm font-medium text-primary">
              Cookie Policy
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cookie Policy
            </span>
          </h1>

          <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
            Learn about how Subnet Console uses cookies and similar technologies
            to enhance your experience on our platform.
          </p>

          <div className="text-sm text-default-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* What Are Cookies */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cookie className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      What Are Cookies?
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Understanding cookies and similar technologies
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    Cookies are small text files that are stored on your device
                    when you visit a website. They help websites remember
                    information about your visit, such as your preferences and
                    settings, making your next visit easier and more
                    personalized.
                  </p>
                  <p className="text-dark-on-white-medium mb-4">
                    Subnet Console uses cookies and similar technologies to
                    provide, protect, and improve our services. This Cookie
                    Policy explains what cookies we use, why we use them, and
                    how you can control them.
                  </p>

                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Similar Technologies
                    </h4>
                    <p className="text-sm text-info-700">
                      We also use other tracking technologies like web beacons,
                      pixels, and local storage that work similarly to cookies
                      and are covered by this policy.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Types of Cookies */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Database className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Types of Cookies We Use
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Categories and purposes of cookies
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="p-4 rounded-lg bg-success-50 border border-success-200">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="text-success-600" size={20} />
                      <h3 className="text-lg font-semibold text-success-800">
                        Essential Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-success-700 mb-3">
                      These cookies are necessary for the website to function
                      properly and cannot be disabled.
                    </p>
                    <ul className="space-y-1 text-sm text-success-700">
                      <li>• Authentication and login status</li>
                      <li>• Security and fraud prevention</li>
                      <li>• Load balancing and performance</li>
                      <li>• Basic website functionality</li>
                    </ul>
                  </div>

                  {/* Functional Cookies */}
                  <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Settings className="text-primary-600" size={20} />
                      <h3 className="text-lg font-semibold text-primary-800">
                        Functional Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-primary-700 mb-3">
                      These cookies enhance your experience by remembering your
                      preferences and settings.
                    </p>
                    <ul className="space-y-1 text-sm text-primary-700">
                      <li>• Language and region preferences</li>
                      <li>• Theme and display settings</li>
                      <li>• Dashboard layout preferences</li>
                      <li>• Notification preferences</li>
                    </ul>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="text-info-600" size={20} />
                      <h3 className="text-lg font-semibold text-info-800">
                        Analytics Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-info-700 mb-3">
                      These cookies help us understand how visitors interact
                      with our website.
                    </p>
                    <ul className="space-y-1 text-sm text-info-700">
                      <li>• Page views and user journeys</li>
                      <li>• Performance metrics and errors</li>
                      <li>• Feature usage statistics</li>
                      <li>• A/B testing and optimization</li>
                    </ul>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="text-warning-600" size={20} />
                      <h3 className="text-lg font-semibold text-warning-800">
                        Marketing Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-warning-700 mb-3">
                      These cookies are used to deliver relevant advertisements
                      and track campaign effectiveness.
                    </p>
                    <ul className="space-y-1 text-sm text-warning-700">
                      <li>• Personalized advertising</li>
                      <li>• Social media integration</li>
                      <li>• Campaign tracking</li>
                      <li>• Conversion measurement</li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Specific Cookies Used */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Specific Cookies We Use
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Detailed list of cookies on our platform
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  {/* Essential Cookies Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-4">
                      Essential Cookies
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-default-200">
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Cookie Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Purpose
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              subnet_session
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Maintains user session and authentication
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Session
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              csrf_token
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Prevents cross-site request forgery attacks
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Session
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              security_check
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Security validation and fraud prevention
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              24 hours
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Functional Cookies Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-4">
                      Functional Cookies
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-default-200">
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Cookie Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Purpose
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              user_preferences
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Stores user interface preferences
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              1 year
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              theme_settings
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Remembers theme and display settings
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              1 year
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              dashboard_layout
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Saves dashboard customization
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              6 months
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analytics Cookies Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-4">
                      Analytics Cookies
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-default-200">
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Cookie Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Purpose
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-dark-on-white">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              _ga
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Google Analytics - distinguishes users
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              2 years
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              _ga_*
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Google Analytics - session state
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              2 years
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-dark-on-white-medium font-mono">
                              subnet_analytics
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              Platform usage analytics
                            </td>
                            <td className="py-3 px-4 text-dark-on-white-medium">
                              1 year
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Cookie Management */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Settings className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Managing Your Cookie Preferences
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How to control cookies on our platform
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  {/* Cookie Banner */}
                  <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <h4 className="font-semibold text-primary-800 mb-2">
                      Cookie Consent Banner
                    </h4>
                    <p className="text-sm text-primary-700 mb-3">
                      When you first visit our website, you&apos;ll see a cookie
                      consent banner where you can:
                    </p>
                    <ul className="space-y-1 text-sm text-primary-700">
                      <li>• Accept all cookies</li>
                      <li>• Reject non-essential cookies</li>
                      <li>• Customize your preferences</li>
                      <li>• Learn more about each category</li>
                    </ul>
                  </div>

                  {/* Browser Settings */}
                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Browser Cookie Settings
                    </h4>
                    <p className="text-sm text-info-700 mb-3">
                      You can also manage cookies through your browser settings:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-info-700">
                      <div>
                        <h5 className="font-medium mb-2">Chrome</h5>
                        <p>
                          Settings → Privacy and security → Cookies and other
                          site data
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Firefox</h5>
                        <p>
                          Options → Privacy & Security → Cookies and Site Data
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Safari</h5>
                        <p>Preferences → Privacy → Manage Website Data</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Edge</h5>
                        <p>
                          Settings → Cookies and site permissions → Cookies and
                          site data
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Platform Settings */}
                  <div className="p-4 rounded-lg bg-success-50 border border-success-200">
                    <h4 className="font-semibold text-success-800 mb-2">
                      Platform Cookie Settings
                    </h4>
                    <p className="text-sm text-success-700 mb-3">
                      You can manage your cookie preferences directly in your
                      Subnet Console account:
                    </p>
                    <ul className="space-y-1 text-sm text-success-700">
                      <li>• Go to Account Settings → Privacy</li>
                      <li>• Toggle cookie categories on/off</li>
                      <li>• Save your preferences</li>
                      <li>• Changes take effect immediately</li>
                    </ul>
                  </div>

                  {/* Impact Warning */}
                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Impact of Disabling Cookies
                    </h4>
                    <p className="text-sm text-warning-700">
                      Disabling certain cookies may affect your experience on
                      our platform. Essential cookies cannot be disabled as they
                      are required for basic functionality.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Third-Party Cookies */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-100">
                    <AlertTriangle className="text-warning-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Third-Party Cookies
                    </h2>
                    <p className="text-dark-on-white-muted">
                      External services and their cookies
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  {/* Google Analytics */}
                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Google Analytics
                    </h4>
                    <p className="text-sm text-info-700 mb-2">
                      We use Google Analytics to understand how visitors
                      interact with our website.
                    </p>
                    <p className="text-sm text-info-700">
                      <strong>Cookies:</strong> _ga, _ga_*, _gid, _gat |
                      <strong> Duration:</strong> Up to 2 years |
                      <strong> Purpose:</strong> Analytics and performance
                      measurement
                    </p>
                  </div>

                  {/* Cloudflare */}
                  <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <h4 className="font-semibold text-primary-800 mb-2">
                      Cloudflare
                    </h4>
                    <p className="text-sm text-primary-700 mb-2">
                      We use Cloudflare for security, performance, and DDoS
                      protection.
                    </p>
                    <p className="text-sm text-primary-700">
                      <strong>Cookies:</strong> __cf_bm, cf_clearance |
                      <strong> Duration:</strong> Session to 1 year |
                      <strong> Purpose:</strong> Security and bot protection
                    </p>
                  </div>

                  {/* Social Media */}
                  <div className="p-4 rounded-lg bg-secondary-50 border border-secondary-200">
                    <h4 className="font-semibold text-secondary-800 mb-2">
                      Social Media Integration
                    </h4>
                    <p className="text-sm text-secondary-700 mb-2">
                      We may integrate with social media platforms for sharing
                      and authentication.
                    </p>
                    <p className="text-sm text-secondary-700">
                      <strong>Platforms:</strong> Twitter, Discord, GitHub |
                      <strong> Purpose:</strong> Social sharing and
                      authentication |<strong> Control:</strong> Manage through
                      platform settings
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Data Protection */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success-100">
                    <Shield className="text-success-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Data Protection & Privacy
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How we protect your cookie data
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  {/* Data Security */}
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Cookie Data Security
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-success-500 mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span>
                          All cookies are encrypted and transmitted securely
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-success-500 mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span>
                          We do not store sensitive personal information in
                          cookies
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-success-500 mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span>
                          Cookie data is processed in accordance with our
                          Privacy Policy
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-success-500 mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span>
                          We regularly audit and update our cookie practices
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* GDPR Compliance */}
                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      GDPR Compliance
                    </h4>
                    <p className="text-sm text-info-700 mb-3">
                      Our cookie practices comply with the General Data
                      Protection Regulation (GDPR):
                    </p>
                    <ul className="space-y-1 text-sm text-info-700">
                      <li>
                        • Clear consent mechanisms for non-essential cookies
                      </li>
                      <li>• Easy withdrawal of consent at any time</li>
                      <li>• Transparent information about cookie purposes</li>
                      <li>• Data minimization and purpose limitation</li>
                    </ul>
                  </div>

                  {/* Data Retention */}
                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Cookie Data Retention
                    </h4>
                    <p className="text-sm text-warning-700">
                      Cookie data is retained only for the duration specified in
                      the cookie tables above. We automatically delete expired
                      cookies and do not retain cookie data beyond the necessary
                      period.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Updates to Policy */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Info className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Updates to This Policy
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How we notify you of changes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    We may update this Cookie Policy from time to time to
                    reflect changes in our practices, technology, legal
                    requirements, or other factors.
                  </p>

                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Notification Methods
                    </h4>
                    <ul className="space-y-2 text-sm text-info-700">
                      <li>
                        • Updated &quot;Last modified&quot; date on this page
                      </li>
                      <li>• Email notification to registered users</li>
                      <li>• In-app notification banner</li>
                      <li>• Prominent notice for material changes</li>
                    </ul>
                  </div>

                  <p className="text-dark-on-white-medium mt-4">
                    We encourage you to review this Cookie Policy periodically.
                    Your continued use of our platform after changes constitutes
                    acceptance of the updated policy.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cookie className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Contact Us
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Questions about our cookie practices
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Privacy Team
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        privacy@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For cookie and privacy-related inquiries
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Technical Support
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        support@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For technical cookie issues
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Legal Department
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        legal@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For legal matters and compliance
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Data Protection Officer
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        dpo@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For data protection concerns
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-success-50 border border-success-200">
                  <h4 className="font-semibold text-success-800 mb-2">
                    Response Time
                  </h4>
                  <p className="text-sm text-success-700">
                    We aim to respond to all cookie-related inquiries within 48
                    hours. For urgent matters, please mark your email as
                    &quot;URGENT - Cookie Matter.&quot;
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-dark-on-white mb-4">
            Manage Your Cookie Preferences
          </h2>
          <p className="text-xl text-dark-on-white-medium mb-8">
            Take control of your privacy and customize your cookie settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="subnet-button-primary px-8 py-3">
              Cookie Settings
            </button>
            <a className="subnet-button-secondary px-8 py-3" href="/privacy">
              Read Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
