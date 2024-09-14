'use client'

import { AnimatePresence, motion } from 'framer-motion'
import WaveReveal from '@components/animata/text/wave-reveal'
import {
	SiNeovim,
	SiNextdotjs,
	SiPostgresql,
	SiPrisma,
	SiReact,
	SiTailwindcss,
	SiTypescript
} from 'react-icons/si'
import { AnimatedLetters, AnimatedText } from '@components/animated-text'
import { HeroIllustration } from '@components/hero-illustration'
import { MotionLinkButton } from '@components/ui/link-button'
import { IoLogoFigma } from 'react-icons/io5'
import { cn } from '@lib/utils'
import { useTheme } from '@hooks/use-theme'
import { useMounted } from '@hooks/use-mounted'
import Image from 'next/image'
import StartButton from '@components/animata/button/start-button'
import Duolingo from '@components/animata/button/duolingo'
import { FeatureCard } from '@components/FeatureCard'
import { Container } from '../../components/craft'
import { Label } from '@radix-ui/react-label'

const MotionImage = motion(Image)

export const Hero = () => {
	const { theme } = useTheme()
	const mounted = useMounted()

	if (!mounted) return null

	const profileLight = '/LarryProfileBW.png'
	const profileDark = '/LarryProfile.png'
	return (
		<header
			id='intro'
			className='pt-36 pb-72 shadow-[inset_0_-40px_15px_-10px_#ededed] transition duration-300 ease-in-out dark:shadow-[inset_0_-40px_15px_-10px_#171717] md:bg-auto lg:pt-48 lg:pb-64 xl:py-44 border-4 overflow-hidden'
		>
			<motion.section
				variants={{
					hidden: { transition: { staggerChildren: 0.25, delayChildren: 0.25 } },
					visible: { transition: { staggerChildren: 0.25, delayChildren: 0.25 } }
				}}
				initial='hidden'
				whileInView='visible'
				exit='hidden'
				viewport={{ once: true }}
				className='container relative border-4 flex flex-col space-y-6'
			>
				<AnimatePresence>
					<article className='lg:max-w-[60%]'>
						<AnimatedText
							as='p'
							className='mt-3 text-xl  font-light tracking-widest uppercase text-dark-400 dark:text-dark-200'
							text='Larry Ly'
						/>
						<AnimatedLetters
							as='p'
							text='Data Analyst and Developer'
							className='text-3xl font-black tracking-wide md:text-4xl lg:text-5xl'
							textVariants={{
								hidden: { transition: { staggerChildren: 0.05 } },
								visible: { transition: { staggerChildren: 0.05 } }
							}}
							letterVariants={{
								hidden: { opacity: 0, y: 75 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.5 }
								}
							}}
						/>

						{/* <AnimatedText
							as='p'
							className='mt-3 text-xl  font-light tracking-widest uppercase text-dark-400 dark:text-dark-200'
							text='Larry Ly'
						/> */}
					</article>
				</AnimatePresence>
				<div className='mx-auto w-full'>
					<motion.figure
						variants={{
							hidden: { scaleX: 0, originX: 0 },
							visible: {
								scaleX: 1,
								opacity: 1,
								transition: {
									duration: 0.75,
									ease: [0.9, 0.1, 0.3, 0.96],
									when: 'beforeChildren',
									delayChildren: 0.15,
									delay: 0.25
								}
							}
						}}
						initial='hidden'
						whileInView='visible'
						exit='hidden'
						viewport={{ once: true }}
						className={cn(
							'w-44 h-44 relative aspect-w-4 aspect-h-3 overflow-hidden bg-muted rounded-full shadow-xl shadow-black/50',
							{
								'bg-dark-100': theme === 'light',
								'bg-dark-900': theme === 'dark',
								'border-4': theme === 'light',
								'border-8': theme === 'dark'
							}
						)}
					>
						<MotionImage
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: { duration: 0.5, ease: [0.6, 0.5, 0.5, 0.9] }
								}
							}}
							fill
							quality={95}
							src='/LarryProfileBW.png'
							alt='Portrait of Larry Ly'
							loading='lazy'
							className='rounded-full w-full object-cover'
						/>
					</motion.figure>
				</div>
				<motion.section
					variants={{
						visible: { transition: { staggerChildren: 0.15, delayChildren: 0.25 } }
					}}
					initial='hidden'
					whileInView='visible'
					exit='hidden'
					viewport={{ once: true }}
					className='col-span-full mt-14 md:col-span-6 xl:col-span-8 overflow-hidden'
				>
					<AnimatedText
						as='h3'
						text='Tech I enjoy'
						className='text-dark-200 dark:text-dark-400 text-sm tracking-wider uppercase'
					/>
					<motion.div
						variants={{
							hidden: { y: 50, opacity: 0 },
							visible: {
								y: 0,
								opacity: 1,
								transition: { duration: 0.5, ease: 'circOut' }
							}
						}}
						className='text-dark-300 flex flex-wrap gap-6 mt-6'
					>
						<div className='bubbles'>
							<Container className='h-10 w-10 circle-1'>
								<SiPostgresql className='size-10 text-foreground-600' />
							</Container>
							<Label className='text-xs text-center tracking-tighter text-foreground-500 font-bold'>
								PostgreSQL
							</Label>
						</div>
						<IoLogoFigma size={28} title='Figma' />
						<SiNeovim size={28} title='Neovim' />
						<SiTypescript size={28} title='TypeScript' />
						<SiReact size={28} title='React.js' />
						<SiNextdotjs size={28} title='Next.js' />
						<SiTailwindcss size={28} title='TailwindCSS' />
						<SiPrisma size={28} title='Prisma' />
					</motion.div>

					<div className='mt-6'>
						<FeatureCard />
						<Duolingo />
					</div>
				</motion.section>

				<MotionLinkButton
					href='#projects'
					motionProps={{
						variants: {
							hidden: { opacity: 0, y: 50 },
							visible: {
								opacity: 1,
								y: 0,
								transition: { ease: 'circOut', duration: 0.5 }
							}
						}
					}}
					className='mt-8 inline-block md:mt-16'
				>
					Explore my projects
				</MotionLinkButton>

				<HeroIllustration />
			</motion.section>
		</header>
	)
}
