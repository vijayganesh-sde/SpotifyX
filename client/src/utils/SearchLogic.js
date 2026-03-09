export const fuzzySearch = (query, songs) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return songs
    .map((song) => {
      let score = 0;
      const title = song.title.toLowerCase();
      const artist = song.artist.toLowerCase();

      // 1. Exact Match (Highest Score)
      if (title === q) score += 100;
      if (artist === q) score += 50;

      // 2. Starts With
      if (title.startsWith(q)) score += 40;

      // 3. Includes (Fuzzy Match)
      if (title.includes(q)) score += 20;
      if (artist.includes(q)) score += 10;

      return { ...song, score };
    })
    .filter((song) => song.score > 0) // Only show relevant results
    .sort((a, b) => b.score - a.score); // Highest score first
};