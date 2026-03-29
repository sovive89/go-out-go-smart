import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find(u => u.email === "admin@pop9.com");
  
  if (!existing) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Update password and confirm email
  const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
    password: "admin123",
    email_confirm: true
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

  // Ensure profile exists
  await supabase.from("profiles").upsert({
    id: existing.id,
    email: "admin@pop9.com",
    full_name: "Admin POP9"
  });

  // Ensure role exists
  await supabase.from("user_roles").upsert({
    user_id: existing.id,
    role: "admin"
  }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ success: true, userId: existing.id, confirmed: data.user.email_confirmed_at }));
});
