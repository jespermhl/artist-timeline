"use client"; // We use Framer Motion, so this needs to be a client component

import { client } from "@/sanity/lib/client";
import { ARTIST_TIMELINE_QUERY } from "@/sanity/lib/queries";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import imageUrlBuilder from "@sanity/image-url";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export default function ArtistTimelinePage({ params }: { params: any }) {
    const [artist, setArtist] = useState<any>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        params.then((p: any) => {
            client.fetch(ARTIST_TIMELINE_QUERY, { slug: p.slug }).then(setArtist);
        });
    }, [params]);

    if (!artist) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[1em] animate-pulse">Loading Archive...</div>;

    return (
        <main className="bg-[#050505] text-zinc-100 font-sans antialiased overflow-x-hidden">
            {/* Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-[0%]" style={{ scaleX }} />

            {/* --- SECTION 1: THE BRUTALIST HERO --- */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    {artist.image && (
                        <>
                            <Image
                                src={urlFor(artist.image).width(2000).url()}
                                alt=""
                                fill
                                className="object-cover opacity-40 scale-105 blur-[2px]"
                                priority // Add priority here for better loading
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-[#050505]" />
                        </>
                    )}
                </div>

                <div className="relative z-10 w-full px-6 flex flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-blue-500 font-mono text-xs tracking-[0.5em] uppercase mb-8"
                    >
                        Musical Anthology — Vol. 1
                    </motion.p>
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[18vw] leading-[0.75] font-black uppercase text-center italic tracking-tighter"
                    >
                        {artist.name}
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ delay: 0.5, duration: 1 }}
                        className="h-[1px] bg-white my-12"
                    />
                    <p className="max-w-xl text-center text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                        {artist.bio}
                    </p>
                </div>
            </section>

            {/* --- SECTION 2: THE TIMELINE --- */}
            <div className="max-w-[1400px] mx-auto px-6 py-40">
                <div className="space-y-[30vh]">
                    {artist.events?.map((event: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`flex flex-col md:flex-row gap-16 md:gap-32 items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* IMAGE PORTION */}
                            <div className="w-full md:w-1/2 relative group">
                                <div className="absolute -inset-4 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative aspect-square w-full overflow-hidden border border-white/10 p-2 bg-zinc-900/50 backdrop-blur-xl group-hover:border-blue-500/50 transition-all duration-700">
                                    {/* Find this section inside your map */}
                                    {event.image ? (
                                        <Image
                                            src={urlFor(event.image).width(1200).height(1200).fit("crop").url()}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800 italic text-xs">
                                            No visual archive available
                                        </div>
                                    )}
                                    {/* Digital Timestamp Overlay */}
                                    <div className="absolute bottom-6 right-6 mix-blend-difference font-mono text-xs text-white">
                                        REF_{index.toString().padStart(3, "0")}
                                    </div>
                                </div>
                            </div>

                            {/* CONTENT PORTION */}
                            <div className="w-full md:w-1/2 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6">
                                        <span className="h-[1px] w-12 bg-blue-500" />
                                        <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em]">
                                            {event.type}
                                        </span>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                                        {event.title}
                                    </h2>
                                    <p className="text-zinc-500 font-mono text-sm">
                                        RELEASED // {format(new Date(event.date), "dd.MM.yyyy")}
                                    </p>
                                </div>

                                <p className="text-zinc-400 text-xl leading-relaxed font-light">
                                    {event.description}
                                </p>

                                {/* TRACKLIST: The "Technical Card" */}
                                {event.tracklist && (
                                    <div className="relative mt-12 p-1 border-t border-b border-white/10 group/list hover:border-blue-500/30 transition-colors py-8">
                                        <div className="flex justify-between items-end mb-8">
                                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600">Track Manifest</h3>
                                            <span className="text-[10px] font-mono text-zinc-700">{event.tracklist.length} SENSORY_INPUTS</span>
                                        </div>

                                        <div className="space-y-2">
                                            {event.tracklist.map((track: string, i: number) => (
                                                <div key={i} className="flex items-center group/item py-1">
                                                    <span className="w-8 text-[10px] font-mono text-zinc-700 group-hover/item:text-blue-500">{(i + 1).toString().padStart(2, '0')}</span>
                                                    <span className="flex-1 text-sm uppercase tracking-tight group-hover/item:translate-x-2 transition-transform duration-300">{track}</span>
                                                    <div className="w-0 group-hover/item:w-12 h-[1px] bg-blue-500 transition-all duration-300" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* THE ACTION: Video with an Animated Glow */}
                                {event.videoUrl && (
                                    <a href={event.videoUrl} target="_blank" className="relative inline-flex items-center gap-4 py-4 px-8 border border-white group/btn overflow-hidden">
                                        <div className="absolute inset-0 bg-white translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
                                        <span className="relative z-10 text-xs font-black uppercase tracking-widest group-hover/btn:text-black">Play Visual Archive</span>
                                        <span className="relative z-10 text-blue-500 group-hover/btn:text-black">→</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- FOOTER: MINIMAL --- */}
            <footer className="h-screen flex flex-col items-center justify-center border-t border-white/5 space-y-8">
                <h2 className="text-[10vw] font-black opacity-10 tracking-tighter">FIN</h2>
                <p className="font-mono text-[10px] uppercase tracking-[1em] text-zinc-700 italic">Timeline Authenticated</p>
            </footer>
        </main>
    );
}