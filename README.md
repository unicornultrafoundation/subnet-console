# 🌐 Subnet Console

Subnet Console is a unified web dashboard for both Users and Providers in the Subnet Network — a decentralized cloud platform for compute, storage, and AI workloads.

## 🚀 Overview

Subnet Console serves as the central hub for the Subnet ecosystem, providing an intuitive interface for managing decentralized compute resources, deploying applications, and monitoring infrastructure performance. Whether you're a user looking to deploy workloads or a provider offering compute resources, Subnet Console streamlines the entire process.

## 👤 For Users (Renters)

### Browse & Deploy Apps
- Explore verified Subnet Providers and their available resources
- Deploy workloads (AI models, web applications, containers) in just a few clicks
- Access a marketplace of pre-configured applications and services

### Resource Monitoring
- View real-time CPU, RAM, bandwidth, and uptime metrics
- Monitor performance of your deployed nodes and applications
- Set up alerts for resource usage and performance thresholds

### Wallet & Billing
- Manage token balance and automatic top-ups
- Track usage-based billing with detailed cost breakdowns
- View transaction history and payment methods

### App Insights
- Monitor application performance and usage patterns
- Access system logs and debugging information
- Analyze resource consumption trends and optimization opportunities

## 🖥️ For Providers (Node Operators)

### Node Management
- Register and configure Subnet Nodes directly from the dashboard
- Monitor node health, performance, and resource utilization
- Manage multiple nodes across different locations

### Verification Reports
- Submit verification reports and feedback
- Track reliability metrics and maintain reputation scores
- Review and respond to verification requests

### Staking & Rewards
- Stake tokens to participate in the network
- Claim rewards based on uptime and performance
- Monitor slashing conditions and uptime status

### App Hosting
- Accept deployment requests from users
- Manage workloads in isolated containers or VMs
- Configure resource allocation and pricing

## 🧩 Core Features

- **Secure Web3 Authentication**: Wallet-based login with support for multiple blockchain networks
- **Real-time Telemetry**: Live monitoring via WebSocket and gRPC connections
- **Subnet Core Integration**: Seamless integration with the Go-based node engine
- **Decentralized Marketplace**: Peer-to-peer compute and application hosting marketplace
- **Multi-tenant Management**: Clear separation between User and Provider roles and permissions
- **Responsive Design**: Modern, mobile-friendly interface built with accessibility in mind

## 🏗️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework with custom theme
- **HeroUI**: Modern React component library
- **Framer Motion**: Smooth animations and transitions
- **next-themes**: Dark/light mode support
- **Zustand**: Lightweight state management

### Backend Integration
- **gRPC**: High-performance communication with Subnet Node Core
- **REST APIs**: Standard HTTP endpoints for web integration
- **WebSocket**: Real-time data streaming

### Blockchain Layer
- **EVM-compatible**: Support for Ethereum and compatible networks
- **Smart Contracts**: Staking, verification, and payment contracts
- **Wallet Integration**: MetaMask, WalletConnect, and other Web3 wallets

### Infrastructure
- **Docker**: Containerized deployments
- **Traefik**: Reverse proxy and load balancing
- **K3s**: Lightweight Kubernetes for micro-deployments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subnet-network/subnet-console.git
   cd subnet-console
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **View Theme Demo** (Optional)
   Visit [http://localhost:3000/theme-demo](http://localhost:3000/theme-demo) to see the design system showcase

### Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint with auto-fix

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Code quality and consistency enforcement
- **TailwindCSS**: Utility-first styling with custom theme
- **Component Library**: Pre-built UI components with Subnet branding

## 📁 Project Structure

```
subnet-console/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/               # Login page
│   │   └── register/            # Register page
│   ├── (dashboard)/              # Dashboard group routes
│   │   ├── user/                # User dashboard
│   │   │   ├── deployments/     # User deployments
│   │   │   ├── monitoring/      # User monitoring
│   │   │   ├── billing/         # User billing
│   │   │   ├── apps/            # User apps
│   │   │   └── page.tsx         # User dashboard home
│   │   └── provider/            # Provider dashboard
│   │       ├── nodes/           # Provider nodes
│   │       ├── staking/         # Provider staking
│   │       ├── verification/    # Provider verification
│   │       └── hosting/         # Provider hosting
│   ├── marketplace/              # Public marketplace
│   ├── theme-demo/              # Theme showcase
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication API
│   │   ├── nodes/               # Nodes API
│   │   ├── deployments/         # Deployments API
│   │   └── billing/             # Billing API
│   ├── docs/                    # Documentation
│   ├── about/                   # About page
│   ├── blog/                    # Blog section
│   ├── pricing/                 # Pricing information
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── providers.tsx            # Provider context
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── counter.tsx          # Counter component
│   │   └── theme-showcase.tsx   # Theme demo component
│   ├── auth/                    # Authentication components
│   ├── dashboard/                # Dashboard specific components
│   ├── marketplace/             # Marketplace components
│   ├── monitoring/              # Monitoring components
│   ├── layout/                  # Layout components
│   │   └── navbar.tsx           # Navigation bar
│   ├── common/                  # Common components
│   │   ├── icons.tsx            # Icon components
│   │   └── theme-switch.tsx    # Theme toggle
│   └── primitives.ts            # UI primitives
├── lib/                          # Utility libraries
│   ├── auth/                    # Authentication utilities
│   ├── blockchain/              # Blockchain integration
│   ├── api/                     # API client
│   ├── utils/                   # General utilities
│   └── constants/               # App constants
├── hooks/                        # Custom React hooks
├── store/                        # State management (Zustand)
│   ├── auth-store.ts            # Authentication store
│   ├── node-store.ts            # Node management store
│   └── deployment-store.ts      # Deployment store
├── types/                        # TypeScript types
│   └── index.ts                 # Main type definitions
├── config/                       # Configuration
│   ├── site.ts                  # Site configuration
│   ├── blockchain.ts            # Blockchain configuration
│   ├── api.ts                   # API configuration
│   └── fonts.ts                 # Font configuration
├── styles/                       # Global styles
│   └── globals.css              # Global CSS with custom theme
└── public/                      # Static assets
```

## 🎨 Design System

### Color Palette
Subnet Console uses a custom color palette designed for clarity and accessibility:

- **Primary**: `#34CC99` (Subnet Green) - Main brand color
- **Secondary**: `#006261` (Deep Teal) - Supporting color
- **Dark**: `#000000` (Black) - Text and dark elements
- **Light**: `#FFFFFF` (White) - Backgrounds and light elements

### Theme Support
- **Light Mode**: Clean, modern interface with white backgrounds
- **Dark Mode**: Dark interface optimized for low-light usage
- **Custom CSS Variables**: Consistent theming across components
- **Utility Classes**: Pre-built classes for common styling patterns

### Component Library
- **HeroUI Integration**: Modern React components with Subnet branding
- **Custom Components**: Specialized components for dashboard, marketplace, and monitoring
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## 🔧 Configuration

### Site Configuration
Edit `config/site.ts` to customize:
- Site name and description
- Navigation items and menu structure
- Social links and external resources
- Theme and branding settings

### Blockchain Configuration
Edit `config/blockchain.ts` to configure:
- Supported networks (Ethereum, Polygon, Arbitrum)
- Contract addresses for tokens and smart contracts
- RPC endpoints and network settings
- Wallet connection preferences

### API Configuration
Edit `config/api.ts` to configure:
- Backend API endpoints
- WebSocket connections
- Request timeouts and retry policies
- Authentication settings

### Environment Variables
Create a `.env.local` file with:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws

# Blockchain Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth.llamarpc.com
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon.llamarpc.com
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Contract Addresses
NEXT_PUBLIC_SUBNET_TOKEN_ADDRESS=
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=
NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS=
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 🎯 Key Features

### User Dashboard
- **Deployment Management**: Create, monitor, and manage application deployments
- **Resource Monitoring**: Real-time metrics for CPU, memory, storage, and bandwidth
- **Billing & Payments**: Token balance management and usage-based billing
- **Application Insights**: Performance monitoring and system logs

### Provider Dashboard
- **Node Management**: Register and configure Subnet nodes
- **Staking & Rewards**: Stake tokens and claim network rewards
- **Verification System**: Submit verification reports and maintain reputation
- **Hosting Services**: Accept and manage user deployment requests

### Marketplace
- **Provider Discovery**: Browse verified providers and their capabilities
- **Application Catalog**: Deploy pre-configured applications and services
- **Pricing Transparency**: Clear pricing information and cost estimation
- **Reputation System**: Provider ratings and reliability metrics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the established component structure
- Maintain consistency with the design system
- Write comprehensive tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [docs.subnet.network](https://docs.subnet.network)
- **Website**: [subnet.network](https://subnet.network)
- **Discord**: [Join our community](https://discord.gg/subnet)
- **Twitter**: [@SubnetNetwork](https://twitter.com/SubnetNetwork)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/subnet-network/subnet-console/issues)
- **Discussions**: [GitHub Discussions](https://github.com/subnet-network/subnet-console/discussions)
- **Discord**: [Community Support](https://discord.gg/subnet)

---

Built with ❤️ by the Subnet Network team