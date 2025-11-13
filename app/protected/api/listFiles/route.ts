// app/api/list-files/route.ts
import { createClient } from '@/lib/supabase/client';

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from("user-files")
        .list("uploads/finnhealy113@gmail.com");

    return new Response(JSON.stringify({ data, error }));
}