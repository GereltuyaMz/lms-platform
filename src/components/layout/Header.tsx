import { createClient } from "@/lib/supabase/server";
import { ClientHeader } from "./ClientHeader";

export const Header = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ClientHeader initialUser={user} />;
};
