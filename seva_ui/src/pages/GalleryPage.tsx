import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import type { Album, MediaItem } from '../types/types';
import FileUpload from '../components/FileUpload';
import './GalleryPage.css';

const GalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlbumForm, setShowAlbumForm] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [albumFormData, setAlbumFormData] = useState<Partial<Album>>({ title: '', description: '', coverImage: '' });

    // Media Management State
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [albumMedia, setAlbumMedia] = useState<MediaItem[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(false);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            setLoading(true);
            const data = await contentService.getAllAlbums();
            setAlbums(data);
        } catch (error) {
            console.error('Error fetching albums:', error);
            setAlbums([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAlbum = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAlbum) {
                await contentService.updateAlbum(editingAlbum.id!, albumFormData as Album);
                alert('Album updated successfully!');
            } else {
                await contentService.createAlbum(albumFormData as Album);
                alert('Album created successfully!');
            }
            await fetchAlbums();
            handleCancelAlbumForm();
        } catch (error) {
            console.error('Error saving album:', error);
            alert('Failed to save album');
        }
    };

    const handleEditAlbum = (album: Album) => {
        setEditingAlbum(album);
        setAlbumFormData(album);
        setShowAlbumForm(true);
    };

    const handleCancelAlbumForm = () => {
        setShowAlbumForm(false);
        setEditingAlbum(null);
        setAlbumFormData({ title: '', description: '', coverImage: '' });
    };

    const handleDeleteAlbum = async (id: number) => {
        if (confirm('Are you sure you want to delete this album?')) {
            try {
                await contentService.deleteAlbum(id);
                await fetchAlbums();
                alert('Album deleted successfully!');
            } catch (error) {
                console.error('Error deleting album:', error);
                alert('Failed to delete album');
            }
        }
    };

    const fetchAlbumMedia = async (albumId: number) => {
        try {
            setLoadingMedia(true);
            const media = await contentService.getAlbumMedia(albumId);
            setAlbumMedia(media);
        } catch (error) {
            console.error('Error fetching album media:', error);
            setAlbumMedia([]);
            alert('Failed to load album images');
        } finally {
            setLoadingMedia(false);
        }
    };

    const handleManageMedia = (album: Album) => {
        setSelectedAlbum(album);
        fetchAlbumMedia(album.id!);
    };

    const handleUploadMedia = async (url: string) => {
        if (!selectedAlbum) return;
        try {
            const newItem: MediaItem = {
                url,
                type: 'IMAGE',
                caption: '' // Can add caption input later
            };
            await contentService.addMediaToAlbum(selectedAlbum.id!, newItem);
            await fetchAlbumMedia(selectedAlbum.id!);
            alert('Image added to album!');
        } catch (error) {
            console.error('Error adding media:', error);
            alert('Failed to add image');
        }
    };

    const handleDeleteMedia = async (mediaId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            try {
                await contentService.deleteMediaItem(mediaId);
                if (selectedAlbum) {
                    await fetchAlbumMedia(selectedAlbum.id!);
                }
                alert('Image deleted successfully!');
            } catch (error) {
                console.error('Error deleting media:', error);
                alert('Failed to delete image');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading gallery...</div>;
    }

    if (selectedAlbum) {
        return (
            <div className="gallery-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => setSelectedAlbum(null)}> &larr; Back to Albums</button>
                    <h2>Manage Media: {selectedAlbum.title}</h2>
                </div>

                <div className="card mb-lg">
                    <h3 className="mb-md">Add New Image</h3>
                    <FileUpload onUploadSuccess={handleUploadMedia} label="Upload Image to Album" />
                </div>

                <div className="card">
                    <h3>Album Images</h3>
                    {loadingMedia ? (
                        <div className="loading">Loading media...</div>
                    ) : albumMedia.length === 0 ? (
                        <p className="text-secondary mt-md">No images in this album yet.</p>
                    ) : (
                        <div className="media-grid">
                            {albumMedia.map((item) => (
                                <div key={item.id} className="media-card">
                                    <img src={item.url} alt="Album Media" />
                                    <button
                                        className="delete-media-btn"
                                        onClick={() => handleDeleteMedia(item.id!)}
                                        title="Delete Image"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-page">
            <div className="page-header">
                <h2>Gallery Management</h2>
                {!showAlbumForm && (
                    <button onClick={() => setShowAlbumForm(true)}>+ Create Album</button>
                )}
            </div>

            {showAlbumForm ? (
                <div className="card form-card mb-lg">
                    <h3 style={{ marginBottom: '20px' }}>{editingAlbum ? 'Edit Album' : 'Create New Album'}</h3>
                    <form onSubmit={handleSaveAlbum}>
                        <div className="form-group">
                            <label>Album Title *</label>
                            <input
                                type="text"
                                required
                                value={albumFormData.title}
                                onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                                placeholder="E.g., Guru Purnima 2024"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows={3}
                                value={albumFormData.description}
                                onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
                                placeholder="Brief description of the album"
                            />
                        </div>
                        <div className="form-group">
                            <label>Cover Image</label>
                            <FileUpload
                                onUploadSuccess={(url) => setAlbumFormData({ ...albumFormData, coverImage: url })}
                                label="Upload Cover Image"
                            />
                            {albumFormData.coverImage && (
                                <div className="mt-sm">
                                    <p className="text-secondary text-sm">Preview:</p>
                                    <img
                                        src={albumFormData.coverImage}
                                        alt="Cover Preview"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="button-group gap-md">
                            <button type="submit">{editingAlbum ? 'Update Album' : 'Create Album'}</button>
                            <button type="button" onClick={handleCancelAlbumForm} className="secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : albums.length === 0 ? (
                <p className="text-center mt-lg">No albums found. Click "Create Album" to get started.</p>
            ) : (
                <div className="albums-grid">
                    {albums.map((album) => (
                        <div key={album.id} className="album-card card">
                            {album.coverImage && (
                                <div className="album-cover">
                                    <img src={album.coverImage} alt={album.title} />
                                </div>
                            )}
                            <div className="album-content">
                                <h3>{album.title}</h3>
                                {album.description && <p className="album-description">{album.description}</p>}
                                {album.createdAt && (
                                    <p className="album-date">
                                        Created: {new Date(album.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="album-actions">
                                <button onClick={() => handleManageMedia(album)} className="primary-outline">
                                    Manage Media
                                </button>
                                <button onClick={() => handleEditAlbum(album)} className="secondary">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteAlbum(album.id!)} className="danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
