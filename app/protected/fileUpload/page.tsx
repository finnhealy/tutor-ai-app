"use client"
import { createClient } from '@/lib/supabase/client';
import { User } from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {FaTrash, FaFolder,FaShare, FaUpload, FaArrowLeft, FaFolderPlus} from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import {
    FaRegFilePdf,
    FaRegFileImage,
    FaRegFileVideo,
    FaRegFileAudio,
    FaRegFileWord,
    FaRegFileExcel,
    FaRegFileCode,
    FaRegFileAlt,
} from "react-icons/fa";
// example using Supabase Auth Helpers for Next.js


type Item = {
    id: string;
    name: string;
    is_folder: boolean;
    parent_id: string | null;
    owner_id: string;
    storage_path: string;
    mime_type: string | null;
    size_bytes: number | null;
    created_at: string;
    updated_at: string;
    ui_path: string | null;
};



export default function Page() {
    const supabase = createClient();
    const [currentFolderPath, setCurrentFolderPath] = useState<string>("root");
    const [currentFolderID, setCurrentFolderID] = useState<string>("");
    const [folderStack, setFolderStack] = useState<{id: string; path: string}[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userItems, setUserItems] = useState<Item[]>([])



    async function getRootID(): Promise<string>{
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return ""
        }
        const { data, error } = await supabase.rpc('get_root_id');
        return data
    };

    let refreshTimeout: NodeJS.Timeout | null = null;

    function scheduleRefresh(user : User, currentFolderID : string, currentFolderPath : string) {
        if (!user) return;
        if (refreshTimeout) clearTimeout(refreshTimeout);

        refreshTimeout = setTimeout(() => {
            fetchFiles(user, currentFolderID, currentFolderPath);
        }, 150);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const {data: { user },} = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!user || !currentFolderID) return;

        // Load shared files if we're at root
        if (currentFolderPath === user.id) {
            fetchFiles(user, currentFolderID, currentFolderPath);
            fetchSharedFiles(user);
            return;
        }

        // Normal folder
        fetchFiles(user, currentFolderID, currentFolderPath);

    }, [user, currentFolderID, currentFolderPath]);

    useEffect(() => {
        const fetchRootID = async () => {
            if (!user) return;
            const rootID = await getRootID();
            setCurrentFolderID(rootID);
            setCurrentFolderPath(user.id);
            fetchFiles(user, rootID, currentFolderPath);
        };
        fetchRootID();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        if(currentFolderPath == "root"){
            return;
        }

        // Create ONE stable channel for the user, not per-folder
        const channel = supabase.channel("realtime-items");

        channel
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "items",
                },
                () => {
                    console.log("ITEMS change");
                    fetchFiles(user, currentFolderID, currentFolderPath);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "item_permissions",
                },
                () => {
                    console.log("PERMISSIONS change");
                    console.log("Realtime sees:", currentFolderID, currentFolderPath);
                    scheduleRefresh(user, currentFolderID, currentFolderPath);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, currentFolderPath]); // <-- ONLY user, no folder


    const fetchFiles = async (currentUser: User, rootID : string, currentFolderPath : string) => {
        console.log("fetching available items under folderid", rootID);
        console.log(currentUser.id);
        if (!supabase || !currentUser) {
            console.error('Supabase client or user not available yet');
            return;
        }
        if(!currentFolderID){
            return;
        }

        console.log("calling get available items with folderid ", currentFolderID);
        const { data, error } = await supabase.rpc('get_available_items', {parent : currentFolderID});
        if(error){
            console.error(error);
            return;
        }

        if(currentFolderPath == currentUser.id){
            console.log("currentFolderPath == root directory", currentFolderPath);
            let shared: Item[] = await returnfetchSharedFiles(currentUser);
            setUserItems([...data,...shared]);

        }else{
            console.log("current folder path not root directory", currentFolderPath)
            setUserItems(data);
        }

    };

    const returnfetchSharedFiles = async (currentUser: User) => {
        console.log("fetching shared files");
        if (!supabase || !currentUser) {
            console.error('Supabase client or user not available yet');
            return;
        }
        let data,error;
        ({ data, error } = await supabase.rpc('get_shared_top_level_items'));
        if(error){
            console.error(error);
            return;
        }
        const updatedItems: Item[] = data.map(item => ({
            ...item,
            ui_path: currentUser.id,      // NEW field or computed field
            parent_id: null,      // ok to override
        }));
        console.log("shared files are", data);
        return updatedItems;
    };

    const fetchSharedFiles = async (currentUser: User) => {
        console.log("fetching shared files");
        if (!supabase || !currentUser) {
            console.error('Supabase client or user not available yet');
            return;
        }
        let data,error;
        ({ data, error } = await supabase.rpc('get_shared_top_level_items'));
        if(error){
            console.error(error);
            return;
        }
        console.log("shared files are", data);
        setUserItems(userItems => [...userItems,...data]);
    };


    async function removeFile(id: string, filepath: string | null, name : string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        if(!filepath){
            console.error("invalid filepath recieved for remove operation: " + filepath)
            return
        }
        const res = await fetch(`/protected/api/deleteFile?id=${encodeURIComponent(id)}&filepath=${encodeURIComponent(filepath)}&name=${encodeURIComponent(name)}`, {
            method: "delete",
        });

        if (!res.ok) {
            // If unauthorized:
            if (res.status === 401) {
                alert("You do not have permissions to delete this file.");
                return;
            }

            // Any other error:
            const { error } = await res.json();
            console.error("Delete Failed:", error);
            return;
        }
        fetchFiles(user, currentFolderID, currentFolderPath);
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
        if (!res.ok) {
            // If unauthorized:
            if (res.status === 401) {
                alert("You do not have permissions to delete this Folder.");
                return;
            }

            // Any other error:
            const { error } = await res.json();
            console.error("Delete failed:", error);
            return;
        }

        fetchFiles(user, currentFolderID, currentFolderPath);
    }



    async function uploadFile(file: File) {
        const filename = file.name;
        const isfolder = false;
        const filetype = file.type;
        const filesize = file.size;
        const filepath = currentFolderPath;
        const parentID = currentFolderID;

        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }

        const {data: queryData, error: queryError} = await supabase.rpc('upload_file', { parentid : parentID, desiredname : filename, isfolder : isfolder, mimetype : filetype, sizebytes : filesize, storagepath : filepath}).select();
        let newid = queryData;
        if (queryError) {
            console.error("Upload failed:", queryError.message);
        } else {
            const { data, error } = await supabase.storage
                .from('user-files')
                .upload(`${filepath}/${filename}`, file);
            if (error) throw error;
            const {data: queryData, error: queryError} = await supabase.rpc('inherit_permissions', { new_item_id : newid, parent_item_id : parentID})
            fetchFiles(user, currentFolderID, currentFolderPath);
        }

        return;
    }

    async function createFolder(){
        const folderName = prompt("What do you want to call your folder?");
        if (!folderName){
            console.log("folder creation abandoned");
            return;
        }
        const isfolder = true;
        const filepath = currentFolderPath;
        const parentID = currentFolderID;
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {data: queryData, error: queryError} = await supabase.rpc('upload_file',{ parentid : parentID, desiredname : folderName, isfolder : isfolder, mimetype : null, sizebytes : null, storagepath : filepath})
        if (queryError) {
            console.error("folder creation failed:", queryError.message);
        } else {
            fetchFiles(user, currentFolderID, currentFolderPath);
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

        setFolderStack(prevStack => [...prevStack, { id: currentFolderID, path: filepath }]);
        setCurrentFolderPath(filepath + '/' + filename);
        setCurrentFolderID(fileID);
    }

    function navigateBack(){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet');
            return;
        }

        if (folderStack.length === 0) {
            console.log("Already at root folder");
            return;
        }

        const popped = folderStack[folderStack.length - 1];

        setFolderStack(prevStack => prevStack.slice(0, -1));


        setCurrentFolderPath(popped.path);
        setCurrentFolderID(popped.id);

    }

    async function shareItem(itemID : string, isfolder : boolean){
        const targetID = prompt("What is the ID of the user you want to share with?");
        if (isfolder){
            const res = await fetch(`/protected/api/shareFolder?folderID=${encodeURIComponent(itemID)}&targetID=${encodeURIComponent(targetID)}&canWrite=${false}`, {
                method: "post",
            });
            return;
        }
        const res = await fetch(`/protected/api/shareFile?itemID=${encodeURIComponent(itemID)}&targetID=${encodeURIComponent(targetID)}&canWrite=${false}`, {
            method: "post",
        });

    }

    function getFileIcon(filename: string) {
        const ext = filename.split('.').pop()?.toLowerCase();

        switch (ext) {
            case "pdf":
                return <FaRegFilePdf size={38} className="text-red-600" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <FaRegFileImage size={38} className="text-yellow-600" />;
            case "mp4":
            case "mov":
            case "avi":
                return <FaRegFileVideo size={38} className="text-purple-600" />;
            case "mp3":
            case "wav":
                return <FaRegFileAudio size={38} className="text-green-600" />;
            case "doc":
            case "docx":
                return <FaRegFileWord size={38} className="text-blue-600" />;
            case "xls":
            case "xlsx":
                return <FaRegFileExcel size={38} className="text-green-600" />;
            case "js":
            case "ts":
            case "py":
            case "java":
            case "cpp":
                return <FaRegFileCode size={38} className="text-gray-600" />;
            case "txt":
                return <FaRegFileAlt size={38} className="text-gray-500" />;
            default:
                return <FaRegFileAlt size={38} />;
        }
    }

    function displayPath(currentFolderPath : string){
        const i = currentFolderPath.indexOf('/');
        if( i === -1){
            return 'root';
        }else{
            return 'root' + currentFolderPath.substring(currentFolderPath.indexOf('/'));
        }

    }

    async function downloadFile(fileID: string, filePath: string, filename : string){
        if (!supabase || !user) {
            console.error('Supabase client or user not available yet')
            return
        }
        const { data: isAllowed, error: queryError } = await supabase.rpc('can_user_access_file', {file_id : fileID});
        if (queryError) throw queryError;
        if (isAllowed === false){
            console.error("download not allowed");
            return;
        }
        const { data: fileData, error: downloadError} = await supabase.storage
            .from('user-files')
            .download(`${filePath}/${filename}`);
        if (downloadError) throw downloadError;

        const url = URL.createObjectURL(fileData); // create temporary file URL
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // file name for download prompt
        a.click();
        URL.revokeObjectURL(url); // clean up
        return fileData;
    }


    return (
        <form className="w-full flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4 w-full justify-start">
                {/* Back button */}
                <button
                    type="button"
                    onClick={navigateBack}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-sm font-medium shadow-sm"
                >
                    <FaArrowLeft/>
                    <span>Back</span>
                </button>

                {/* New Folder */}
                <button
                    type="button"
                    onClick={createFolder}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-sm font-medium shadow-sm"
                >
                    <FaFolderPlus/>
                    <span>New Folder</span>
                </button>

                {/* Upload */}
                <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium shadow-sm"
                >
                    <FaUpload/>
                    <span>Upload</span>
                </label>

                <input
                    id="file-upload"
                    type="file"
                    style={{display: "none"}}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadFile(file);
                    }}
                />
            </div>


            <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 w-full">
                    {userItems?.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            onClick={() =>
                                item.is_folder
                                    ? enterFolder(item.id, item.ui_path ?? item.storage_path, item.name)
                                    : downloadFile(item.id, item.storage_path, item.name)
                            }
                        >
                            <div className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                                {item.is_folder ? (
                                    <FaFolder size={38}/>
                                ) : (
                                    getFileIcon(item.name)
                                )}
                            </div>

                            <p className="mt-2 text-sm text-center text-gray-800 dark:text-gray-200 truncate w-full">
                                {item.name}
                            </p>

                            {/* Action bar (below filename, cleaner layout) */}
                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition flex gap-3">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.is_folder
                                            ? removeFolder(item.id, item.storage_path)
                                            : removeFile(item.id, item.storage_path, item.name);
                                    }}
                                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500 hover:text-red-700"
                                    title="Delete"
                                >
                                    <FaTrash size={14}/>
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        shareItem(item.id, item.is_folder);
                                    }}
                                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-500 hover:text-blue-700"
                                    title="Share"
                                >
                                    <FaShare size={14}/>
                                </button>
                            </div>
                        </div>
                    ))}
                    {userItems.length === 0 && (
                        <p className="text-gray-500 text-sm p-4">No files in this folder</p>
                    )}
                </div>
            </div>


        </form>
    )
}

