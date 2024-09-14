import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'

import { Footer } from '@components/footer'
import { MobileNav } from '@components/mobile-navigation'
import { Navigation } from '@components/navigation'

import './globals.css'
import { Providers } from '@providers'
import { FloatingNavDock } from '@components/FloatingDock'
import Hydrate from '@components/Hydrate'
import { TailwindIndicator } from '@components/TailwindIndicator'

export const metadata: Metadata = {
	title: 'Larry Ly - Frontend developer',
	description: `I'm a self-taught designer & frontend developer, focused on user experience, accessibility and modern web technologies.`
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className='' suppressHydrationWarning>
			<Hydrate>
				<Providers>
					<Navigation />
					<MobileNav />
					{children}
					<FloatingNavDock />
					<TailwindIndicator />
					<Analytics />
					<Footer />
				</Providers>
			</Hydrate>
		</html>
	)
}
