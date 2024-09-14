import { ChatBubbleIcon } from '@radix-ui/react-icons'
import {
	IconBrandLinkedin,
	IconBrandTwitter,
	IconBrandYoutube,
	IconApps,
	IconGlobeFilled,
	IconCertificate,
	IconListCheck,
	IconBrandGithub,
	IconTrophy,
	IconUserCircle,
	IconGlobe,
	IconBrandGithubFilled,
	IconBrandOpenai
} from '@tabler/icons-react'
import { HomeIcon, NotebookIcon } from 'lucide-react'
import { IoLogoGithub } from 'react-icons/io5'
import { MdReviews, MdWorkHistory } from 'react-icons/md'
import { SiAboutdotme, SiHackaday, SiHackclub, SiZillow } from 'react-icons/si'
import { VscProject } from 'react-icons/vsc'

export const DATA = {
	name: 'Larry Ly',
	initials: 'LL',
	url: 'https://larryly.com',
	location: 'Orange, CA',
	locationLink: 'https://www.google.com/maps/place/irvine',
	description: 'Data & Applications Developer.',
	summary:
		'A passionate data developer with 7+ years of experience in data governance, data warehousing, data integration, and ETL processes. Seeking challenging roles to further challenge my role in data development. Proficient in SQL, React, Next.js, Typescript, Postgres, SQL, and Python.',
	avatarUrl: '/me.png',
	skills: [
		'Data Governance',
		'Data Warehousing',
		'Data Integration',
		'Data Cleaning',
		'React',
		'Next.js',
		'Typescript',
		'Node.js',
		'Go',
		'Postgres',
		'SQL',
		'Python'
	],
	navbar: [
		{ href: '/#', icon: HomeIcon, label: 'Home' },
		{ href: '/#about', icon: IconUserCircle, label: 'About' },
		{ href: '/#work', icon: IconListCheck, label: 'Work History' },
		{ href: '/#hackathons', icon: IconTrophy, label: 'hackathons' },
		{ href: '/#certifications', icon: IconCertificate, label: 'Certifications' },
		{ href: '/#applications', icon: IconApps, label: 'Applications' }
	],
	contact: {
		email: 'larryly1@gmail.com',
		tel: '+7149075273',
		social: {
			GitHub: {
				name: 'GitHub',
				url: 'https://github.com/Lit2L',
				icon: IconBrandGithubFilled,

				navbar: true
			},
			LinkedIn: {
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/larry-ly/',
				icon: IconBrandLinkedin,

				navbar: true
			}
		}
	},

	work: [
		{
			company: 'Pramira',
			href: 'https://pramira.com',
			badges: ['Firebase', 'External API', 'Data Integration', 'Data Governance'],
			location: 'Tustin, CA',
			title: 'Data Integrations, Data Governance',
			logoUrl: '/pramira.png',
			start: 'May 2021',
			end: 'Oct 2022',
			description:
				'My role focused on leveraging cloud technologies, particularly Firebase, to streamline data collection, storage, and governance processes, thereby enhancing the company’s operational efficiency and decision-making capabilities',
			features: [
				'Developed and deployed a comprehensive data collection system using the Firebase to capture field measurements and images from various on-site projects.',
				'Implemented real-time data ingestion pipelines that facilitated the automatic transfer of field data (including images and measurement dimensions) to Firebase through the Firebase API, ensuring seamless data availability and accessibility for stakeholders.',
				'Established data governance frameworks to ensure data quality, consistency, and security within the Firebase environment.',
				'Implemented data validation protocols and automated data cleansing processes to maintain the accuracy and reliability of field data stored in Firebase'
			]
		},
		{
			company: 'Zillow',
			href: 'https://zillow.com',
			badges: [
				'Data Integration',
				'Data Governance',
				'Data Mapping',
				'External API',
				'SQL-Server DB'
			],
			location: 'Irvine, CA',
			title: 'Data Integrations, Key Analyst',
			logoUrl: '/zillow.png',
			start: 'April 2015',
			end: 'June 2019',
			description:
				'As a Data Integrations, Key Analyst at Zillow, my role was pivotal in establishing and optimizing the data integrations and transactions department. My involvement included developing a robust database pipeline that successfully processed and integrated data from over 3,000 U.S. counties. This position required extensive experience in data mapping, external API ingestion, data mapping  as well as the mortgage industry as a whole.',
			features: [
				'Executed detailed data mapping processes to transform and standardize data from various sources into Zillow’s common data model, ensuring consistent and accurate data integration.',
				'Achieved expansion goal to ingest data from 3000+ US Counties 2 years ahead of schedule.',
				'Data mapping to standardize and transform data from various sources into Zillow’s common data model, ensuring the consistency and accuracy of integrated data.',
				'Achieved a monthly accuracy average of +95% in data accuracy'
			]
		}
	],
	certifications: [
		{
			school: 'DataCamp',
			href: 'https://www.datacamp.com/statement-of-accomplishment/track/673fdda744b5be9498b90b52e936153038451a3e?raw=1',
			degree: 'Associate Data Analyst SQL',
			logoUrl: '/dc.png',
			features: ['SQL', 'Python', 'Data Cleaning'],
			start: 'May',
			end: '2024'
		},
		{
			school: 'Udacity - Google Certification',
			href: 'https://udacity.com',
			degree: 'Data Structures & Algorithms',
			logoUrl: '/udacity.png',
			features: ['SQL', 'Python', 'Data Cleaning'],
			start: 'July',
			end: '2023'
		},
		{
			school: 'The Hong Kong University of Science and Technology - Coursera',
			href: '/coursera-cert.png',
			degree: 'Front-end Web UI Frameworks and Tools',
			logoUrl: '/coursera.png',
			features: ['SQL', 'Python', 'Data Cleaning'],
			start: 'March',
			end: '2022'
		}
	],
	projects: [
		{
			title: 'Chat Collect',
			href: 'https://zillow.com',
			dates: 'Jan 2024 - Feb 2024',
			active: true,
			description:
				'With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Stripe',
				'Shadcn UI',
				'Magic UI'
			],
			links: [
				{
					type: 'Website',
					href: 'https://zillow.com',
					icon: <IconGlobe className='size-3' />
				}
			],
			image: '',
			video: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4'
		},
		{
			title: 'Magic UI',
			href: 'https://magicui.design',
			dates: 'June 2023 - Present',
			active: true,
			description: 'Designed, developed and sold animated UI components for developers.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Stripe',
				'Shadcn UI',
				'Magic UI'
			],
			links: [
				{
					type: 'Website',
					href: 'https://magicui.design',
					icon: <IconGlobeFilled className='size-3' />
				},
				{
					type: 'Source',
					href: 'https://github.com/magicuidesign/magicui',
					icon: <IconBrandGithubFilled className='size-3' />
				}
			],
			image: '',
			video: 'https://cdn.magicui.design/bento-grid.mp4'
		},
		{
			title: 'llm.report',
			href: 'https://llm.report',
			dates: 'April 2023 - September 2023',
			active: true,
			description:
				'Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Shadcn UI',
				'Magic UI',
				'Stripe',
				'Cloudflare Workers'
			],
			links: [
				{
					type: 'Website',
					href: 'https://llm.report',
					icon: <IconBrandOpenai className='size-3' />
				},
				{
					type: 'Source',
					href: 'https://github.com/dillionverma/llm.report',
					icon: <IoLogoGithub className='size-3' />
				}
			],
			image: '',
			video: 'https://cdn.llm.report/openai-demo.mp4'
		},
		{
			title: 'Automatic Chat',
			href: 'https://automatic.chat',
			dates: 'April 2023 - March 2024',
			active: true,
			description:
				'Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Shadcn UI',
				'Magic UI',
				'Stripe',
				'Cloudflare Workers'
			],
			links: [
				{
					type: 'Website',
					href: 'https://automatic.chat',
					icon: <ChatBubbleIcon className='size-3' />
				}
			],
			image: '',
			video: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4'
		}
	],
	hackathons: [
		{
			title: 'Developed Data Transactions Pipeline',
			dates: '2015-2017',
			location: 'Irvine, CA',
			description:
				'Developed and maintained a robust database pipeline capable of ingesting 2-4 TB of data daily from multiple sources, significantly enhancing the desired scope of data processing capabilities.',

			image: '/zillow.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg',
			links: []
		},
		{
			title: 'Expansion of Data Transactions Pipeline to all Major US Counties',
			dates: '2015-2019',
			location: 'Irvine, CA',
			description:
				'Successfully expanded and scaled the data transactions pipeline to include all major U.S. counties, integrating diverse data sources such as external APIs, FTP, PostgreSQL files, CSV, and S3 buckets, contributing to Zillow’s comprehensive data coverage.',
			image: '/zillow.png',

			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg',
			links: [
				{
					title: 'Achievements',
					icon: <SiZillow className='h-4 w-4' />,
					href: 'https://zillow.com'
				}
			]
		},

		{
			title: 'Enhancing the Zestimate Accuracy - Zillow Hackathon',
			dates: 'October 3rd - 14th, 2015',
			location: 'Irvine, CA',
			description:
				'Participated in a team-driven effort to improve the accuracy of the Zestimate, Zillow’s proprietary home valuation model. By identifying and integrating additional data variables, we significantly enhanced the precision of the estimates, contributing to Zillow’s competitive edge in the real estate market.',

			image: '/zillow.png',
			win: '2016 Hackathon Winner',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg',
			links: []
		},
		{
			title: 'Asian Pacific Club - Volunteering',
			dates: 'Jan 3rd - March 24th, 2021',
			location: 'Orange, CA',
			description:
				'Volunteered with the Asian Pacific Club at Zillow, teaching students fundamental SQL and database concepts, fostering their understanding of data management and empowering them with essential technical skills.',
			icon: 'public',
			image: '/zillow.png',
			links: []
		},
		{
			title: 'Data Squad',
			dates: 'Mar 2021 - July 2021',
			location: 'Houston, TX',
			description:
				'Provided volunteer instruction on basic SQL and database principles, guiding students through the foundational elements of data management and helping them develop practical skills for future careers in technology.',
			icon: 'public',
			image: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/firstnet.png',
			links: []
		}
	]
} as const
