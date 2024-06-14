import { GameStateController } from "@/components";
import Logo from "@/components/Logo";

const GamePage = () => {
  return (
    <div className="retro-bg">
      <div className="margin-auto relative h-screen flex items-center justify-center flex-col gap-6">
        <Logo />
        <GameStateController />
      </div>
    </div>
  );
}

export default GamePage;
