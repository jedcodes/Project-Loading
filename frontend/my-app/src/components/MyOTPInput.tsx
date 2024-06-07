import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


type MyOTPInputProps = {
  setGamePin: React.Dispatch<React.SetStateAction<string>>
}

const MyOTPInput = ({setGamePin}: MyOTPInputProps) => {
  return (
      <InputOTP maxLength={6} onChange={(value) => setGamePin(value) }>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default MyOTPInput