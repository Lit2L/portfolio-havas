import Image from 'next/image'
import { Button } from '../button/button'
import WaveReveal from '../text/wave-reveal'
import animataImage from '../../../../public/LarryLogo.png'

// InfoContainer Component
export function InfoContainer({ changeStackAlign }: { changeStackAlign: (card: string) => void }) {
	const underlinedWord = (text: string, card: string) => (
		<span
			onMouseOver={() => changeStackAlign(card)}
			className='cursor-pointer underline decoration-yellow-300 decoration-wavy'
		>
			{' '}
			{text}
		</span>
	)

	return (
		<div className='info-container flex flex-col items-center py-44  md:w-[60%] md:items-start'>
			{/* <ImageWithWave /> */}
			<p className='w-full animate-fadeIn text-center text-lg leading-8 text-gray-300 md:w-[80%] md:text-left'>
				Hand-crafted ✍️ interaction animations and effects from around the internet, designed to be{' '}
				{underlinedWord('Beautiful', 'card1')}, {underlinedWord('Functional', 'card2')}, and{' '}
				{underlinedWord('Interactive', 'card3')} 🌍. Ready to copy and paste into your project to
				enhance its aesthetic and usability.
			</p>
			<div className='mt-6 flex animate-fadeIn justify-center gap-2 md:justify-start'>
				<Button>Documentation</Button>
				<Button>Contribute</Button>
			</div>
		</div>
	)
}

// ImageWithWave Component
function ImageWithWave() {
	return (
		<div className='title-logo relative inline-block self-center md:self-start'>
			<Image
				width={100}
				height={100}
				src={animataImage}
				className='-top-6 h-10 w-10 translate-y-5 animate-fadeIn fade-in-0 md:-top-10 md:h-16 md:w-16 md:translate-y-0'
				alt='Hero image'
			/>
			<WaveReveal
				className='my-4 pl-[0px] text-slate-300 sm:text-[60px] md:px-0 md:text-[70px] lg:text-[80px]'
				text='ANIMATA'
			/>
		</div>
	)
}
