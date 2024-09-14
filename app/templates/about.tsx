'use client'

import { motion } from 'framer-motion'
import { IoLogoFigma } from 'react-icons/io5'
import {
	SiNeovim,
	SiNextdotjs,
	SiPrisma,
	SiReact,
	SiTailwindcss,
	SiTypescript
} from 'react-icons/si'
import { AnimatedText } from '@components/animated-text'
import { SectionHeader } from '@components/ui/section-header'
import { SectionShell } from '@components/ui/section-shell'
import Image from 'next/image'
import { useMounted } from '@hooks/use-mounted'
import { useTheme } from '@hooks/use-theme'
import { cn } from '@utils/cn'
const MotionImage = motion(Image)

export const About = () => {
	const { theme } = useTheme()
	const mounted = useMounted()

	if (!mounted) return null
	return (
		<SectionShell id='about'>
			<SectionHeader heading='About' />

			<motion.section
				variants={{
					visible: { transition: { staggerChildren: 0.25 } }
				}}
				initial='hidden'
				whileInView='visible'
				exit='hidden'
				viewport={{ once: true }}
				className='gap-y-10 md:ml-24 md:gap-x-8 lg:gap-x-16 relative grid grid-cols-12 mt-24'
			>
				<AnimatedText
					as='p'
					className='col-span-full text-dark-400 dark:text-dark-200 md:col-span-6 xl:col-span-8 text-lg font-light leading-relaxed'
					text='Get a brief look at who I am and what I do. If you would like to know more about me and my interests, you can.'
				/>
				{/* <MotionLinkButton */}
				{/*   href='/about' */}
				{/*   motionProps={{ */}
				{/*     variants: { */}
				{/*       hidden: { opacity: 0, y: 50 }, */}
				{/*       visible: { opacity: 1, y: 0, transition: { ease: 'circOut', duration: 0.5 } }, */}
				{/*     }, */}
				{/*   }} */}
				{/*   className='col-span-full md:col-start-7 xl:col-start-9' */}
				{/* > */}
				{/*   More about me */}
				{/* </MotionLinkButton> */}
			</motion.section>

			<section className='gap-y-10 md:ml-24 md:grid md:gap-x-8 lg:gap-x-16 relative flex flex-col-reverse grid-cols-12 mt-24'>
				<section className='col-span-full md:col-span-6 xl:col-span-8'>
					<motion.article
						variants={{
							visible: { transition: { staggerChildren: 0.15, delayChildren: 0.25 } }
						}}
						initial='hidden'
						whileInView='visible'
						exit='hidden'
						viewport={{ once: true }}
					>
						<AnimatedText
							as='h3'
							text='Who am I'
							className='text-dark-200 dark:text-dark-400 text-sm tracking-wider uppercase'
						/>
						<AnimatedText
							as='p'
							text="My name is Larry Ly and I'm a self-taught developer and overall app builder."
							className='text-dark-400 dark:text-dark-200 mt-6 text-lg font-light leading-relaxed'
						/>
						<AnimatedText
							as='p'
							text='i do it.'
							className='text-dark-400 dark:text-dark-200 mt-6 text-lg font-light leading-relaxed'
						/>
						<AnimatedText
							as='p'
							text='I enjoy the constant change in the technologies used in the area and love diving into new frameworks and technologies.'
							className='text-dark-400 dark:text-dark-200 mt-6 text-lg font-light leading-relaxed'
						/>
						<AnimatedText
							as='p'
							text='Spending time customizing, improving and tinkering with my work environment and tools is something I enjoy a lot, as it is something I use for many hours daily. It allows me to have it exactly as I desire. For instance, I use Neovim as my editor of choice, I have built multiple custom mechanical keyboards, and I use Colemak DHk as my keyboard layout.'
							className='text-dark-400 dark:text-dark-200 mt-6 text-lg font-light leading-relaxed'
						/>
					</motion.article>

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
							<IoLogoFigma size={28} title='Figma' />
							<SiNeovim size={28} title='Neovim' />
							<SiTypescript size={28} title='TypeScript' />
							<SiReact size={28} title='React.js' />
							<SiNextdotjs size={28} title='Next.js' />
							<SiTailwindcss size={28} title='TailwindCSS' />
							<SiPrisma size={28} title='Prisma' />
						</motion.div>
					</motion.section>
				</section>

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
						'mb-6 w-2/3 self-start md:col-span-full md:col-start-7 md:mb-0 md:w-full xl:col-start-9 relative aspect-square rounded-full shadow-xl shadow-black/50',
						{
							'bg-dark-100': theme === 'light',
							'bg-dark-700': theme === 'dark'
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
						className='rounded-full'
					/>
				</motion.figure>
			</section>
		</SectionShell>
	)
}
