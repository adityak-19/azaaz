"use server";
import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

export async function getWriteups() {
  const writeups = {};
  const writeupsDir = path.join(process.cwd(), "public/writeups");

  try {
    // Read all event directories from local public/writeups folder
    const events = await fs.readdir(writeupsDir);

    for (const event of events) {
      const eventPath = path.join(writeupsDir, event);
      const eventStat = await fs.stat(eventPath);

      if (eventStat.isDirectory()) {
        writeups[event] = {};

        // Read categories in each event
        const categories = await fs.readdir(eventPath);

        for (const category of categories) {
          const categoryPath = path.join(eventPath, category);
          const categoryStat = await fs.stat(categoryPath);

          if (categoryStat.isDirectory() && category !== 'images') {
            writeups[event][category] = [];

            // Read markdown files in each category
            const files = await fs.readdir(categoryPath);

            for (const file of files) {
              if (file.endsWith('.md')) {
                const filePath = path.join(categoryPath, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const { data, content: mdContent } = matter(content);

                writeups[event][category].push({
                  slug: file.replace('.md', ''),
                  content: mdContent,
                  ...data,
                  image: data.image ? `/writeups/${event}/images/${data.image}` : null
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading writeups:', error);
    return {};
  }

  return writeups;
}
