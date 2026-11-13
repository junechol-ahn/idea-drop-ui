import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetchIdeas } from '#/api/ideas'
import IdeaCard from '#/components/IdeaCard'
import type { Idea } from '#/types'

const ideasQueryOptions = queryOptions({
	queryKey: ['ideas'],
	staleTime: 30_000,
	queryFn: ()=>fetchIdeas(),
})

export const Route = createFileRoute('/ideas/')({
	head: () => ({
		meta: [
			{
				title: 'IdeaHub - Browse Ideas',
			},
		],
	}),
	component: IdeasPage,
	loader: async ({ context: { queryClient } }) => {
		return queryClient.query(ideasQueryOptions)
	},
})

function IdeasPage() {
	const { data: ideas } = useSuspenseQuery(ideasQueryOptions)
	// const ideas = data.sort((a:Idea,b:Idea)=>{
	// 	const timeA = new Date(a.createdAt).getTime()
	// 	const timeB = new Date(b.createdAt).getTime()
	// 	return timeB - timeA
	// })
	if (ideas.length === 0) {
		return <p>등록된 아이디어가 없습니다.</p>
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Ideas</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{ideas.map((idea) => (
					<IdeaCard key={idea._id} idea={idea} />
				))}
			</div>
		</div>
	)
}
