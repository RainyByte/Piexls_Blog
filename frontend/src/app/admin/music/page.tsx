"use client";

import { useEffect, useState, useRef } from "react";
import { getMusic, adminCreateMusic, adminDeleteMusic, adminReorderMusic } from "@/lib/api";
import { MusicTrack } from "@/types";
import { PixelButton, PixelInput, PixelCard, PixelModal } from "@/components/pixel";

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => getMusic().then(setTracks).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist || "Unknown");

    const cover = coverRef.current?.files?.[0];
    if (cover) formData.append("cover", cover);

    try {
      await adminCreateMusic(formData);
      setShowModal(false);
      setTitle("");
      setArtist("");
      load();
    } catch {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteMusic(id);
    load();
  };

  const moveTrack = async (index: number, direction: -1 | 1) => {
    const newTracks = [...tracks];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newTracks.length) return;
    [newTracks[index], newTracks[swapIndex]] = [newTracks[swapIndex], newTracks[index]];
    setTracks(newTracks);
    await adminReorderMusic(newTracks.map((t) => t.id));
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">🎵 音乐管理</h1>
        <PixelButton size="sm" onClick={() => setShowModal(true)}>
          + 上传音乐
        </PixelButton>
      </div>

      <PixelCard>
        {tracks.map((track, i) => (
          <div key={track.id} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveTrack(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-30">▲</button>
                <button onClick={() => moveTrack(i, 1)} disabled={i === tracks.length - 1} className="text-xs disabled:opacity-30">▼</button>
              </div>
              {track.cover_path ? (
                <img src={`/uploads/${track.cover_path}`} alt="" className="w-10 h-10 pixel-border object-cover" />
              ) : (
                <div className="w-10 h-10 pixel-border bg-bg-secondary flex items-center justify-center">🎵</div>
              )}
              <div>
                <p className="font-bold text-sm">{track.title}</p>
                <p className="text-text-secondary text-xs">{track.artist} · {formatDuration(track.duration)}</p>
              </div>
            </div>
            <PixelButton variant="danger" size="sm" onClick={() => handleDelete(track.id)}>
              删除
            </PixelButton>
          </div>
        ))}
        {tracks.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无音乐</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title="上传音乐">
        <div className="flex flex-col gap-3">
          <PixelInput label="歌曲名" value={title} onChange={(e) => setTitle(e.target.value)} />
          <PixelInput label="艺术家" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Unknown" />
          <div>
            <label className="font-pixel text-xs text-text-secondary block mb-1">MP3 文件</label>
            <input ref={fileRef} type="file" accept=".mp3,audio/mpeg" className="text-sm" />
          </div>
          <div>
            <label className="font-pixel text-xs text-text-secondary block mb-1">封面图（可选）</label>
            <input ref={coverRef} type="file" accept="image/*" className="text-sm" />
          </div>
          <PixelButton onClick={handleUpload} disabled={uploading}>
            {uploading ? "上传中..." : "上传"}
          </PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
