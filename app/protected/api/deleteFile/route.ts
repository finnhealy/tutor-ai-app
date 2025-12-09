// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: d, error: e } = await supabase.auth.getUser();

    if (e || !d?.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const {data: queryData, error: queryError} = await supabase.rpc('delete_item', { p_id : req.nextUrl.searchParams.get("id"), p_user : d.user.id})
    const filename = req.nextUrl.searchParams.get("name"); // get the query param
    const filepath = req.nextUrl.searchParams.get("filepath");
    if (queryData == false){
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }
    console.log(queryData)
    console.log(queryError)
    console.log(`${filepath}/${filename}`);
    const { data, error } = await supabase.storage
        .from("user-files")
        .remove([`${filepath}/${filename}`]);
    console.log(data);
    console.log(error);
    return new Response(JSON.stringify({ queryData, queryError }));
}


