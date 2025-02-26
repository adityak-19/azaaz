'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground font-mono p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full space-y-12 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-block">
            <span className="text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
              &gt;_ whoami
            </span>
          </div>
          <h1 className="text-7xl font-bold tracking-tight">
            <span className="text-white">&lt;</span>
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Aditya Kumar
            </span>
            <span className="text-white">/&gt;</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            <span className="text-green-500">$</span> Crafting digital solutions & breaking stuff. 
            <span className="block mt-2">CTF player by night, developer by day.</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { href: "/blogs", label: "blogs", icon: "📝" },
            { href: "/writeups", label: "writeups", icon: "🔐" },
            { href: "/connect", label: "connect", icon: "🤝" }
          ].map((link, i) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (i * 0.1) }}
              onClick={() => router.push(link.href)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 
                          border border-green-500/20 hover:border-green-500 text-gray-300 hover:text-green-400
                          transition-all duration-300 rounded-xl text-lg font-medium backdrop-blur-sm"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="relative">
                  <span className="block transition-all group-hover:translate-x-1">
                    {link.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Press <kbd className="px-2 py-1 bg-gray-900 rounded-md">cmd</kbd> + <kbd className="px-2 py-1 bg-gray-900 rounded-md">k</kbd> to start exploring</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
