import { client } from "@/sanity/lib/client";
import { ARTIST_TIMELINE_QUERY } from "@/sanity/lib/queries";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
    return builder.image(source);
}

export default async function ArtistTimelinePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const artist = await client.fetch(ARTIST_TIMELINE_QUERY, { slug });

    if (!artist) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30">
            {/* Hero Header */}
            <header className="relative h-[40vh] flex items-center justify-center overflow-hidden border-b border-zinc-800/50">
                {artist.image && (
                    <div className="absolute inset-0 opacity-30 blur-2xl scale-110">
                        <Image src={urlFor(artist.image).url()} alt="" fill className="object-cover" />
                    </div>
                )}
                <div className="relative z-10 text-center space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter sm:text-8xl italic uppercase">
                        {artist.name}
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto font-medium leading-relaxed">
                        {artist.bio}
                    </p>
                </div>
            </header>

            {/* Timeline Section */}
            <div className="max-w-5xl mx-auto px-6 py-24 relative">
                {/* Glow Line */}
                <div className="absolute left-8 md:left-1/2 top-24 bottom-24 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent md:-translate-x-1/2" />

                <div className="space-y-32">
                    {artist.events?.map((event: any, index: number) => (
                        <div key={index} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">

                            {/* Center Icon/Dot */}
                            <div className="absolute left-[33px] md:left-1/2 transform -translate-x-1/2 mt-1.5 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-500 z-20 group-hover:scale-150 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300" />

                            {/* Content Box */}
                            <div className="pl-16 md:pl-0 md:w-[42%] transition-all duration-500">
                                <div className="space-y-4">
                                    {/* Date & Badge */}
                                    <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-zinc-500">
                                        <span className="uppercase">{format(new Date(event.date), "MMM yyyy")}</span>
                                        <span className="w-4 h-[1px] bg-zinc-800" />
                                        <span className="text-blue-500 uppercase">{event.type}</span>
                                    </div>

                                    {/* Image/Cover Wrapper (Square 1:1) */}
                                    {event.image && (
                                        <div className="relative aspect-square w-full max-w-[350px] rounded-sm overflow-hidden border border-zinc-800 shadow-2xl group-hover:border-zinc-500 transition-all duration-500">
                                            <Image
                                                src={urlFor(event.image).width(600).height(600).fit('crop').url()}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                            />

                                            {/* Subtle overlay to make text pop if needed */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent shadow-inner" />
                                        </div>
                                    )}

                                    {/* Text Details */}
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                            {event.title}
                                        </h2>
                                        <p className="text-zinc-400 leading-relaxed text-sm">
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Action Link */}
                                    {event.videoUrl && (
                                        <a
                                            href={event.videoUrl}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors pt-2"
                                        >
                                            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10">
                                                ▶
                                            </div>
                                            Watch Performance
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}