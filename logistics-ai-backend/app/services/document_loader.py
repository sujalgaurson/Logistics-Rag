from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
import tempfile


def load_document(file):
    suffix = file.filename.split(".")[-1].lower()

    with tempfile.NamedTemporaryFile(delete=False) as temp:
        temp.write(file.file.read())
        temp_path = temp.name

    try:
        if suffix == "pdf":
            loader = PyPDFLoader(temp_path)
        elif suffix == "docx":
            loader = Docx2txtLoader(temp_path)
        elif suffix == "txt":
            loader = TextLoader(temp_path)
        else:
            raise ValueError("Unsupported file format")

        return loader.load()

    except Exception as e:
        raise RuntimeError(f"Document parsing failed: {str(e)}")
