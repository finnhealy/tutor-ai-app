// app/api/list-files/route.ts
import { createClient } from '@/lib/supabase/client';

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from("user-files")
        .list("uploads/finnhealy113@gmail.com");
    const files = data?.filter(data => data.name !== ".emptyFolderPlaceholder") || [];
    return new Response(JSON.stringify({ files, error }));
}