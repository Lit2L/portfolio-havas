import TypingText from '../text/typing-text'

// CardLabel Component
export function CardLabel({ text }: { text: string }) {
	return (
		<div className='mb-3 mt-2 flex w-full justify-center rounded-xl bg-slate-800 p-2'>
			<TypingText repeat={false} className='w-full self-start text-yellow-300' text={text} />
		</div>
	)
}
