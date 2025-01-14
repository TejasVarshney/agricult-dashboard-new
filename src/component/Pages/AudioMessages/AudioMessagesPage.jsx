import React, { useState, useEffect } from 'react';
import { Play, Pause, Check, X, SlidersHorizontal, Search, Volume2 } from 'lucide-react';
import StatusBadge from '../RFQs/components/StatusBadge';
import { backendLink } from '../../../config/constants';



const AudioMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [volume, setVolume] = useState(2.5);
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);

  useEffect(() => {
    fetchAudioMessages();
  }, []);

  useEffect(() => {
    return () => {
      if (activeAudio?.audio) {
        activeAudio.audio.pause();
        activeAudio.audio.src = '';
        setActiveAudio(null);
        setIsPlaying(false);
      }
    };
  }, []);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gain = context.createGain();
    gain.connect(context.destination);
    setAudioContext(context);
    setGainNode(gain);

    return () => {
      context.close();
    };
  }, []);

  const fetchAudioMessages = async () => {
    try {
      const response = await fetch(`${backendLink}/api/chat/audio`);
      const data = await response.json();
      setMessages(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audio messages:', error);
      setLoading(false);
    }
  };

  const handleAction = async (messageId, action) => {
    try {
      console.log(`Updating message ${messageId} to ${action}`);
      
      const response = await fetch(`${backendLink}/api/chat/audio/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update message status');
      }

      console.log('Message updated successfully:', data);
      
      // Refresh messages after successful update
      await fetchAudioMessages();
      
    } catch (error) {
      console.error(`Error updating message status:`, error);
      // You could add a toast notification here to show the error to the user
      alert(`Error: ${error.message}`);
    }
  };

  const togglePlay = async (audioUrl, messageId) => {
    try {
      if (!audioUrl) {
        console.error("No audio URL provided");
        return;
      }

      if (activeAudio?.messageId === messageId) {
        if (isPlaying) {
          // Pause current audio
          if (activeAudio.source) {
            activeAudio.source.stop();
            activeAudio.source.disconnect();
          }
          setIsPlaying(false);
        } else {
          // Resume/Replay audio
          const response = await fetch(audioUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(gainNode);
          gainNode.gain.value = volume;

          source.onended = () => {
            setIsPlaying(false);
          };

          source.start(0);
          setActiveAudio({ source, messageId });
          setIsPlaying(true);
        }
      } else {
        // Play new audio
        if (activeAudio?.source) {
          activeAudio.source.stop();
          activeAudio.source.disconnect();
        }

        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.gain.value = volume;

        source.onended = () => {
          setIsPlaying(false);
        };

        source.start(0);
        setActiveAudio({ source, messageId });
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.value = newVolume;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(message => {
    // Status filter
    if (statusFilter !== 'all' && message.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.from && new Date(message.created_at) < new Date(dateRange.from)) {
      return false;
    }
    if (dateRange.to && new Date(message.created_at) > new Date(dateRange.to)) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        message.sender?.name?.toLowerCase().includes(searchLower) ||
        message.id.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Helper function to get sender type
  const getSenderType = (message) => {
    if (message.buyer_id) return 'Buyer';
    if (message.seller_id) return 'Seller';
    return 'Unknown';
  };

  // Helper function to get message ID for display
  const getDisplayId = (message) => {
    return message.quote_id ? `Quote #${message.quote_id.slice(0, 8)}` : `Message #${message.id.slice(0, 8)}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Audio Messages</h1>
        <span className="text-sm text-gray-500">
          {filteredMessages.length} messages
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="search"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Date Filters */}
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Modified Volume Control with 500% max */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-500 min-w-[4rem]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  {/* Message Info */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => togglePlay(message.message, message.id)}
                      className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200"
                    >
                      {isPlaying && activeAudio?.messageId === message.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {getDisplayId(message)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({getSenderType(message)})
                        </span>
                        <StatusBadge status={message.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatDate(message.created_at)}</span>
                        {message.quote_id && (
                          <span className="text-blue-600">
                            Related to Quote #{message.quote_id.slice(0, 8)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {message.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(message.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(message.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <SlidersHorizontal className="w-8 h-8 mb-2" />
            <p>No audio messages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioMessagesPage; 
