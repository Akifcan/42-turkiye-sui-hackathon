# AthliFi Frontend Architecture

## Overview

The AthliFi frontend has been restructured with a clean, modular architecture that separates concerns and implements the ugly-cash design system for a modern, cohesive user experience.

## Folder Structure

```
src/
├── components/         # Reusable UI components
│   ├── layout/        # Layout components (Header)
│   │   ├── Header.tsx
│   │   └── index.ts
│   └── ui/            # Basic UI elements
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── TextArea.tsx
│       ├── Card.tsx
│       └── index.ts
├── features/          # Feature-specific components
│   ├── athlete/       # Athlete profile management
│   │   ├── AthleteProfileForm.tsx
│   │   ├── SocialLinksManager.tsx
│   │   └── NFTGalleryManager.tsx
│   └── profile/       # Profile viewing
│       └── ProfileView.tsx
├── hooks/             # Custom React hooks
│   └── useProfileData.ts
├── styles/            # Design system
│   └── global.css
├── types/             # TypeScript interfaces
│   └── index.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Design System

The application implements a design system based on the ugly-cash tokens:

### Colors
- **Background**: rgb(242, 242, 242) - Light gray
- **Text**: rgb(0, 0, 0) - Black
- **Brand Primary**: rgb(255, 255, 255) - White
- **Accent Pink**: rgb(236, 15, 235)
- **Accent Blue**: rgb(17, 40, 186)
- **Accent Cyan**: rgb(7, 191, 217) - Primary CTA color
- **Accent Orange**: rgb(234, 67, 29)

### Spacing Scale
- xs: 8px
- s: 10px
- m: 19px
- l: 20px
- xl: 24px
- xxl: 34px

### Typography
- Font sizes: 12px-14px
- Font weight: 400 (normal)
- Font family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

### Border Radius
- Base: 16px (for all cards and containers)

## Component Architecture

### UI Components (`components/ui/`)

Reusable, presentation-focused components:

- **Button**: Styled button with variants (primary, secondary, accent)
- **Input**: Text input with label and error state
- **TextArea**: Multi-line text input with label and error state
- **Card**: Container component with consistent styling

### Layout Components (`components/layout/`)

- **Header**: Application header with branding and wallet connection

### Feature Components (`features/`)

Feature-specific components with business logic:

#### Athlete Features (`features/athlete/`)
- **AthleteProfileForm**: Create new athlete profile
- **SocialLinksManager**: Add social media links
- **NFTGalleryManager**: Add NFTs to profile

#### Profile Features (`features/profile/`)
- **ProfileView**: View athlete profiles with all data

## Custom Hooks

### useProfileData
Encapsulates all blockchain data fetching logic for profiles:
- Fetches About profile
- Fetches social links
- Fetches NFT gallery
- Handles loading and error states

## Type Definitions

All TypeScript interfaces are centralized in `types/index.ts`:
- `AboutProfile`
- `SocialLink`
- `NFTItem`
- `ProfileData`
- `CreateProfileFormData`
- `AddLinkFormData`
- `AddNFTFormData`

## Application Flow

### Main App (`App.tsx`)

The app uses a tab-based navigation system:

1. **View Profiles**: Search and view athlete profiles
2. **Create Profile**: Athletes create their profiles
3. **Manage Content**: Athletes manage their social links and NFTs

### User Experience

1. User connects wallet (required)
2. Can switch between three main sections
3. All blockchain interactions use sponsored transactions (Enoki)
4. Real-time feedback with loading states and success messages

## Styling Approach

- CSS custom properties defined in `global.css`
- Inline styles using CSS variables for consistency
- Component-specific styles co-located with components
- No CSS modules or styled-components (keeping it simple)

## Best Practices

1. **Separation of Concerns**: Business logic separated from presentation
2. **Type Safety**: All components and functions are fully typed
3. **Reusability**: UI components are generic and reusable
4. **Consistency**: Design system ensures visual consistency
5. **Accessibility**: Semantic HTML and proper labels
6. **Performance**: Efficient state management and minimal re-renders

## Future Enhancements

### Phase 2 (Planned)
- React Router for dynamic profile URLs (`/athlete-name`)
- Donation functionality with PTBs
- NFT-gated exclusive content
- Supporter Pass NFT display
- Profile dashboard for athletes

### Phase 3 (Future)
- Inner Circle DAO functionality
- Live minting during events
- Team and club support
- Analytics and insights

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Dependencies

- **@mysten/dapp-kit**: Sui wallet connection and blockchain interaction
- **@mysten/sui**: Sui TypeScript SDK
- **@mysten/enoki**: Sponsored transactions
- **@radix-ui/themes**: Base UI components (minimal usage)
- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool

## Notes

- The application uses Enoki for sponsored transactions, removing gas fees for users
- All blockchain interactions are currently using the testnet
- The design prioritizes simplicity and clarity for the hackathon phase

