import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/stat-card";
import { getAudios } from "@/lib/db-service";
import { AudioLibraryClient } from "@/components/audio-library-client";

export const dynamic = "force-dynamic";

export default async function AudioLibraryPage() {
  const audios = await getAudios();

  return (
    <>
      <TopBar title="Audio Library" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AudioLibraryClient audios={audios} />

        {/* Supported Formats info */}
        <Card title="Supported Audio Formats" className="bg-slate-50/50">
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { ext: "MP3", desc: "MPEG Layer-3" },
              { ext: "WAV", desc: "Waveform Audio" },
              { ext: "AAC", desc: "Advanced Audio" },
              { ext: "OGG", desc: "Ogg Vorbis" },
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
