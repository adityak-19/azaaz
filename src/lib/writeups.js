"use server";
import matter from "gray-matter";

export async function getWriteups() {
  const writeups = {};
  const owner = process.env.GITHUB_USERNAME || 'YOUR_USERNAME';
  const repo = process.env.GITHUB_REPO || 'YOUR_REPO';
  const branch = 'main';
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/public/writeups`;

  try {
    const response = await fetch(baseUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Response:', errorText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();

    for (const event of events) {
      if (event.type === 'dir') {
        writeups[event.name] = {};
        
        const categoriesUrl = `${baseUrl}/${event.name}`;
        const categoriesResponse = await fetch(categoriesUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!categoriesResponse.ok) continue;
        const categories = await categoriesResponse.json();

        for (const category of categories) {
          if (category.type === 'dir' && category.name !== 'images') {
            writeups[event.name][category.name] = [];

            const filesUrl = `${baseUrl}/${event.name}/${category.name}`;
            const filesResponse = await fetch(filesUrl, {
              headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });

            if (!filesResponse.ok) continue;
            const files = await filesResponse.json();

            for (const file of files) {
              if (file.name.endsWith('.md')) {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                const { data, content: mdContent } = matter(content);

                writeups[event.name][category.name].push({
                  slug: file.name.replace('.md', ''),
                  content: mdContent,
                  ...data,
                  image: data.image ? 
                    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/writeups/${event.name}/images/${data.image}` : 
                    null
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
