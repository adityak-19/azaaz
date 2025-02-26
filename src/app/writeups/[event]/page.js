"use client";
import Link from "next/link";
import { getWriteups } from "../../../lib/writeups";
import { useEffect, useState, use } from "react";
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";
import Image from "next/image";

export default function EventPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [writeups, setWriteups] = useState(null);
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch writeups data
        const data = await getWriteups();
        const eventData = data[params.event];
        if (!eventData) {
          setWriteups({});
          return;
        }
        
        const filteredData = {};
        Object.entries(eventData).forEach(([key, value]) => {
          if (key !== 'assets') {
            filteredData[key] = value;
          }
        });

        // Fetch about.md content from the new API
        try {
          const response = await fetch(`/api/about/${params.event}`);
          const content = await response.json();
          console.log("Fetched about.md content:", content); // Log the content

          // Set the about content
          const metadata = content.metadata || {};
          const dateRange = metadata.from && metadata.to ? 
            `${metadata.from} - ${metadata.to}` : 
            metadata.year || 'N/A';

          setWriteups({
            ...filteredData,
            event_name: metadata.event_name,
            date: dateRange,
            banner: metadata.banner,
            year: metadata.year
          });

        } catch (error) {
          console.error("Error fetching about.md:", error);
          setWriteups(filteredData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.event]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-foreground font-mono flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-500 text-base sm:text-xl text-center">Loading event details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-foreground font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Link 
            href="/writeups"
            className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors group text-sm sm:text-base"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span className="ml-2">Back to Events</span>
          </Link>
        </motion.div>

        {/* Event Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 sm:mb-16"
        >
          {writeups?.banner && writeups.banner.trim() !== '' && (
            <div className="absolute inset-0 opacity-5">
              <Image
                src={writeups.banner}
                alt="Event Banner"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          )}
          
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center break-words px-4">
              <span className="text-white">&lt;</span>
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {writeups?.event_name || params.event}
              </span>
              <span className="text-white">/&gt;</span>
            </h1>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Event Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-8"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/40 transition-colors">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500">📅</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Date</p>
                    <p className="text-white text-sm sm:text-base">{writeups?.date || 'N/A'}</p>
                  </div>
                </div>
                
                {writeups?.banner && writeups.banner.trim() !== '' && (
                  <div className="relative w-full h-32 sm:h-48 rounded-lg overflow-hidden">
                    <Image
                      src={writeups.banner}
                      alt="Event Banner"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>

            {writeups?.experience && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-green-500/20">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Experience</h3>
                <p className="text-gray-300 text-sm sm:text-base">{writeups.experience}</p>
              </div>
            )}
          </motion.div>

          {/* Categories and Challenges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-green-500/20">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Challenges</h2>
              <div className="space-y-4 sm:space-y-6">
                {writeups && Object.entries(writeups).map(([category, categoryWriteups]) => {
                  if (!Array.isArray(categoryWriteups)) return null;
                  
                  return (
                    <div key={category} className="group">
                      <h3 className="text-lg sm:text-xl text-white mb-2 sm:mb-3 font-medium flex items-center">
                        <span className="text-green-500 mr-2">#</span>
                        {category}
                        <span className="text-gray-500 text-xs sm:text-sm ml-2">({categoryWriteups.length})</span>
                      </h3>
                      <div className="space-y-1 sm:space-y-2 pl-4 sm:pl-6 border-l border-green-500/20">
                        {categoryWriteups.map((writeup) => (
                          <Link
                            href={`/writeups/${params.event}/${writeup.category}/${writeup.slug}`}
                            key={writeup.slug}
                            className="block text-gray-400 hover:text-green-500 transition-colors duration-300 py-1 text-sm sm:text-base break-words"
                          >
                            <span className="inline-block transform group-hover:translate-x-1 transition-transform">
                              {writeup.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}