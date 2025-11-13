// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: d, error: e } = await supabase.auth.getUser();

    if (e || !d?.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const filename = req.nextUrl.searchParams.get("name"); // get the query param
    console.log([`uploads/${d.user.email}/${filename}`])
    const { data, error } = await supabase.storage
        .from("user-files")
        .remove([`uploads/${d.user.email}/${filename}`]);
    console.log(data)
    console.log(error)
    return new Response(JSON.stringify({ data, error }));
}


