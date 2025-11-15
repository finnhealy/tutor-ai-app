"use client"
import { createClient } from '@/lib/supabase/client';
import { User } from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {FaTrash} from "react-icons/fa";
import { type FileObject } from "@supabase/storage-js"; // part of supabase-js

// example using Supabase Auth Helpers for Next.js


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



export default function Page() {
    const supabase = createClient();
    const [currentFolderPath, setCurrentFolderPath] = useState<string>("root");
    const [currentFolderID, setCurrentFolderID] = useState<string>("");

    const [user, setUser] = useState<User | null>(null);
    const [userItems, setUserItems] = useState<Item[]>([])



    useEffect(() => {
        console.log("currentFolderPath:", currentFolderPath);
    }, [currentFolderPath]);

    useEffect(() => {
        console.log("currentFolderID:", currentFolderID);
    }, [currentFolderID]);

    async function getRootID(): Promise<string>{
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return ""
        }
        const { data, error } = await supabase.rpc('get_root_id');
        return data
    };

    useEffect(() => {

        const fetchUser = async () => {

            const {

                data: { user },

            } = await supabase.auth.getUser();

            setUser(user);

        };

        fetchUser();

    }, []);

    useEffect(() => {
        const fetchRootID = async () => {
            if (!user) return;
            const rootID = await getRootID();
            setCurrentFolderID(rootID);
            setCurrentFolderPath(rootID);
            fetchFiles(user, rootID);
        };
        fetchRootID();
    }, [user]);




    const fetchFiles = async (currentUser: User, rootID : string) => {
        if (!supabase || !currentUser) {
            console.error('Supabase client or user not available yet')
            return
        }
        const { data, error } = await supabase.rpc('get_available_items', {parent : rootID});
        setUserItems(data)

    };


    async function removeFile(filename: string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const res = await fetch(`/protected/api/deleteFile?name=${encodeURIComponent(filename)}`, {
            method: "delete",
        });
        fetchFiles(user);
    }



    async function uploadFile(file: File) {
        const filename = file.name;
        const isfolder = false;
        const filetype = file.type;
        const filesize = file.size;
        const filepath = currentFolderPath;
        const parentID = currentFolderID;
        console.log({ parentid : parentID, desiredname : filename, isfolder : isfolder, mimetype : filetype, sizebytes : filesize, storagepath : filepath})
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const {data: queryData, error: queryError} = await supabase.rpc('upload_file', { parentid : parentID, desiredname : filename, isfolder : isfolder, mimetype : filetype, sizebytes : filesize, storagepath : filepath})
        if (queryError) {
            console.error("Upload failed:", queryError.message);
        } else {
            console.log("Upload succeeded!");
            const { data, error } = await supabase.storage
                .from('user-files')
                .upload(`${filepath}/${filename}`, file)
            if (error) throw error
            fetchFiles(user);
        }

        return;
    }

    async function downloadFile(fileID: string, filePath: string, filename : string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const { data: isAllowed, error: queryError } = await supabase.rpc('can_user_access_file', {file_id : fileID});
        if (queryError) throw queryError
        if (isAllowed === true){
            console.log("download allowed")
        }
        const { data: fileData, error: downloadError} = await supabase.storage
            .from('user-files')
            .download(`${filePath}/${filename}`)
        if (downloadError) throw downloadError

        const url = URL.createObjectURL(fileData); // create temporary file URL
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // file name for download prompt
        a.click();
        URL.revokeObjectURL(url); // clean up
        return fileData
    }


    return (
        <form>
            <p>Current Folder path: {currentFolderPath}</p>
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
                     {userItems?.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2">
    <span
        className="cursor-pointer text-blue-600 hover:underline"
        onClick={() => downloadFile(item.id, currentFolderPath, item.name)}
    >
      {item.name}
    </span>
                            <button
                                type="button"
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => removeFile(item.name)}
                            >
                                <FaTrash size={16}/>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


        </form>
    )
}

