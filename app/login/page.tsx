import { WalletConnection } from "@/components/auth/wallet-connection";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark-on-white mb-4">
            Welcome to Subnet Console
          </h1>
          <p className="text-dark-on-white-medium">
            Connect your Web3 wallet to access the decentralized cloud platform
          </p>
        </div>

        <WalletConnection />

        <div className="mt-8 text-center">
          <p className="text-sm text-dark-on-white-muted">
            New to Web3?{" "}
            <a
              className="text-primary hover:underline"
              href="https://ethereum.org/en/wallets/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn about wallets
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
