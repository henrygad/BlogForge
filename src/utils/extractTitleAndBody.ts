
const extractTitleAndContent = (
  blogText: string
): { title: string; body: string } => {
  // Match the title line only — stop at the first line break
  const titleMatch = blogText.match(/Title:\s*(.+)/i) || [""];
  const title = titleMatch[1].trim();

  // Slice content after the title line
  const titleLineIndex = blogText.indexOf(titleMatch[0]);
  const contentStartIndex = blogText.indexOf("\n", titleLineIndex);
  const body =
    contentStartIndex !== -1
      ? blogText.slice(contentStartIndex).trim()
      : blogText.trim();

  return { title, body };
};

export default extractTitleAndContent;
