import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VideoCard from './VideoCard';
import { describe, it, expect, vi } from 'vitest';

describe('VideoCard Component', () => {
  const mockVideo = {
    _id: '123456',
    title: 'Test Video Title',
    youtubeVideoId: 'dQw4w9WgXcQ'
  };
  
  const mockDelete = vi.fn();
  
  it('renders video title correctly', () => {
    render(
      <BrowserRouter>
        <VideoCard 
          video={mockVideo} 
          onDelete={mockDelete}
        />
      </BrowserRouter>
    );
    
    // Check if the title is rendered
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
  });
  it('renders the correct thumbnail URL', () => {
    render(
      <BrowserRouter>
        <VideoCard 
          video={mockVideo} 
          onDelete={mockDelete}
        />
      </BrowserRouter>
    );
    
    // Check if the thumbnail image has the correct src attribute
    const thumbnailImg = screen.getByRole('img');
    expect(thumbnailImg).toHaveAttribute('src', expect.stringContaining('dQw4w9WgXcQ'));
    // Update this line to match the actual alt text
    expect(thumbnailImg).toHaveAttribute('alt', `Thumbnail for ${mockVideo.title}`);
  });
  
});
