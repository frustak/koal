import { render, screen, waitFor } from '../../../test/test-utils'
import { TaskDeletion } from '../deletion'

describe('TaskDeletion', () => {
	test('should delete task', async () => {
		const { user } = render(<TaskDeletion taskId="1" />)
		const deleteTaskButton = screen.getByTestId('task-deletion')
		await user.click(deleteTaskButton)
		expect(deleteTaskButton).toBeDisabled()
		await waitFor(() => expect(deleteTaskButton).toBeEnabled())
	})
})
