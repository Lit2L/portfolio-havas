'use client'

import { ReactNode, useEffect, useState } from 'react'
import { StarsBackground } from './ui/stars-background'
import { ShootingStars } from './ui/shooting-stars'
// import { useThemeStore } from '../store'
// import { SessionProvider } from 'next-auth/react'

export default function Hydrate({ children }: { children: ReactNode }) {
	const [isHydrated, setIsHydrated] = useState(false)
	// const themeStore = useThemeStore()

	// Waits til Nextjs rehydration completes
	useEffect(() => {
		setIsHydrated(true)
	}, [])

	return (
		// <SessionProvider>
		<>
			{isHydrated ? (
				<body className='min-h-screen bg-background font-robot antialiased bg-dark-50 text-dark-600 transition-colors duration-300 ease-in-out mx-auto max-w-full relative dark:bg-dark-500 dark:text-dark-50 scroll-p-32 scroll-smooth'>
					{/* <StarsBackground />
					<ShootingStars /> */}
					{children}
				</body>
			) : (
				<body></body>
			)}

			{/* </SessionProvider> */}
		</>
	)
}
