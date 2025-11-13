"use client"
import { createClient } from '@/lib/supabase/client';
import { User } from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {FaTrash} from "react-icons/fa";
import { type FileObject } from "@supabase/storage-js"; // part of supabase-js

// example using Supabase Auth Helpers for Next.js





export default function Page() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [files, setFiles] = useState<FileObject[]>([]);


    useEffect(() => {

        const fetchUser = async () => {

            const {

                data: { user },

            } = await supabase.auth.getUser();

            setUser(user);

        };

        fetchUser();

    }, []);

    const fetchFiles = async () => {
        const res = await fetch("/protected/api/listFiles");
        const json = await res.json();
        if (json.files) setFiles(json.files);
        else console.error(json.error);
    };
    useEffect(() => {
        fetchFiles();
    }, []);

    async function removeFile(filename: string){
        const res = await fetch(`/protected/api/deleteFile?name=${encodeURIComponent(filename)}`, {
            method: "delete",
        });
        fetchFiles();
    }



    async function uploadFile(file: File) {
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const { data, error } = await supabase.storage
            .from('user-files')
            .upload(`uploads/${user?.email}/${file.name}`, file)
        fetchFiles();
        if (error) throw error
        return data
    }

    async function downloadFile(filename: string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const { data, error } = await supabase.storage
            .from('user-files')
            .download(`uploads/${user?.email}/${filename}`)
        if (error) throw error
        const url = URL.createObjectURL(data); // create temporary file URL
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // file name for download prompt
        a.click();
        URL.revokeObjectURL(url); // clean up
        return data
    }


    return (
        <form>
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


            <div>
                <h2>Files uploaded:</h2>
                <ul>
                    {files.map((file) => (
                        <li key={file.name} className="flex items-center justify-between gap-2">
    <span
        className="cursor-pointer text-blue-600 hover:underline"
        onClick={() => downloadFile(file.name)}
    >
      {file.name}
    </span>
                            <button
                                type="button"
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => removeFile(file.name)}
                            >
                                <FaTrash size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


        </form>
    )
}

