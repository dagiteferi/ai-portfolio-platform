"""
File upload service for handling Supabase storage operations.
"""
from typing import Optional
import uuid

from fastapi import HTTPException, UploadFile

from backend.utils.supabase_client import get_supabase_client


class FileUploadService:
    """Service for handling file uploads to Supabase storage."""
    
    BUCKET_NAME = "documents"
    
    # Folder prefixes for organization
    FOLDERS = {
        "cv": "cvs",
        "image": "images",
        "certificate": "certificates",
    }
    
    @classmethod
    async def upload_file(
        cls,
        file: UploadFile,
        folder_type: str,
        prefix: str = ""
    ) -> str:
        """
        Upload a file to Supabase storage.
        
        Args:
            file: The file to upload
            folder_type: Type of folder (cv, image, certificate)
            prefix: Optional prefix for the filename (e.g., "project_", "cert_")
            
        Returns:
            Public URL of the uploaded file
            
        Raises:
            HTTPException: If upload fails
        """
        try:
            supabase = get_supabase_client()
            
            # Generate unique filename
            file_ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
            filename = f"{prefix}{uuid.uuid4()}.{file_ext}"
            
            # Get folder path
            folder = cls.FOLDERS.get(folder_type, "misc")
            file_path = f"{folder}/{filename}"
            
            # Read file content
            content = await file.read()
            
            # Upload to Supabase
            supabase.storage.from_(cls.BUCKET_NAME).upload(
                path=file_path,
                file=content,
                file_options={"content-type": file.content_type or "application/octet-stream"}
            )
            
            # Get public URL
            public_url = supabase.storage.from_(cls.BUCKET_NAME).get_public_url(file_path)
            
            return public_url
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file: {str(e)}"
            )
    
    @classmethod
    async def upload_cv(cls, file: UploadFile) -> str:
        """Upload a CV file."""
        return await cls.upload_file(file, "cv", "cv_")
    
    @classmethod
    async def upload_image(cls, file: UploadFile, prefix: str = "") -> str:
        """Upload an image file."""
        return await cls.upload_file(file, "image", prefix)
    
    @classmethod
    async def upload_certificate(cls, file: UploadFile) -> str:
        """Upload a certificate file."""
        return await cls.upload_file(file, "certificate", "cert_")
