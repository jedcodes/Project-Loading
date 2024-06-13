import { Input } from "./ui/input"

type MyInputProps = {
    onHandleChange: React.Dispatch<React.SetStateAction<string>>,
    type: string ,
    placeholder: string,
    value?: string
}
const MyInput = ({onHandleChange, type, placeholder, value}: MyInputProps) => {
  return (
 
     <Input  type={type} value={value} placeholder={placeholder} onChange={(e) => onHandleChange(e.target.value)} />
  

  )
}

export default MyInput