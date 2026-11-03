import api from '#/lib/axios'
import type { Idea } from '#/types'

export const fetchIdeas = async () => {
	const res = await api.get<Idea[]>('/ideas')
	return res.data
}

export const fetchIdea = async (ideaId: string) => {
	const res = await api.get<Idea>(`/ideas/${ideaId}`)
	return res.data
}

export const createIdea = async (newIdea: Omit<Idea, 'id'|'createdAt'|'user' > ) => {
	const res = await api.post<Idea>('/ideas', {
		...newIdea,
		createdAt: new Date().toISOString()
	})
	return res.data
}