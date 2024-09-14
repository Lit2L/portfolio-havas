import Image from 'next/image'
import { useTheme } from '@hooks/use-theme'
import LogoLight from '../../public/LarryLogoB.png'
import LogoDark from '../../public/LarryLogo.png'
import Link from 'next/link'

export const Logo = () => {
	const { theme } = useTheme()
	const activeTheme = theme === 'dark' ? 'light' : 'dark'

	return (
		<Link href='/' className=''>
			<Image
				src={activeTheme === 'dark' ? LogoLight : LogoDark}
				alt='Larry Ly Logo'
				width={100}
				height={100}
				priority
			/>
		</Link>
	)
}
