import { Logo } from "@/components";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="retro-bg">
      <div className="center-contents">
        <Logo />
        <div className="flex flex-row gap-6">
          <Button onClick={() => navigate('/admin')}>Admin</Button>
          <Button onClick={() => navigate('/join')}>Player</Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
