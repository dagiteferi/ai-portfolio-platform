from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_documents(documents, chunk_size=500, chunk_overlap=50):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunked_docs = []
    for doc in documents:
        chunks = text_splitter.create_documents([doc.page_content], metadatas=[doc.metadata])
        chunked_docs.extend(chunks)
    return chunked_docs