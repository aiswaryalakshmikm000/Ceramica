import React, { useRef, useState } from 'react'; 
import { Play } from 'lucide-react';
import video1 from "../../../assets/ThumbanilForVideo/video1.jpg";
import video2 from "../../../assets/ThumbanilForVideo/video2.jpg";
import video3 from "../../../assets/ThumbanilForVideo/video3.jpg";
import video4 from "../../../assets/ThumbanilForVideo/video4.jpg";
import videoSrc from "../../../assets/ThumbanilForVideo/videoSrc.mp4";

const videos = [
  {
    id: 1,
    title: 'The Art of Throwing',
    thumbnail: video1,
    src: videoSrc,
  },
  {
    id: 2,
    title: 'Glazing Techniques',
    thumbnail: video2,
    src: videoSrc,
  },
  {
    id: 3,
    title: 'Kiln Firing Process',
    thumbnail: video3,
    src: videoSrc,
  },
  {
    id: 4,
    title: 'Creating Ceramic Patterns',
    thumbnail: video4,
    src: videoSrc,
  },
];

const VideoCard = ({ video, isPlaying, onVideoClick, videoRef }) => {
  const handleVideoClick = () => {
    onVideoClick(video.id);
  };

  return (
    <div className="group hover-card">
      <div 
        className="relative rounded-lg overflow-hidden aspect-video bg-ceramic-light cursor-pointer"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          poster={video.thumbnail}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          loop
        >
          <source src={video.src} type="video/mp4" />
        </video>

        

        <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
          <button className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Play size={24} className="text-white fill-white" />
          </button>
        </div>
      </div>

      <h3 className="mt-3 text-base font-medium text-ceramic-dark group-hover:text-ceramic-accent transition-colors">
        {video.title}
      </h3>
    </div>
  );
};

const VideoSection = () => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef(videos.map(() => React.createRef()));

  const handleVideoClick = (videoId) => {
    videoRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
      }
    });

  
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    } else {
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoRefs.current[videoIndex].current) {
        videoRefs.current[videoIndex].current.play();
        setPlayingVideoId(videoId);
      }
    }
  };

  return (
    <div className="py-16 md:py-16 pb-16 md:pb-20 bg-ceramic-light/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4 text-left">
            Ceramic Craft in Motion
          </h2>
          <p className="text-ceramic-dark/70 max-w-lg text-left">
            Watch our artisans at work and learn about the ancient craft of ceramics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {videos.slice(0, 2).map((video, index) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                isPlaying={playingVideoId === video.id}
                onVideoClick={handleVideoClick}
                videoRef={videoRefs.current[index]}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {videos.slice(2, 4).map((video, index) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                isPlaying={playingVideoId === video.id}
                onVideoClick={handleVideoClick}
                videoRef={videoRefs.current[index + 2]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;