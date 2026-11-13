import api from '#/lib/axios'
import type { Idea } from '#/types'

export const fetchIdeas = async (limit?:number) => {
	const res = await api.get<Idea[]>('/ideas', {
		params: limit ? {_limit: limit} : {}
	})

	return res.data
}

export const fetchIdea = async (ideaId: string) => {
	const res = await api.get<Idea>(`/ideas/${ideaId}`)
	return res.data
}

export const createIdea = async (
	newIdea: Omit<Idea, '_id' | 'createdAt' | 'user'>,
) => {
	const res = await api.post<Idea>('/ideas', {
		...newIdea,
		createdAt: new Date().toISOString(),
	})
	return res.data
}

export const deleteIdea = async (ideaId: string) => {
	await api.delete<Idea>(`/ideas/${ideaId}`)
}

export const updateIdea = async (ideaId: string, updatedData: Omit<Idea, '_id' | 'createdAt' | 'user'>) => {
	const res = await api.patch<Idea>(`/ideas/${ideaId}`, updatedData)
	return res.data
}