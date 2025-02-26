"use server";
import matter from "gray-matter";

export async function getWriteups() {
  const writeups = {};
  const owner = 'adityak-19';  // Your GitHub username
  const repo = 'z-writeups';   // Your GitHub repository name
  const branch = 'main';       // Your branch name

  try {
    // Fetch the writeups directory listing from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/writeups?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('GitHub API Response:', await response.text());
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();

    for (const event of events) {
      if (event.type === 'dir') {
        writeups[event.name] = {};
        
        // Fetch categories for each event
        const categoriesResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/writeups/${event.name}?ref=${branch}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-store'
          }
        );

        if (!categoriesResponse.ok) continue;
        const categories = await categoriesResponse.json();

        for (const category of categories) {
          if (category.type === 'dir' && category.name !== 'images') {
            writeups[event.name][category.name] = [];

            // Fetch markdown files for each category
            const filesResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/writeups/${event.name}/${category.name}?ref=${branch}`,
              {
                headers: {
                  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json'
                },
                cache: 'no-store'
              }
            );

            if (!filesResponse.ok) continue;
            const files = await filesResponse.json();

            for (const file of files) {
              if (file.name.endsWith('.md')) {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                const { data, content: mdContent } = matter(content);
                
                // Handle image paths to use GitHub raw URLs
                const image = data.image ? 
                  `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/writeups/${event.name}/images/${data.image}` : 
                  null;

                writeups[event.name][category.name].push({
                  slug: file.name.replace('.md', ''),
                  content: mdContent,
                  ...data,
                  image
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
