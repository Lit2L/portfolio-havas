import { ShootingStars } from '@components/ui/shooting-stars'
import { StarsBackground } from '@components/ui/stars-background'
import { About } from '@templates/about'
import { ContactShell } from '@templates/contact-shell'
import { Hero } from '@templates/hero'
import { Projects } from '@templates/projects'
import { Work } from '@templates/work'
import Expandable from './components/animata/carousel/expandable'
import HeroSection from '@components/animata/hero/hero-section'

export default function HomePage() {
	return (
		<main className='mx-auto min-h-screen w-full relative border-4 2xl:max-w-6xl'>
			<HeroSection />
			<Hero />
			{/* <RevealImageList /> */}
			{/* <Expandable /> */}

			{/* <BentoGridThirdDemo /> */}
			<Work />
			{/* <FakeHero /> */}
			{/* <LinkPopup /> */}
			{/* <About /> */}
			<Projects />

			{/* <ContactShell>
				<ContactForm />
			</ContactShell> */}
			<div className='absolute top-0 z-10'>
				<StarsBackground />
				<ShootingStars />
			</div>
		</main>
	)
}

// Larry's kickboxing classes at Nerds Fighting are seriously something else. He's got this way of breaking down martial arts that makes it super approachable for everyone. You walk in, and whether you're new or you've been doing this for years, you immediately feel welcome. The whole "meathead" stereotype? Yeah, that's not a thing here.

// Larry's built this space where you can geek out about technique like you're analyzing a Starcraft match, and then jump into sparring like you're Saenchai in a Muay Thai training camp. It's crazy--one minute you're talking Magic the Gathering, and the next you're trading kicks. What makes this place special is how it blends martial arts with nerd culture in a way that just works.

// Everyone, no matter their age or background, feels like they belong here. It's not just about getting in shape; it's about the community. If you want a place where you can be yourself, talk nerdy, and still train hard, Nerds Fighting is the spot. I highly recommend!
