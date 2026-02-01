import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";


export default async function Home() {

  const {data, error} = await userService.getSession();

  

  return (
     <div>
      <Button className="text-red-400">Click Here</Button>
      This is a landing page
     </div>
  );
}
