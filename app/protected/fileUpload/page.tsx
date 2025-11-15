"use client"
import { createClient } from '@/lib/supabase/client';
import { User } from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {FaTrash, FaFolder} from "react-icons/fa";

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
    const [previousPath, setPreviousPath] = useState<string>("root");
    const [previousID, setPreviousID] = useState<string>("");

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


    async function removeFile(id: string, filepath: string | null){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        if(!filepath){
            console.error("invalid filepath recieved for remove operation: " + filepath)
            return
        }
        const res = await fetch(`/protected/api/deleteFile?id=${encodeURIComponent(id)}&filepath=${encodeURIComponent(filepath)}`, {
            method: "delete",
        });
        fetchFiles(user, currentFolderID);
    }

    async function removeFolder(id: string, filepath: string | null){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        if(!filepath){
            console.error("invalid filepath recieved for remove operation: " + filepath)
            return
        }
        const res = await fetch(`/protected/api/deleteFolder?id=${encodeURIComponent(id)}&filepath=${encodeURIComponent(filepath)}`, {
            method: "delete",
        });
        fetchFiles(user, currentFolderID);
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
            fetchFiles(user, currentFolderID);
        }

        return;
    }

    async function createFolder(folderName : string){
        const isfolder = true;
        const filepath = currentFolderPath;
        const parentID = currentFolderID;
        console.log({ parentid : parentID, desiredname : folderName, isfolder : isfolder, storagepath : filepath})
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {data: queryData, error: queryError} = await supabase.rpc('upload_file',{ parentid : parentID, desiredname : folderName, isfolder : isfolder, mimetype : null, sizebytes : null, storagepath : filepath})
        if (queryError) {
            console.error("folder creation failed:", queryError.message);
        } else {
            console.log("folder creation succeeded!");
            fetchFiles(user, currentFolderID);
        }

        return;
    }

     function enterFolder(fileID: string, filepath: string | null, filename: string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        if (!filepath){
            console.error("folder entry failure: filepath is null")
            return
        }
        setPreviousPath(filepath);
        setPreviousID(currentFolderID);

        setCurrentFolderPath(filepath + '/' + filename);
        setCurrentFolderID(fileID);
        fetchFiles(user, fileID);
    }

    function navigateBack(){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }

        setCurrentFolderPath(previousPath)
        setCurrentFolderID(previousID)
        fetchFiles(user, previousID)
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
            <label
                htmlFor="navigate-back"
                onClick={() => navigateBack()}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">Back
            </label>
            <label
                htmlFor="create-folder"
                onClick={() => createFolder('newfolder')}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">New
                Folder
            </label>
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
        onClick={() => item.is_folder ? enterFolder(item.id, item.storage_path, item.name) : downloadFile(item.id, currentFolderPath, item.name)}
    >
      {item.name}
    </span>
                            <button
                                type="button"
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => item.is_folder ? removeFolder(item.id, item.storage_path) : removeFile(item.id, item.storage_path)}
                            >
                                <FaTrash size={16}/>
                            </button>
                            {item.is_folder && (<FaFolder size={16}/>)}
                        </li>
                    ))}
                </ul>
            </div>


        </form>
    )
}

