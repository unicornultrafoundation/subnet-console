"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { Shield, Eye, Lock, Database, User, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="text-primary" size={20} />
            <span className="text-sm font-medium text-primary">
              Privacy & Security
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>

          <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
            Your privacy is fundamental to our decentralized cloud platform.
            Learn how we protect your data and respect your rights.
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
            {/* Introduction */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Eye className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Introduction
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Our commitment to your privacy
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    Subnet Console (&quot;we,&quot; &quot;our,&quot; or
                    &quot;us&quot;) operates a decentralized cloud platform that
                    enables users to deploy applications and providers to offer
                    computing resources. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when
                    you use our platform.
                  </p>
                  <p className="text-dark-on-white-medium">
                    As a decentralized platform, we are committed to minimizing
                    data collection while providing essential services. We
                    believe in transparency and giving you control over your
                    personal information.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Information We Collect */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Database className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Information We Collect
                    </h2>
                    <p className="text-dark-on-white-muted">
                      What data we gather and why
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      1. Wallet Information
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Wallet Address:</strong> Your blockchain
                          wallet address for authentication and transactions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Network Information:</strong> Blockchain
                          network details (chain ID, network name)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Transaction History:</strong> On-chain
                          transaction records for billing and verification
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      2. Platform Usage Data
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Deployment Information:</strong> Application
                          configurations, resource requirements, and deployment
                          status
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Performance Metrics:</strong> CPU, memory,
                          bandwidth usage, and uptime statistics
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Log Data:</strong> Application logs and system
                          events for debugging and monitoring
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      3. Technical Information
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Browser Information:</strong> User agent,
                          browser type, and version for compatibility
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>IP Address:</strong> For security, fraud
                          prevention, and service optimization
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <strong>Device Information:</strong> Operating system,
                          device type, and screen resolution
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* How We Use Information */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Lock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      How We Use Your Information
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Purposes and legal basis for data processing
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Service Provision
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Deploy and manage applications</li>
                        <li>• Process payments and billing</li>
                        <li>• Provide technical support</li>
                        <li>• Monitor platform performance</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Security & Compliance
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Prevent fraud and abuse</li>
                        <li>• Ensure platform security</li>
                        <li>• Comply with legal obligations</li>
                        <li>• Enforce terms of service</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Platform Improvement
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Analyze usage patterns</li>
                        <li>• Improve user experience</li>
                        <li>• Develop new features</li>
                        <li>• Optimize performance</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Communication
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Send service notifications</li>
                        <li>• Provide updates and alerts</li>
                        <li>• Respond to inquiries</li>
                        <li>• Share important changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Data Sharing */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Globe className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Data Sharing & Disclosure
                    </h2>
                    <p className="text-dark-on-white-muted">
                      When and how we share your information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-success-50 border border-success-200">
                    <h3 className="text-lg font-semibold text-success-700 mb-3">
                      We Do NOT Sell Your Data
                    </h3>
                    <p className="text-success-600">
                      We never sell, rent, or trade your personal information to
                      third parties for marketing purposes. Your data remains
                      under your control.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-4">
                      Limited Sharing Scenarios
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-50 border border-warning-200">
                        <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-warning-800">
                            Service Providers
                          </h4>
                          <p className="text-sm text-warning-700">
                            Trusted third-party services for infrastructure,
                            analytics, and support (with strict data protection
                            agreements)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-danger-50 border border-danger-200">
                        <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-danger-800">
                            Legal Requirements
                          </h4>
                          <p className="text-sm text-danger-700">
                            When required by law, court order, or to protect our
                            rights and prevent harm
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-50 border border-primary-200">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-primary-800">
                            Business Transfers
                          </h4>
                          <p className="text-sm text-primary-700">
                            In case of merger, acquisition, or asset sale (with
                            user notification)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Your Rights */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Your Privacy Rights
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Control over your personal information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Access & Portability
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Request a copy of your data in a portable format
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Correction
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Update or correct inaccurate information
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Deletion
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Request deletion of your personal data
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Restriction
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Limit how we process your data
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Objection
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Object to certain data processing activities
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Withdraw Consent
                      </h4>
                      <p className="text-sm text-dark-on-white-medium">
                        Revoke consent for data processing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-info-50 border border-info-200">
                  <h4 className="font-semibold text-info-800 mb-2">
                    How to Exercise Your Rights
                  </h4>
                  <p className="text-sm text-info-700 mb-2">
                    Contact us at <strong>privacy@subnetconsole.com</strong> or
                    use the settings in your account dashboard.
                  </p>
                  <p className="text-sm text-info-700">
                    We will respond to your request within 30 days and may
                    require identity verification.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Data Security */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success-100">
                    <Lock className="text-success-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Data Security
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How we protect your information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-success-50 border border-success-200">
                    <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="text-success-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-success-800 mb-2">
                      Encryption
                    </h4>
                    <p className="text-sm text-success-700">
                      End-to-end encryption for data transmission and storage
                    </p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="text-primary-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-primary-800 mb-2">
                      Access Control
                    </h4>
                    <p className="text-sm text-primary-700">
                      Strict access controls and authentication mechanisms
                    </p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-secondary-50 border border-secondary-200">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Database className="text-secondary-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-secondary-800 mb-2">
                      Secure Storage
                    </h4>
                    <p className="text-sm text-secondary-700">
                      Data stored in secure, decentralized infrastructure
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-warning-50 border border-warning-200">
                  <h4 className="font-semibold text-warning-800 mb-2">
                    Security Measures
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-warning-700">
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Multi-factor authentication for admin access</li>
                    <li>• Automated monitoring and threat detection</li>
                    <li>
                      • Incident response and breach notification procedures
                    </li>
                    <li>• Employee training on data protection</li>
                    <li>• Regular software updates and patches</li>
                  </ul>
                </div>
              </CardBody>
            </Card>

            {/* Data Retention */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-100">
                    <Database className="text-warning-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Data Retention
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How long we keep your information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Account Data
                    </h4>
                    <p className="text-dark-on-white-medium">
                      Retained while your account is active and for 2 years
                      after closure for legal and business purposes.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Transaction Records
                    </h4>
                    <p className="text-dark-on-white-medium">
                      Blockchain transaction data is immutable and permanent,
                      but we anonymize associated metadata after 7 years.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Usage Analytics
                    </h4>
                    <p className="text-dark-on-white-medium">
                      Aggregated and anonymized data may be retained
                      indefinitely for platform improvement.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Support Communications
                    </h4>
                    <p className="text-dark-on-white-medium">
                      Customer support tickets and communications are retained
                      for 3 years for quality assurance.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* International Transfers */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info-100">
                    <Globe className="text-info-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      International Data Transfers
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Cross-border data processing
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    As a decentralized platform, Subnet Console operates
                    globally. Your data may be processed in different countries
                    where our infrastructure providers are located.
                  </p>

                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Safeguards for International Transfers
                    </h4>
                    <ul className="space-y-2 text-sm text-info-700">
                      <li>
                        • Standard Contractual Clauses (SCCs) with all service
                        providers
                      </li>
                      <li>
                        • Adequacy decisions for countries with equivalent data
                        protection
                      </li>
                      <li>
                        • Technical and organizational measures to protect data
                      </li>
                      <li>
                        • Regular assessments of third-party data protection
                        practices
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Children&apos;s Privacy */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-danger-100">
                    <User className="text-danger-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Children&apos;s Privacy
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Protection for minors
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
                  <p className="text-dark-on-white-medium mb-4">
                    Subnet Console is not intended for children under 16 years
                    of age. We do not knowingly collect personal information
                    from children under 16.
                  </p>
                  <p className="text-dark-on-white-medium">
                    If you are a parent or guardian and believe your child has
                    provided us with personal information, please contact us
                    immediately. We will take steps to remove such information
                    from our systems.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-100">
                    <Eye className="text-warning-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Changes to This Policy
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How we notify you of updates
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    We may update this Privacy Policy from time to time to
                    reflect changes in our practices, technology, legal
                    requirements, or other factors.
                  </p>

                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Notification Methods
                    </h4>
                    <ul className="space-y-2 text-sm text-warning-700">
                      <li>• Email notification to registered users</li>
                      <li>• In-app notification banner</li>
                      <li>
                        • Updated &quot;Last modified&quot; date on this page
                      </li>
                      <li>• Prominent notice for material changes</li>
                    </ul>
                  </div>

                  <p className="text-dark-on-white-medium mt-4">
                    We encourage you to review this Privacy Policy periodically.
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
                    <Shield className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Contact Us
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Questions about this Privacy Policy
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Privacy Officer
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        privacy@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For privacy-related inquiries and data subject requests
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        General Support
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        support@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For general platform support and questions
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
                        For legal matters and compliance questions
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Data Protection Authority
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        You may also contact your local data protection
                        authority
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For complaints about data processing practices
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-success-50 border border-success-200">
                  <h4 className="font-semibold text-success-800 mb-2">
                    Response Time
                  </h4>
                  <p className="text-sm text-success-700">
                    We aim to respond to all privacy-related inquiries within 30
                    days. For urgent matters, please mark your email as
                    &quot;URGENT - Privacy Matter.&quot;
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
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-dark-on-white-medium mb-8">
            We&apos;re committed to transparency and protecting your rights.
            Contact us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="subnet-button-primary px-8 py-3"
              href="mailto:privacy@subnetconsole.com"
            >
              Contact Privacy Team
            </a>
            <a className="subnet-button-secondary px-8 py-3" href="/support">
              Visit Support Center
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
