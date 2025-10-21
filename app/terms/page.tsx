"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  Shield,
  FileText,
  AlertTriangle,
  Scale,
  User,
  Globe,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileText className="text-primary" size={20} />
            <span className="text-sm font-medium text-primary">
              Legal Terms
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>

          <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
            Please read these terms carefully before using Subnet Console. By
            using our platform, you agree to be bound by these terms.
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
            {/* Acceptance of Terms */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scale className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Acceptance of Terms
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Your agreement to these terms
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-on-white-medium mb-4">
                    By accessing or using Subnet Console (&quot;the
                    Platform&quot;), you agree to be bound by these Terms of
                    Service (&quot;Terms&quot;). If you do not agree to these
                    Terms, you may not use our Platform.
                  </p>
                  <p className="text-dark-on-white-medium">
                    These Terms constitute a legally binding agreement between
                    you and Subnet Network. We reserve the right to modify these
                    Terms at any time, and your continued use of the Platform
                    constitutes acceptance of any changes.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Platform Description */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Globe className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Platform Description
                    </h2>
                    <p className="text-dark-on-white-muted">
                      What Subnet Console provides
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <p className="text-dark-on-white-medium">
                    Subnet Console is a decentralized cloud platform that
                    connects users who need computing resources with providers
                    who offer them. Our Platform facilitates:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        For Users (Renters)
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Deploy applications and workloads</li>
                        <li>• Monitor resource usage and performance</li>
                        <li>• Manage billing and payments</li>
                        <li>• Access marketplace of providers</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        For Providers (Node Operators)
                      </h4>
                      <ul className="space-y-1 text-sm text-dark-on-white-medium">
                        <li>• Register and manage computing nodes</li>
                        <li>• Accept deployment requests</li>
                        <li>• Earn rewards for providing services</li>
                        <li>• Monitor node performance and uptime</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* User Responsibilities */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-100">
                    <User className="text-warning-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      User Responsibilities
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Your obligations when using the Platform
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Account Security
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Maintain the security of your wallet and private keys
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Notify us immediately of any unauthorized access
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Use strong authentication methods</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Acceptable Use
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Do not use the Platform for illegal activities
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Do not attempt to hack or compromise the Platform
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Do not deploy malicious software or content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Respect intellectual property rights</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Compliance
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Comply with all applicable laws and regulations
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Ensure your content does not violate third-party
                          rights
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>Provide accurate information when required</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Prohibited Activities */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-danger-100">
                    <AlertTriangle className="text-danger-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Prohibited Activities
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Activities that are not allowed
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
                    <h4 className="font-semibold text-danger-800 mb-2">
                      Illegal Activities
                    </h4>
                    <ul className="space-y-1 text-sm text-danger-700">
                      <li>• Money laundering or terrorist financing</li>
                      <li>
                        • Drug trafficking or illegal substance distribution
                      </li>
                      <li>• Human trafficking or exploitation</li>
                      <li>• Copyright infringement or piracy</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Malicious Activities
                    </h4>
                    <ul className="space-y-1 text-sm text-warning-700">
                      <li>• Hacking, phishing, or social engineering</li>
                      <li>• Distributed denial-of-service (DDoS) attacks</li>
                      <li>• Malware distribution or botnet operations</li>
                      <li>• Spam or unsolicited communications</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
                    <h4 className="font-semibold text-danger-800 mb-2">
                      Platform Abuse
                    </h4>
                    <ul className="space-y-1 text-sm text-danger-700">
                      <li>• Attempting to circumvent security measures</li>
                      <li>
                        • Creating multiple accounts to avoid restrictions
                      </li>
                      <li>• Manipulating pricing or marketplace mechanisms</li>
                      <li>• Interfering with other users&apos; services</li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Terms */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success-100">
                    <Scale className="text-success-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Payment Terms
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Billing and payment conditions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Payment Methods
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Cryptocurrency payments via blockchain transactions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Automatic billing based on resource usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Prepaid credits for predictable costs</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Billing Terms
                    </h3>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          All fees are non-refundable unless otherwise specified
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>Prices may change with 30 days&apos; notice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>You are responsible for all taxes and fees</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Payment Failure
                    </h4>
                    <p className="text-sm text-warning-700">
                      If payment fails, we may suspend your services until
                      payment is resolved. Continued non-payment may result in
                      account termination.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Intellectual Property */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Intellectual Property
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Ownership and rights
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Platform Ownership
                    </h3>
                    <p className="text-dark-on-white-medium">
                      Subnet Console and all its components, including software,
                      design, and content, are owned by Subnet Network and
                      protected by intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      User Content
                    </h3>
                    <p className="text-dark-on-white-medium mb-4">
                      You retain ownership of your content, applications, and
                      data. By using our Platform, you grant us a limited
                      license to:
                    </p>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Process and store your content for Platform
                          functionality
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>Display your content as intended by you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>Create backups and ensure data integrity</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Third-Party Rights
                    </h4>
                    <p className="text-sm text-info-700">
                      You must ensure that your content does not infringe on
                      third-party intellectual property rights. We may remove
                      content that violates these rights.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Limitation of Liability */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-100">
                    <AlertTriangle className="text-warning-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Limitation of Liability
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Our limitations and disclaimers
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <h4 className="font-semibold text-warning-800 mb-2">
                      Service Availability
                    </h4>
                    <p className="text-sm text-warning-700">
                      We strive for high availability but cannot guarantee
                      uninterrupted service. The Platform is provided &quot;as
                      is&quot; without warranties of any kind.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
                    <h4 className="font-semibold text-danger-800 mb-2">
                      Limitation of Damages
                    </h4>
                    <p className="text-sm text-danger-700">
                      To the maximum extent permitted by law, we shall not be
                      liable for any indirect, incidental, special, or
                      consequential damages arising from your use of the
                      Platform.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <h4 className="font-semibold text-primary-800 mb-2">
                      Maximum Liability
                    </h4>
                    <p className="text-sm text-primary-700">
                      Our total liability to you for any claims related to the
                      Platform shall not exceed the amount you paid us in the 12
                      months preceding the claim.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Termination */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-danger-100">
                    <User className="text-danger-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Termination
                    </h2>
                    <p className="text-dark-on-white-muted">
                      How accounts may be terminated
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Termination by You
                    </h3>
                    <p className="text-dark-on-white-medium">
                      You may terminate your account at any time by contacting
                      our support team. Upon termination, your access to the
                      Platform will cease immediately.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                      Termination by Us
                    </h3>
                    <p className="text-dark-on-white-medium mb-4">
                      We may terminate your account immediately if you:
                    </p>
                    <ul className="space-y-2 text-dark-on-white-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Violate these Terms of Service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Engage in prohibited activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Fail to pay required fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Provide false or misleading information</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-info-50 border border-info-200">
                    <h4 className="font-semibold text-info-800 mb-2">
                      Effect of Termination
                    </h4>
                    <p className="text-sm text-info-700">
                      Upon termination, you must stop using the Platform
                      immediately. We may delete your data after a reasonable
                      period, and you are responsible for backing up any
                      important data.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Governing Law */}
            <Card className="subnet-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Scale className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-on-white">
                      Governing Law
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Legal jurisdiction and dispute resolution
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Jurisdiction
                    </h4>
                    <p className="text-dark-on-white-medium">
                      These Terms are governed by the laws of [Jurisdiction],
                      without regard to conflict of law principles.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Dispute Resolution
                    </h4>
                    <p className="text-dark-on-white-medium">
                      Any disputes arising from these Terms shall be resolved
                      through binding arbitration in accordance with the rules
                      of [Arbitration Organization].
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold text-dark-on-white mb-2">
                      Class Action Waiver
                    </h4>
                    <p className="text-dark-on-white-medium">
                      You agree that any disputes will be resolved individually
                      and not as part of a class action or consolidated
                      proceeding.
                    </p>
                  </div>
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
                      Contact Information
                    </h2>
                    <p className="text-dark-on-white-muted">
                      Questions about these Terms
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Legal Department
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        legal@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For legal matters and terms questions
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
                        For general platform support
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Business Inquiries
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        business@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For partnership and business matters
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <h4 className="font-semibold text-dark-on-white mb-2">
                        Compliance
                      </h4>
                      <p className="text-sm text-dark-on-white-medium mb-2">
                        compliance@subnetconsole.com
                      </p>
                      <p className="text-xs text-dark-on-white-muted">
                        For compliance and regulatory matters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-success-50 border border-success-200">
                  <h4 className="font-semibold text-success-800 mb-2">
                    Response Time
                  </h4>
                  <p className="text-sm text-success-700">
                    We aim to respond to all legal inquiries within 5 business
                    days. For urgent matters, please mark your email as
                    &quot;URGENT - Legal Matter.&quot;
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
            Questions About These Terms?
          </h2>
          <p className="text-xl text-dark-on-white-medium mb-8">
            Our legal team is here to help clarify any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="subnet-button-primary px-8 py-3"
              href="mailto:legal@subnetconsole.com"
            >
              Contact Legal Team
            </a>
            <a className="subnet-button-secondary px-8 py-3" href="/privacy">
              Read Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
