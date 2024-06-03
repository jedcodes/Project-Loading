import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GamePage = () => {
  return (
    <div className="relative">
      <div className="hero-bg"></div>
      <div className="flex flex-1 relative flex-col h-screen justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamePage;
