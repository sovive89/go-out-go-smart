import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const adminEmail = "ricardoferreiradonascimento89@gmail.com";
  const adminPassword = "123456";

  // Find existing user
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find(u => u.email === adminEmail);

  let userId: string;

  if (existing) {
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: adminPassword,
      email_confirm: true,
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    userId = existing.id;
  } else {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: "Ricardo Ferreira" }
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    userId = data.user.id;
  }

  // Ensure profile
  await supabase.from("profiles").upsert({
    id: userId,
    email: adminEmail,
    full_name: "Ricardo Ferreira"
  });

  // Ensure admin role
  await supabase.from("user_roles").upsert({
    user_id: userId,
    role: "admin"
  }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ success: true, userId }));
});
