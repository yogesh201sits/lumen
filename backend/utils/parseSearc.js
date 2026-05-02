export default function transformDocuments(documents) {
  const urls = [];
  const contents = [];

  for (const doc of documents) {
    urls.push(doc.url);
    contents.push(doc.content);
  }

  return {
    urls,
    contents
  };
  
}