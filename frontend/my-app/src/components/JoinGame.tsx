import Logo from './Logo'
import MyInput from './MyInput'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from './ui/button'
import { useFetchCurrentUser, useSignupNewUser } from '@/stores/UserStore'


const GAME_PIN = '1234'


const InitialStateController = () => {
  const [gamePin, setGamePin] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const {refetch } = useFetchCurrentUser()
  const navigate = useNavigate()
  const signupMutation = useSignupNewUser(refetch);


  const handleJoinGame = () => {
    if(gamePin !== GAME_PIN) {
      alert('Invalid Game Pin')
      return
    } else {
     signupMutation.mutate(username)
      navigate('/lobby')
    }
  }


  return (
    <>
    <div className="margin-auto relative h-screen flex items-center justify-center flex-col gap-6">
        <Logo />
      <div className='flex gap-5 flex-col'>
           <MyInput placeholder='Enter Game Pin' type='text' onHandleChange={setGamePin} />
        <MyInput placeholder='Enter Username' type='text' onHandleChange={setUsername} />
        <Button onClick={handleJoinGame}>Join Game</Button>
      </div>
    </div>
    </>
  )
}

export default InitialStateController