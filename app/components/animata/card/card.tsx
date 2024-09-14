import { cn } from '@lib/utils'
import Cycling from '../widget/cycling'
import DirectionCard, { testDirectionProps } from '../widget/direction-card'
import WaterTracker from '../widget/water-tracker'
import { CardLabel } from './card-label'

// Card Component
export function Card({
	card,
	index,
	stackAlign
}: {
	card: string
	index: number
	stackAlign: boolean
}) {
	const cardContent = () => {
		switch (card) {
			case 'card1':
				return (
					<>
						<Cycling />
						<CardLabel text='Cycling Card' />
					</>
				)
			case 'card2':
				return (
					<>
						<DirectionCard {...testDirectionProps} />
						<CardLabel text='Direction Card' />
					</>
				)
			case 'card3':
				return (
					<>
						<WaterTracker dailyGoal={3000} />
						<CardLabel text='Water Tracker' />
					</>
				)
			default:
				return null
		}
	}

	return (
		<div
			style={{ boxShadow: index !== 2 ? 'inset 0px -10px 30px 0px #1e293b' : 'none' }}
			key={index}
			className={cn(
				`absolute inset-0 text-center text-gray-800 z-${index} ${card} my-6 flex h-full w-full flex-col items-center justify-around rounded-2xl transition-all duration-700 ease-out`,
				card === 'card1' && stackAlign && 'ml-8 md:ml-0',
				card === 'card2' && (!stackAlign ? '-rotate-[15deg]' : '-left-8 ml-8 rotate-0 md:ml-0'),
				card === 'card3' && (!stackAlign ? 'rotate-[15deg]' : '-left-16 ml-8 rotate-0 md:ml-0'),
				index === 0 && 'scale-90 bg-slate-900',
				index === 1 && 'scale-95 bg-slate-700',
				index === 2 && `scale-100 bg-slate-500 ${stackAlign && 'bg-slate-600'}`
			)}
		>
			<div className='component-container mt-6 flex h-full flex-col justify-around'>
				{cardContent()}
			</div>
		</div>
	)
}
