import { Button } from "@/components/ui/button"

const ErrorPage = () => {
  return (
    <div className="retro-bg">
        <div className="center-contents">
            <h1 className="text-3xl text-neutral-200 font-bold">404: Something Went Wrong</h1>
            <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
    </div>
  )
}

export default ErrorPage