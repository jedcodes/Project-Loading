import { Input } from "./ui/input"

type MyInputProps = {
    onHandleChange: React.Dispatch<React.SetStateAction<string>>,
    type: string ,
    placeholder: string,
}
const MyInput = ({onHandleChange, type, placeholder}: MyInputProps) => {
  return (
    <Input  type={type} placeholder={placeholder} onChange={(e) => onHandleChange(e.target.value)} />
  )
}

export default MyInput