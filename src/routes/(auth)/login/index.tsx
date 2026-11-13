import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type SubmitEvent, useState } from 'react'
import { loginUser } from '#/api/auth'
import { useAuth } from '#/context/AuthContext'

export const Route = createFileRoute('/(auth)/login/')({
	component: LoginPage,
})

function LoginPage() {
	const navigate = useNavigate()
	const { setAccessToken, setUser } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const { mutateAsync, isPending } = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			setAccessToken(data.accessToken)
			setUser(data.user)
			navigate({ to: '/ideas' })
		},
		onError: (err: any) => {
			setError(err.message)
		},
	})

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			await mutateAsync({
				email,
				password,
			})
		} catch (err: any) {
			console.log(err.message)
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-3xl font-bold mb-6">Login</h1>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
					{error}
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					className="w-full border border-gray rounded-md p-2"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="off"
				/>
				<input
					type="password"
					className="w-full border border-gray rounded-md p-2"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="off"
				/>
				<button
					type="submit"
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
					disabled={isPending}
				>
					{isPending ? 'Logging in...' : 'Login'}
				</button>
			</form>
			<p className="text-sm text-center mt-4">
				Don't have an account?{' '}
				<Link
					className="text-blue-600 hover:underline font-medium"
					to="/register"
				>
					Register
				</Link>
			</p>
		</div>
	)
}
