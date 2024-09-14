import { SideProjectItem } from '@components/ui/side-project-item'
import { getProjects } from './actions'

export default async function Page() {
	const projects = await getProjects()

	return projects.map((project) => <SideProjectItem key={project.id} project={project} />)
}
