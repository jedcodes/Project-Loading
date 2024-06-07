import { Logo } from "@/components"
import { useFetchCurrentUser,  } from "@/stores/UserStore";

const Lobby = () => {
  const {isLoading, data:users} = useFetchCurrentUser()


   
  return (
    <div className="retro-bg">
      <div className="flex justify-center items-center flex-col h-screen gap-6">
        <Logo />
   <div className="flex flex-row flex-wrap  ">
     {
      isLoading ? <p>Loading...</p> : <ul>
        {users?.map((user) => (
         <div key={user.id} className="bg-neutral-200 p-4 rounded-full">
          <p>{user.username}</p>
         </div>
        ))}
      </ul>
    }
   </div>
      </div>
    </div>
  )
}

export default Lobby