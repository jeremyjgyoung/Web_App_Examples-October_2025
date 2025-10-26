import { Button } from "flowbite-react";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="m-8 text-center">
      <h2 className="my-3 text-center text-2xl font-medium">Welcome Home</h2>
      <p>
        This is the home page. Click on the links in the navigation bar to see
        other pages. Read the README.md file for more information.
      </p>
      <Button
        onClick={() => navigate("/layouts")}
        color="testColor"
        className="mx-auto mt-4"
      >
        Go to Layout!
      </Button>
    </div>
  );
}
