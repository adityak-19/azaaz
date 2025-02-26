export async function getGitHubContent(path) {
  const owner = 'adityak-19';
  const repo = 'z-writeups';
  const branch = 'main';
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.text();
}