"use client"
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'





export default function Page() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
    async function uploadFile(file: File) {
        const { data, error } = await supabase.storage
            .from('user-files')
            .upload(`uploads/${file.name}`, file)

        if (error) throw error
        return data
    }
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return
        await uploadFile(file)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            uploadFile(file); // trigger upload immediately
                        }
                    }}
                />
                <label
                    htmlFor="file-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">Upload
                </label>
            </div>
        </form>
    )
}