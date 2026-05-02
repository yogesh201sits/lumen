// Utility function to transform search documents
export default function transformDocuments(documents) {
  if (!Array.isArray(documents)) {
    throw new Error("Documents must be an array");
  }

  const urls = [];
  const contents = [];

  for (const doc of documents) {
    if (doc.url && doc.content) {
      urls.push(doc.url);
      contents.push(doc.content);
    }
  }

  return {
    urls,
    contents
  };
  
}