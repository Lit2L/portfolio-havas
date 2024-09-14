'use client'
import { animate, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SiAmazonredshift, SiMicrosoftsqlserver, SiPostgresql, SiSnowflake } from 'react-icons/si'
import { SiGooglebigquery } from 'react-icons/si'
import { SiGooglecloud } from 'react-icons/si'

import { DatabaseIcon } from 'lucide-react'
import { Label } from './ui/label'
import { IconBrandTailwind } from '@tabler/icons-react'

export function FeatureCard() {
	return (
		<Card>
			<CardSkeletonContainer>
				<Skeleton />
			</CardSkeletonContainer>
		</Card>
	)
}

const Skeleton = () => {
	const scale = [1, 1.2, 1]
	const transform = ['translateY(0px)', 'translateY(-8px)', 'translateY(0px)']
	const sequence = [
		[
			'.circle-1',
			{
				scale,
				transform
			},
			{ duration: 0.8 }
		],
		[
			'.circle-2',
			{
				scale,
				transform
			},
			{ duration: 0.8 }
		],
		[
			'.circle-3',
			{
				scale,
				transform
			},
			{ duration: 0.8 }
		],
		[
			'.circle-4',
			{
				scale,
				transform
			},
			{ duration: 0.8 }
		],
		[
			'.circle-5',
			{
				scale,
				transform
			},
			{ duration: 0.8 }
		]
	]

	useEffect(() => {
		// @ts-ignore
		animate(sequence, {
			repeat: Infinity,
			repeatDelay: 0.8
		})
	}, [])

	return (
		<div className='h-full flex border w-full bg-transparent'>
			<div className='flex w-full  flex-row flex-shrink-0 justify-center items-center gap-6'>
				<div className='bubbles'>
					<Container className='bg-gradient-to-r from-[#31648c] to-[#353535] h-10 w-10 circle-1'>
						<SiPostgresql className='size-6 text-foreground-600' />
					</Container>
					<Label className='text-xs text-center tracking-tighter text-foreground-500 font-bold'>
						PostgreSQL
					</Label>
				</div>
				<div className='bubbles'>
					<Container className='bg-gradient-to-r from-[#31648c] to-[#353535] h-10 w-10 circle-1'>
						<SiPostgresql className='size-6 text-foreground-600' />
					</Container>
					<Label className='text-xs text-center tracking-tighter text-foreground-500 font-bold'>
						PostgreSQL
					</Label>
				</div>
				<div className='bubbles'>
					<Container className='h-10 w-10 bg-gradient-to-r from-[#b01616] to-[#7e7d7d] circle-2'>
						<SiMicrosoftsqlserver className='h-6 w-6 text-foreground  rounded-full' />
					</Container>
					<Label className='text-xs text-center tracking-tighter text-foreground font-bold'>
						SQL-Server
					</Label>
				</div>
				<div className='bubbles'>
					<Container className='h-10 w-10 circle-3'>
						<SiSnowflake className='h-8 w-8 text-foreground' />
					</Container>
					<Label className='text-xs text-center tracking-tighter text-foreground'>Snowflake</Label>
				</div>
				<div className='bubbles '>
					<Container className='bg-gradient-to-r from-blue-500/50 to-orange-500/50 h-10 w-10 circle-4'>
						<SiGooglecloud className='h-6 w-6   rounded-full text-light text-foreground' />
					</Container>
					<Label className='text-xs tracking-tighter text-foreground tracking-wide font-bold'>
						GCP
					</Label>
				</div>
				<div className='bubbles'>
					<Container className='h-10 w-10 circle-5 bg-gradient-to-br from-[#2d71b7] to-[#5292d0]'>
						<SiAmazonredshift className='h-6 w-6 text-foreground ' />
					</Container>
					<Label className='text-xs text-center font-bold tracking-tighter text-foreground'>
						AWS Redshift
					</Label>
				</div>
				<div className='bubbles'>
					<Container className='h-10 w-10 circle-5 bg-cyan-600'>
						<IconBrandTailwind className='h-6 w-6 text-foreground' />
					</Container>
					<Label className='text-xs text-center font-bold tracking-tighter text-foreground '>
						TailwindCSS
					</Label>
				</div>
			</div>

			<div className='h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move'>
				<div className='w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10'>
					<Sparkles />
				</div>
			</div>
		</div>
	)
}
const Sparkles = () => {
	const randomMove = () => Math.random() * 2 - 1
	const randomOpacity = () => Math.random()
	const random = () => Math.random()
	return (
		<div className='absolute inset-0'>
			{[...Array(12)].map((_, i) => (
				<motion.span
					key={`star-${i}`}
					animate={{
						top: `calc(${random() * 100}% + ${randomMove()}px)`,
						left: `calc(${random() * 100}% + ${randomMove()}px)`,
						opacity: randomOpacity(),
						scale: [1, 1.2, 0]
					}}
					transition={{
						duration: random() * 2 + 4,
						repeat: Infinity,
						ease: 'linear'
					}}
					style={{
						position: 'absolute',
						top: `${random() * 100}%`,
						left: `${random() * 100}%`,
						width: `2px`,
						height: `2px`,
						borderRadius: '50%',
						zIndex: 1
					}}
					className='inline-block bg-black dark:bg-white'
				></motion.span>
			))}
		</div>
	)
}

export const Card = ({
	className,
	children
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<div
			className={cn(
				'max-w-xl w-full mx-auto rounded-xl  bg-[rgba(40,40,40,0.0)]  shadow-[2px_4px_16px_0px_rgba(248,248,248,0.09)_inset]/90 group',
				className
			)}
		>
			{children}
		</div>
	)
}

export const CardTitle = ({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) => {
	return <h3 className={cn('text-md font-semibold', className)}>{children}</h3>
}

export const CardDescription = ({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<p
			className={cn(
				'text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm ',
				className
			)}
		>
			{children}
		</p>
	)
}

export const CardSkeletonContainer = ({
	className,
	children,
	showGradient = true
}: {
	className?: string
	children: React.ReactNode
	showGradient?: boolean
}) => {
	return (
		<div
			className={cn(
				'h-[15rem] md:h-[15rem] w-full px-24 rounded-xl z-40 bg-blue-500',
				className,
				showGradient &&
					'bg-sky-700/90 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]'
			)}
		>
			{children}
		</div>
	)
}

const Container = ({ className, children }: { className?: string; children: React.ReactNode }) => {
	return (
		<div
			className={cn(
				`h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_16px_rgba(0,0,0,0.40)]
    `,
				className
			)}
		>
			{children}
		</div>
	)
}
