"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/stat-card";
import { formatDuration, formatFileSize } from "@/lib/utils";
import {
  Upload,
  Music,
  Trash2,
  Play,
  Pause,
  Download,
  Star,
  Clock,
  HardDrive,
  Loader2,
} from "lucide-react";

type Audio = {
  id: number;
  originalName: string;
  isDefault?: boolean;
  durationSeconds?: number;
  fileSizeBytes?: number;
  mimeType?: string | null;
};

export function AudioLibraryClient({ audios }: { audios: Audio[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Mark as default automatically if this is the first audio uploaded
      if (audios.length === 0) formData.append("is_default", "true");

      const res = await fetch("/api/audio", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Upload failed");
      }
      router.refresh();
    } catch (err: any) {
      setUploadError(err.message || "Could not reach broadcast backend. Is it running?");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this audio file? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/audio/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Delete failed");
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not delete audio file.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/audio/${id}/default`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Could not set default audio");
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not set default audio.");
    } finally {
      setBusyId(null);
    }
  };

  const togglePreview = (id: number) => {
    if (playingId === id) {
      audioElRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioElRef.current) {
      audioElRef.current.src = `/api/audio/${id}/file`;
      audioElRef.current.play().catch(() => {
        alert("Could not play this audio file. Is the backend running?");
      });
      setPlayingId(id);
    }
  };

  return (
    <>
      <audio
        ref={audioElRef}
        onEnded={() => setPlayingId(null)}
        onError={() => setPlayingId(null)}
        className="hidden"
      />

      {/* Header with Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Prayer Audio Files</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your collection of prayer recordings for broadcast
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 bg-[#0d2856] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-900 transition-all">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading…" : "Upload Audio"}
          </div>
        </label>
      </div>

      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {uploadError}
        </div>
      )}

      {/* Upload Dropzone */}
      <Card
        className={`border-2 border-dashed transition-colors bg-slate-50/50 ${
          dragOver ? "border-[#0d2856] bg-blue-50/50" : "border-slate-300 hover:border-[#0d2856]"
        }`}
      >
        <div
          className="p-10 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-[#0d2856] animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-[#0d2856]" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Click above or drop audio files here
          </h3>
          <p className="text-sm text-slate-500 mb-4">MP3, WAV • Max 500MB</p>
          <p className="text-xs text-slate-400">Files will be saved and ready for broadcast</p>
        </div>
      </Card>

      {/* Audio List */}
      <Card title="Uploaded Audio Files" description="Your prayer recording library">
        {audios.length === 0 ? (
          <div className="p-10 text-center">
            <Music className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-medium">No audio files uploaded yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Upload your first prayer recording above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {audios.map((audio) => {
              const isBusy = busyId === audio.id;
              const isPlaying = playingId === audio.id;
              return (
                <div key={audio.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => togglePreview(audio.id)}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0d2856] to-[#4a90e2] flex items-center justify-center text-white shrink-0 shadow-md hover:scale-105 transition-transform"
                      title={isPlaying ? "Pause" : "Preview"}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-800 truncate">
                          {audio.originalName}
                        </h4>
                        {audio.isDefault && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3" fill="currentColor" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(audio.durationSeconds || 0)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(audio.fileSizeBytes || 0)}
                        </span>
                        <span className="uppercase font-semibold tracking-wider">
                          {(audio.mimeType || "").split("/")[1] || "MP3"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`/api/audio/${audio.id}/file`}
                        download={audio.originalName}
                        title="Download"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {!audio.isDefault && (
                        <button
                          title="Set as Default"
                          disabled={isBusy}
                          onClick={() => handleSetDefault(audio.id)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors disabled:opacity-50"
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        title="Delete"
                        disabled={isBusy}
                        onClick={() => handleDelete(audio.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
