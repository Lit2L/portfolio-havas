'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { InfoContainer } from '../container/info-container'
import { Card } from '../card/card'

// HeroSection Component
function HeroSection({ className }: { className?: string }) {
	const [stackAlign, setStackAlign] = useState(false)
	const [cardStack, setCardStack] = useState(['card3', 'card2', 'card1'])

	const cardStacks: { [key: string]: string[] } = {
		card1: ['card3', 'card2', 'card1'],
		card2: ['card3', 'card1', 'card2'],
		card3: ['card1', 'card2', 'card3']
	}

	const changeStackAlign = (card: string) => {
		setStackAlign(true)
		const newStack = cardStacks[card]
		if (newStack) {
			setCardStack(newStack)
		}
	}

	return (
		<div className={cn('hero-container ', className)}>
			<div className='inner-container m-auto flex h-full w-[90%] flex-col items-center justify-around md:flex-row'>
				<InfoContainer changeStackAlign={changeStackAlign} />
				<div className='card-stack-container flex animate-fadeIn items-center justify-center md:m-0 md:w-[40%]'>
					<div className='cards relative flex h-[350px] w-[280px] items-center justify-between md:h-[350px] md:w-[300px]'>
						{cardStack.map((card, index) => (
							<Card key={index} card={card} index={index} stackAlign={stackAlign} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeroSection
