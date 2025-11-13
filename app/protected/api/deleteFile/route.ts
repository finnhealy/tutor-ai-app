// app/api/list-files/route.ts
import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // use service role key here
);
export async function GET(req: NextRequest) {
    const filename = req.nextUrl.searchParams.get("name"); // get the query param
    const { data, error } = await supabase.storage
        .from("user-files")
        .remove([`uploads/finnhealy113@gmail.com/${filename}`]);
    console.log(data)
    console.log(error)
    return new Response(JSON.stringify({ data, error }));
}


