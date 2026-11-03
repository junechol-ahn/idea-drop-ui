import {
	QueryClient,
	queryOptions,
	useMutation,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { fetchIdea, updateIdea } from '#/api/ideas'

const ideaQueryOptions = (id: string) => {
	return queryOptions({
		queryKey: ['idea', id],
		queryFn: () => fetchIdea(id),
	})
}

export const Route = createFileRoute('/ideas/$ideaId/edit')({
	component: IdeaEditPage,
	loader: async ({ params, context: { queryClient } }) => {
		return queryClient.query(ideaQueryOptions(params.ideaId))
	},
})

function IdeaEditPage() {
	const { ideaId } = Route.useParams()
	const navigate = useNavigate()
	const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId))

	const [title, setTitle] = useState(idea.title)
	const [summary, setSummary] = useState(idea.summary)
	const [description, setDescription] = useState(idea.description)
	const [tagsInput, setTagsInput] = useState(idea.tags.join(', '))

  const { mutateAsync, isPending} = useMutation({
    mutationFn: ()=>updateIdea(ideaId, {
      title,
      summary,
      description,
      tags: tagsInput.split(',').map(t=>t.trim()).filter(Boolean)
    }),
    onSuccess: ()=>{
      navigate({to: '/ideas/$ideaId', params: {ideaId}})
    }
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    await mutateAsync()
  }

	return (
		<div className="">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Edit Idea</h1>
				<Link
					to="/ideas/$ideaId"
					params={{ ideaId }}
					className="text-sm text-blue-600 hover:underline"
				>
					Back To Idea
				</Link>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="title"
						className="block text-gray-700 font-medium mb-1"
					>
						Title
					</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter idea title"
					/>
				</div>
				<div>
					<label
						htmlFor="summary"
						className="block text-gray-700 font-medium mb-1"
					>
						Summary
					</label>
					<input
						id="summary"
						type="text"
						value={summary}
						onChange={(e) => setSummary(e.target.value)}
						className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter idea summary"
					/>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-gray-700 font-medium mb-1"
					>
						Description
					</label>
					<textarea
						id="description"
						rows={6}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Write out the description of your idea"
					/>
				</div>
				<div>
					<label htmlFor="tag" className="block text-gray-700 font-medium mb-1">
						Tag
					</label>
					<input
						id="tag"
						type="text"
						value={tagsInput}
						onChange={(e) => setTagsInput(e.target.value)}
						className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="optional tags, comma separated"
					/>
				</div>
				<div className="mt-5">
					<button
						type="submit"
						disabled={isPending}
						className="block w-full bg-blue-600 hover:bg-blu-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPending ? 'Updating...' : 'Update Idea'}
					</button>
				</div>
			</form>
		</div>
	)
}
