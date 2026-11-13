import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'
import IdeaCard from '#/components/IdeaCard'
import api from '#/lib/axios'
import type { Idea } from '#/types'
import { fetchIdeas } from '#/api/ideas'

const ideasQueryOptions = queryOptions({
	queryKey: ['ideas', {limit:3}],
	staleTime: 30_000,
	// queryFn: async () => {
	// 	const res = await api.get<Idea[]>('/ideas')
	// 	return res.data,
	//},
	queryFn: () => fetchIdeas(3)
})

export const Route = createFileRoute('/')({
	component: Home,
	loader: async ({ context: { queryClient } }) => {
		queryClient.query(ideasQueryOptions)
	},
})

function Home() {
	const { data: ideas } = useSuspenseQuery(ideasQueryOptions)
	// const latestIdeas = [...ideas]
	// 	.sort((a: Idea, b: Idea) => {
	// 		const aTimestamp = new Date(a.createdAt).getTime()
	// 		const bTimestamp = new Date(b.createdAt).getTime()
	// 		return bTimestamp - aTimestamp
	// 	})
	// 	.slice(0, 3)

	return (
		<div className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600">
			<div className="flex flex-col items-start gap-4">
				<Lightbulb className="w-16 h-16 text-yellow-400" />
				<h1 className="text-4xl font-bold text-gray-800">
					Welcome to IdeaDrop
				</h1>
				<p className="text-gray-600 max-w-xs">
					Share, explore, and build on the best startup ideas and side hustles.
				</p>
			</div>

			<section className="flex-1">
				<h2 className="text-2xl font-semibold mb-4 text-gray-800">
					Latest Ideas
				</h2>
				<div className="space-y-6">
					{ideas.map((idea) => (
						<IdeaCard key={idea._id} button={false} idea={idea} />
					))}
				</div>

				<div className="mt-6">
					<Link
						to="/ideas"
						className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
					>
						View All Ideas
					</Link>
				</div>
			</section>
		</div>
	)
}
