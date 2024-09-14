import { FloatingDock } from '@/components/ui/floating-dock'
import {
	IconBrandGithub,
	IconBrandX,
	IconExchange,
	IconHome,
	IconNewSection,
	IconTerminal2
} from '@tabler/icons-react'
import Image from 'next/image'
import { LinkedInLogoIcon } from '@radix-ui/react-icons'
import { GalleryThumbnails, SquareUser, TrophyIcon } from 'lucide-react'

export function FloatingNavDock() {
	const links = [
		{
			title: 'Home',
			icon: <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: '/#'
		},

		{
			title: 'Applications',
			icon: <GalleryThumbnails className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: '/#applications'
		},
		{
			title: 'Resume',
			icon: <SquareUser className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: '/#resume'
		},
		{
			title: 'Check Marks',
			icon: <TrophyIcon className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: '#checkmarks'
		},

		{
			title: 'LinkedIn',
			icon: <LinkedInLogoIcon className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: 'https://www.linkedin.com/in/larry-ly/'
		},
		{
			title: 'GitHub',
			icon: <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
			href: 'https://github.com/Lit2L'
		}
	]
	return (
		<div className='flex items-center justify-center h-[5rem] fixed bottom-36 w-full'>
			<FloatingDock
				mobileClassName='translate-y-20' // only for demo, remove for production
				items={links}
			/>
		</div>
	)
}
