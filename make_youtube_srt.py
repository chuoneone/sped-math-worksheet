from pathlib import Path
import sys

import imageio_ffmpeg
from faster_whisper import WhisperModel


def srt_time(seconds: float) -> str:
    millis = max(0, round(seconds * 1000))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    seconds, millis = divmod(millis, 1_000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{millis:03}"


video = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("0730(1).mp4")
output = video.with_suffix(".zh-TW.srt")

# imageio-ffmpeg supplies the decoder binary without changing the system PATH.
ffmpeg = Path(imageio_ffmpeg.get_ffmpeg_exe())
import os
os.environ["PATH"] = str(ffmpeg.parent) + os.pathsep + os.environ.get("PATH", "")

# The local base model is much lighter for CPU-only transcription.
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, _ = model.transcribe(
    str(video), language="zh", task="transcribe", vad_filter=True,
    beam_size=5, condition_on_previous_text=True,
)

with output.open("w", encoding="utf-8-sig", newline="\n") as srt:
    for number, segment in enumerate(segments, 1):
        text = segment.text.strip()
        if not text:
            continue
        srt.write(f"{number}\n{srt_time(segment.start)} --> {srt_time(segment.end)}\n{text}\n\n")

print(output)
