// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: d, error: e } = await supabase.auth.getUser();
    if (e || !d?.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const itemID = req.nextUrl.searchParams.get("itemID"); // get the query param
    const targetemail = req.nextUrl.searchParams.get("targetID"); // get the query param
    const write =  req.nextUrl.searchParams.get("canWrite");
    const { data : dataone, error : errorone } = await supabase.rpc("get_user_id", {
        p_email: targetemail
    });
    const targetID = dataone
    const {data: queryData, error: queryError} = await supabase.rpc('add_item_permission', { owner_id : d.user.id, item_id : itemID, user_id : targetID, can_read : true, can_write : write})
    console.log(queryData);
    console.log(queryError);
    return new Response(JSON.stringify({ queryData, queryError }));
}


