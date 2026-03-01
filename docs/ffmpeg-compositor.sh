#!/bin/bash
#
# ARK Games 2.0 - FFmpeg Compositor
# Multi-camera streaming with overlays
#
# Usage: ./ffmpeg-compositor.sh <layout> [output]
# Layouts: quad, pip, sidebyside, single, timer, full, dynamic, record
#

set -e

# Configuration
CAM1="${CAM1:-http://192.168.1.101:4747/video}"
CAM2="${CAM2:-http://192.168.1.102:4747/video}"
CAM3="${CAM3:-http://192.168.1.103:4747/video}"
CAM4="${CAM4:-http://192.168.1.104:8080/video}"

OUTPUT_WIDTH=1920
OUTPUT_HEIGHT=1080
FPS=30

# Output destination
RTMP_URL="${RTMP_URL:-rtmp://a.rtmp.youtube.com/live2}"
STREAM_KEY="${STREAM_KEY:-your-stream-key}"

LAYOUT="${1:-quad}"
OUTPUT="${2:-stream}"

echo "🎬 ARK Games Compositor"
echo "Layout: $LAYOUT"
echo "Output: $OUTPUT"
echo ""

case "$LAYOUT" in
  # 2x2 Quad layout
  quad)
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" -i "$CAM3" -i "$CAM4" \
      -filter_complex "
        nullsrc=size=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} [base];
        [0:v] setpts=PTS-STARTPTS, scale=960:540 [cam1];
        [1:v] setpts=PTS-STARTPTS, scale=960:540 [cam2];
        [2:v] setpts=PTS-STARTPTS, scale=960:540 [cam3];
        [3:v] setpts=PTS-STARTPTS, scale=960:540 [cam4];
        [base][cam1] overlay=shortest=1:x=0:y=0 [tmp1];
        [tmp1][cam2] overlay=shortest=1:x=960:y=0 [tmp2];
        [tmp2][cam3] overlay=shortest=1:x=0:y=540 [tmp3];
        [tmp3][cam4] overlay=shortest=1:x=960:y=540
      " \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Picture-in-Picture
  pip)
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" \
      -filter_complex "
        [0:v] setpts=PTS-STARTPTS, scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT} [main];
        [1:v] setpts=PTS-STARTPTS, scale=480:270 [pip];
        [main][pip] overlay=W-w-20:H-h-20
      " \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Side by side (main + 2 small)
  sidebyside)
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" -i "$CAM3" \
      -filter_complex "
        nullsrc=size=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} [base];
        [0:v] setpts=PTS-STARTPTS, scale=1280:1080 [main];
        [1:v] setpts=PTS-STARTPTS, scale=640:540 [side1];
        [2:v] setpts=PTS-STARTPTS, scale=640:540 [side2];
        [base][main] overlay=shortest=1:x=0:y=0 [tmp1];
        [tmp1][side1] overlay=shortest=1:x=1280:y=0 [tmp2];
        [tmp2][side2] overlay=shortest=1:x=1280:y=540
      " \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Single camera
  single)
    ffmpeg -y \
      -i "$CAM1" \
      -vf "scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}" \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Quad with timer overlay
  timer)
    TIMER_FILE="${TIMER_FILE:-/tmp/ark_timer.txt}"
    echo "00:00" > "$TIMER_FILE"
    
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" -i "$CAM3" -i "$CAM4" \
      -filter_complex "
        nullsrc=size=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} [base];
        [0:v] setpts=PTS-STARTPTS, scale=960:540 [cam1];
        [1:v] setpts=PTS-STARTPTS, scale=960:540 [cam2];
        [2:v] setpts=PTS-STARTPTS, scale=960:540 [cam3];
        [3:v] setpts=PTS-STARTPTS, scale=960:540 [cam4];
        [base][cam1] overlay=shortest=1:x=0:y=0 [tmp1];
        [tmp1][cam2] overlay=shortest=1:x=960:y=0 [tmp2];
        [tmp2][cam3] overlay=shortest=1:x=0:y=540 [tmp3];
        [tmp3][cam4] overlay=shortest=1:x=960:y=540 [tmp4];
        [tmp4] drawtext=textfile=$TIMER_FILE:reload=1:fontsize=72:fontcolor=white:x=(w-text_w)/2:y=30:box=1:boxcolor=black@0.7:boxborderw=10
      " \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Full production (quad + timer + scores + branding)
  full)
    TIMER_FILE="${TIMER_FILE:-/tmp/ark_timer.txt}"
    SCORES_FILE="${SCORES_FILE:-/tmp/ark_scores.txt}"
    echo "00:00" > "$TIMER_FILE"
    echo "Lane 1: --- | Lane 2: --- | Lane 3: ---" > "$SCORES_FILE"
    
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" -i "$CAM3" -i "$CAM4" \
      -filter_complex "
        nullsrc=size=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} [base];
        [0:v] setpts=PTS-STARTPTS, scale=960:540 [cam1];
        [1:v] setpts=PTS-STARTPTS, scale=960:540 [cam2];
        [2:v] setpts=PTS-STARTPTS, scale=960:540 [cam3];
        [3:v] setpts=PTS-STARTPTS, scale=960:540 [cam4];
        [base][cam1] overlay=shortest=1:x=0:y=0 [tmp1];
        [tmp1][cam2] overlay=shortest=1:x=960:y=0 [tmp2];
        [tmp2][cam3] overlay=shortest=1:x=0:y=540 [tmp3];
        [tmp3][cam4] overlay=shortest=1:x=960:y=540 [tmp4];
        [tmp4] drawtext=textfile=$TIMER_FILE:reload=1:fontsize=72:fontcolor=white:x=(w-text_w)/2:y=30:box=1:boxcolor=black@0.7:boxborderw=10 [tmp5];
        [tmp5] drawtext=textfile=$SCORES_FILE:reload=1:fontsize=28:fontcolor=white:x=(w-text_w)/2:y=h-60:box=1:boxcolor=black@0.7:boxborderw=8 [tmp6];
        [tmp6] drawtext=text='ARK GAMES 2.0':fontsize=24:fontcolor=white@0.8:x=20:y=20
      " \
      -c:v libx264 -preset ultrafast -tune zerolatency \
      -f flv "$RTMP_URL/$STREAM_KEY"
    ;;

  # Record to file
  record)
    OUTPUT_FILE="${OUTPUT_FILE:-output_$(date +%Y%m%d_%H%M%S).mp4}"
    
    ffmpeg -y \
      -i "$CAM1" -i "$CAM2" -i "$CAM3" -i "$CAM4" \
      -filter_complex "
        nullsrc=size=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} [base];
        [0:v] setpts=PTS-STARTPTS, scale=960:540 [cam1];
        [1:v] setpts=PTS-STARTPTS, scale=960:540 [cam2];
        [2:v] setpts=PTS-STARTPTS, scale=960:540 [cam3];
        [3:v] setpts=PTS-STARTPTS, scale=960:540 [cam4];
        [base][cam1] overlay=shortest=1:x=0:y=0 [tmp1];
        [tmp1][cam2] overlay=shortest=1:x=960:y=0 [tmp2];
        [tmp2][cam3] overlay=shortest=1:x=0:y=540 [tmp3];
        [tmp3][cam4] overlay=shortest=1:x=960:y=540
      " \
      -c:v libx264 -preset medium -crf 23 \
      "$OUTPUT_FILE"
    
    echo "✅ Recorded to: $OUTPUT_FILE"
    ;;

  *)
    echo "❌ Unknown layout: $LAYOUT"
    echo ""
    echo "Available layouts:"
    echo "  quad       - 2x2 grid (4 cameras)"
    echo "  pip        - Picture-in-Picture (2 cameras)"
    echo "  sidebyside - Main + 2 small (3 cameras)"
    echo "  single     - Single camera fullscreen"
    echo "  timer      - Quad with timer overlay"
    echo "  full       - Quad with timer + scores + branding"
    echo "  record     - Save to file instead of stream"
    exit 1
    ;;
esac
