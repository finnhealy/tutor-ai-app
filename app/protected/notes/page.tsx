import fs from "fs";
import path from "path";
import Link from "next/link";

type Note = {
    title: string;
    slug: string;
};

export default function NotesIndexPage() {
    const notesDir = path.join(
        process.cwd(),
        "notes",
        "higherCS",
        "visualBasic"
    );

    const notes: Note[] = fs
        .readdirSync(notesDir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => ({
            slug: file.replace(".md", ""),
            title: formatTitle(file.replace(".md", "")),
        }));

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Higher Computing Science
                </h1>
                <p className="text-muted-foreground">
                    Visual Basic (VB.NET) — structured revision notes
                </p>
            </header>

            {/* Notes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <Link
                        key={note.slug}
                        href={`/protected/notes/higherCS/visualBasic/${note.slug}`}
                        className="
              rounded-xl
              border
              p-5
              transition
              hover:bg-accent
              hover:border-foreground/20
              focus:outline-none
              focus:ring-2
              focus:ring-ring
            "
                    >
                        <h2 className="font-semibold text-lg">
                            {note.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            View notes
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function formatTitle(slug: string) {
    return slug
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}