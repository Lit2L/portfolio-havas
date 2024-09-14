import { Button as UIButton } from '@/components/ui/button'
// Button Component
export function Button({ children }: { children: React.ReactNode }) {
	return (
		<UIButton className='w-32 bg-gradient-to-r from-blue-400 to-sky-300'>
			<p>{children}</p>
		</UIButton>
	)
}
