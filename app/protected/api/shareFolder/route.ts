// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



type Item = {
    id: string;
    name: string;
    is_folder: boolean;
    parent_id: string | null;
    owner_id: string;
    storage_path: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    created_at: string;
    updated_at: string;
};


export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: d, error: e } = await supabase.auth.getUser();
    if (e || !d?.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const folderID = req.nextUrl.searchParams.get("folderID"); // get the query param
    const write =  req.nextUrl.searchParams.get("canWrite");
    const targetemail = req.nextUrl.searchParams.get("targetID"); // get the query param


    // get all items inside folder
    console.log(folderID);
    const { data, error } = await supabase.rpc('get_available_items_recursive', {parent : folderID});
    console.log(data);
    const itemIDs = data.map((item : Item) => item.id);
    itemIDs.push(folderID)
    console.log("changing permissions for ids: ", itemIDs);

    const { data : dataone, error : errorone } = await supabase.rpc("get_user_id", {
        p_email: targetemail
    });
    const targetID = dataone

    // add_multiple_item_permission takes an array of itemids, ownerid, target user id, canread, canwrite
    const {data: queryData, error: queryError} = await supabase.rpc('add_multiple_item_permission', { ids: itemIDs, owner_id : d.user.id, target_id : targetID, can_read : true, can_write : write})
    console.log(queryData);
    console.log(queryError);
    return new Response(JSON.stringify({ queryData, queryError }));
}


