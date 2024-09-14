'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { LinkPreview } from '@/components/ui/link-preview'

export function LinkPopup() {
	return (
		<div className='flex justify-center items-center h-[40rem] flex-col px-4'>
			<div className='text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10'>
				<LinkPreview url='https://nerdsfighting.com' className='font-bold'>
					<span>Tailwind CSS</span>
				</LinkPreview>{' '}
				<span>and</span>
				<LinkPreview url='https://framer.com/motion' className='font-bold'>
					<span>Framer Motion</span>
				</LinkPreview>{' '}
				<span>are a great way to build modern websites.</span>
			</div>
			<p className='text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto'>
				Visit{' '}
				<LinkPreview
					url='https://ui.aceternity.com'
					className='font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500'
				>
					Aceternity UI
				</LinkPreview>{' '}
				for amazing Tailwind and Framer Motion components.
			</p>
		</div>
	)
}
