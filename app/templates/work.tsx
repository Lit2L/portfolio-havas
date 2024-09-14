import BlurFade from '@/components/ui/blur-fade'
import { DATA } from '@/data/resume'
import { ResumeCard } from '@/components/resume-card'
import { SectionShell } from '@components/ui/section-shell'
import { SectionHeader } from '@components/ui/section-header'

export const Work = () => {
	const BLUR_FADE_DELAY = 0.04
	return (
		<SectionShell id='work'>
			<SectionHeader heading='work experience' />

			<div className='flex items-center my-16 flex-col gap-y-6 '>
				{DATA.work.map((work, id) => (
					<BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
						<ResumeCard
							key={work.company}
							logoUrl={work.logoUrl}
							altText={work.company}
							title={work.company}
							subtitle={work.title}
							href={work.href}
							badges={work.badges}
							period={`${work.start} - ${work.end ?? 'Present'}`}
							description={work.description}
							features={work.features}
						/>
					</BlurFade>
				))}
			</div>
		</SectionShell>
	)
}
