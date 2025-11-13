// app/api/list-files/route.ts
import { createClient } from '@/lib/supabase/client';

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from("user-files")
        .list("uploads/finnhealy113@gmail.com");
    console.log(data);
    const files = data?.filter(data => data.name !== ".emptyFolderPlaceholder") || [];
    console.log(files)
    return new Response(JSON.stringify({ files, error }));
}