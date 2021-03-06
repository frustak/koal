import { mockProject1, mockTask } from '../../test/handlers'
import { render, screen, waitFor } from '../../test/test-utils'
import { ProjectDetails } from '../project'

describe('ProjectPage', () => {
	it('should render', async () => {
		render(<ProjectDetails projectId="p1" />)
		const loader = screen.getByTestId('loader')
		expect(loader).toBeInTheDocument()
		await waitFor(() => expect(loader).not.toBeInTheDocument())
		const projectTitle = screen.getByText(mockProject1.name)
		expect(projectTitle).toBeInTheDocument()
		const deleteProjectButton = screen.getByTestId('project-deletion')
		expect(deleteProjectButton).toBeInTheDocument()
		const addTaskButton = screen.getByRole('button', { name: /add task/i })
		expect(addTaskButton).toBeInTheDocument()
		const taskName = screen.getAllByTestId('task-title')[0]
		expect(taskName).toHaveTextContent(mockTask.title)
	})
})
