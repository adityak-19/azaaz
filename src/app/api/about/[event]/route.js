export async function GET(req, { params }) {
  const { event } = params;
  const owner = 'adityak-19';  // Replace with your GitHub username
  const repo = 'z-writeups';         // Replace with your repo name
  const branch = 'main';
  
  const filePath = `writeups/${event}/about.md`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const content = await response.text();
    
    console.log("Fetched about.md content:", content); // Log the content

    // Updated regex to match front matter with leading spaces
    const metadataMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
    const metadata = {};

    if (metadataMatch) {
      const metadataContent = metadataMatch[1];
      metadataContent.split('\n').forEach(line => {
        if (!line.trim()) return;

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.substring(0, colonIndex).trim(); // Trim the key
        const value = line.substring(colonIndex + 1).trim(); // Trim the value

        const cleanKey = key.replace(/^-\s*/, '').toLowerCase().replace(/\s+/g, '_');
        const cleanValue = value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes

        metadata[cleanKey] = cleanValue;
      });
    }

    console.log("Parsed metadata:", metadata); // Log the parsed metadata
    return new Response(JSON.stringify({ metadata }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}