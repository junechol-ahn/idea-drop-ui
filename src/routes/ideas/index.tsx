import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import api from "#/lib/axios";
import type { Idea } from "#/types";

const ideasQueryOptions = queryOptions({
	queryKey: ["ideas"],
	queryFn: async () => {
		const res = await api.get<Idea[]>("/ideas");
		return res.data;
	},
});

export const Route = createFileRoute("/ideas/")({
	head: () => ({
		meta: [
			{
				title: "IdeaHub - Browse Ideas",
			},
		],
	}),
	component: IdeasPage,
	loader: async ({ context: { queryClient } }) => {
		return queryClient.query({ ...ideasQueryOptions });
	},
});

function IdeasPage() {
	const { data: ideas } = useSuspenseQuery(ideasQueryOptions);
	return (
		<ul className="list-disc pl-6">
			{ideas.map((idea) => (
				<li key={idea.id}>
					<Link
						to="/ideas/$ideaId"
						params={{ ideaId: idea.id }}
						className="text-blue-500 underline"
					>
						{idea.title}
					</Link>
				</li>
			))}
		</ul>
	);
}
