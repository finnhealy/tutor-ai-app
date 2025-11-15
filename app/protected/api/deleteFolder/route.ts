// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: d, error: e } = await supabase.auth.getUser();

    if (e || !d?.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const {data: queryData, error: queryError} = await supabase.rpc('delete_item', { p_id : req.nextUrl.searchParams.get("id")})
    //const filename = req.nextUrl.searchParams.get("name"); // get the query param
   // const { data, error } = await supabase.storage
      //  .from("user-files")
     //  .remove([`uploads/${d.user.email}/${filename}`]);
    return new Response(JSON.stringify({ queryData, queryError }));
}

