"use client";   // ← Add this at the very top of the file (Line 1)

import { useState } from "react";
import { createAudio } from "@/lib/db-service";   // We'll create this next
import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { getAudios } from "@/lib/db-service";
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
  FileAudio,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AudioLibraryPage() {
  const audios = await getAudios();

  return (
    <>
      <TopBar title="Audio Library" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
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
      type="file"
      accept="audio/*"
      onChange={handleFileUpload}
      className="hidden"
    />
    <div className="flex items-center gap-2 bg-[#0d2856] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-900 transition-all">
      <Upload className="w-4 h-4" />
      Upload Audio
    </div>
  </label>
</div>

{/* Upload Dropzone - Now Clickable */}
<Card className="border-2 border-dashed border-slate-300 hover:border-[#0d2856] transition-colors bg-slate-50/50">
  <div className="p-10 text-center">
    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
      <Upload className="w-8 h-8 text-[#0d2856]" />
    </div>
    <h3 className="text-base font-bold text-slate-800 mb-1">
      Click above or drop audio files here
    </h3>
    <p className="text-sm text-slate-500 mb-4">
      MP3, WAV • Max 500MB
    </p>
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
              {audios.map((audio: any) => (
                <div
                  key={audio.id}
                  className="px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Play button / album art */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0d2856] to-[#4a90e2] flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform cursor-pointer">
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    </div>

                    {/* Info */}
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

                    {/* Audio preview waveform */}
                    <div className="hidden md:flex items-end gap-0.5 h-8 w-32">
                      {Array.from({ length: 40 }).map((_, i) => {
                        const height = 20 + Math.abs(Math.sin(i * 0.8 + audio.id)) * 80;
                        return (
                          <div
                            key={i}
                            className="w-0.5 bg-[#4a90e2]/50 rounded-full"
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        title="Preview"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0d2856] transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        title="Download"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {!audio.isDefault && (
                        <button
                          title="Set as Default"
                          className="p-2 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        title="Delete"
                        className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Supported Formats info */}
        <Card title="Supported Audio Formats" className="bg-slate-50/50">
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { ext: "MP3", desc: "MPEG Layer-3", color: "blue" },
              { ext: "WAV", desc: "Waveform Audio", color: "purple" },
              { ext: "AAC", desc: "Advanced Audio", color: "emerald" },
              { ext: "OGG", desc: "Ogg Vorbis", color: "amber" },
            ].map((fmt) => (
              <div
                key={fmt.ext}
                className="bg-white rounded-lg p-4 border border-slate-200 text-center"
              >
                <div className="text-2xl font-black text-[#0d2856] mb-1">
                  {fmt.ext}
                </div>
                <div className="text-xs text-slate-500">{fmt.desc}</div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <strong>💡 Tip:</strong> For best streaming quality, use MP3 files
              encoded at 48kbps mono, 48kHz. This matches Telegram Voice Chat
              requirements and ensures smooth 60-minute broadcasts without
              interruptions.
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
