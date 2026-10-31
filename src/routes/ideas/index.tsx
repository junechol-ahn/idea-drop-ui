import api from '#/lib/axios'
import type { Idea } from '#/types'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'


const ideasQueryOptions = queryOptions({
  queryKey: ['ideas', ],
  queryFn: async () => {
    const res = await api.get('/ideas')
    return res.data
  },
})

export const Route = createFileRoute('/ideas/')({
  head:()=>({
    meta: [
      {
        title: 'IdeaHub - Browse Ideas'
      }
    ]
  }),
  component: IdeasPage,
  loader: async ({context: {queryClient}}) => {
    return queryClient.query({...ideasQueryOptions})
  }
})

function IdeasPage() {
  const {data: ideas} = useSuspenseQuery(ideasQueryOptions)
  console.log(ideas)

  return <div>{ideas.map((idea: Idea) => (
    <>
      <p>{idea.title}</p>
    </>
  ))}</div>
}
