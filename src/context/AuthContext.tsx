import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { refreshAccessToken } from "#/api/auth";
import { setStoredAccessToken } from "#/lib/authToken";

type AuthContextType = {
  accessToken: string | null
  setAccessToken: (token:AuthContextType['accessToken'])=>void
  user: {id: string, email: string, name: string} | null
  setUser: (user:AuthContextType['user']) => void
}

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const AuthProvider = ({children}:{children:ReactNode}) => {
  const [accessToken, setAccessToken] = useState<AuthContextType['accessToken']>(null) 
  const [user, setUser] = useState<AuthContextType['user']>(null)

  useEffect(()=>{
    const loadAuth = async () => {
      try {
        const {accessToken: newToken, user} = await refreshAccessToken()
        setAccessToken(newToken)
        setStoredAccessToken(newToken)
        setUser(user)
      } catch (err:any) {
        console.log('Failed to refresh token', err)
      }
    }

    loadAuth()
  }, [])

  useEffect(()=>{
    setStoredAccessToken(accessToken)
  }, [accessToken])
  
  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if(!context) throw new Error('useAuth must be used within a provider')

  return context
}

