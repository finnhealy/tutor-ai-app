// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";



type Item = {
    item_id: string;
    name: string;
    is_folder: boolean;
    parent_id: string | null;
    owner_id: string;
    storage_path: string | null;
};

export async function DELETE(req: NextRequest) {
    // steps for deleting a folder:
    //1) get info of all files and folders inside
    //2) recursivley delete all of those
    //3) delete any placeholders?
    //4) remove all of those from the database
    try{
        const supabase = await createClient();
        const { data: d, error: e } = await supabase.auth.getUser();

        if (e || !d?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const {data: allItems, error: firstQueryError} = await supabase.rpc('get_all_items_in_folder', { p_folder_id : req.nextUrl.searchParams.get("id")})
        const ItemIDs = allItems.map((item: Item) => item.item_id);

        const nonFolderPaths = allItems.filter((item : Item) => item.is_folder === false).map((item : Item) => item.storage_path + '/' + item.name)
        const {data: dataone, error: SecondQueryError} = await supabase.rpc('delete_items', { ids : ItemIDs, p_user : d.user.id})
        if (SecondQueryError){
            console.error(SecondQueryError)
        }
        //const {data: queryData, error: queryError} = await supabase.rpc('delete_item', { p_id : req.nextUrl.searchParams.get("id")})
        //const filename = req.nextUrl.searchParams.get("name"); // get the query param
        // const { data, error } = await supabase.storage
        //  .from("user-files")
        //  .remove([`uploads/${d.user.email}/${filename}`]);
        if (nonFolderPaths.length > 0) {
            const { data, error } = await supabase.storage
                .from('user-files')
                .remove(nonFolderPaths);

            if (error) {
                console.error('Failed to delete files:', error);
            } else {
                console.log('Deleted files');
            }
        }

        return new Response(JSON.stringify({ allItems, firstQueryError }));
    }catch{
        console.error('Failed to delete files:');
        return new Response('Failed to delete files', { status: 500 });

    }

}

