import re
import os
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

def get_video_id(url):
    # Extract video ID from URL
    # Patterns: https://youtu.be/ID?list=... or https://www.youtube.com/watch?v=ID&...
    if 'youtu.be' in url:
        return url.split('youtu.be/')[1].split('?')[0]
    elif 'v=' in url:
        return url.split('v=')[1].split('&')[0]
    return None

def main():
    lectures_file = 'lectures.txt'
    output_dir = 'transcripts'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(lectures_file, 'r') as f:
        lines = f.readlines()
        
    current_lecture = None
    
    import subprocess

    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.lower().startswith('lecture'):
            current_lecture = line.replace(' ', '_')
            current_lecture = "".join([c for c in current_lecture if c.isalnum() or c in ('_', '-')])
        elif line.startswith('http') and current_lecture:
            video_id = get_video_id(line)
            if video_id:
                print(f"Fetching transcript for {current_lecture} (Video ID: {video_id})...")
                try:
                    # Use the CLI tool
                    result = subprocess.run(
                        ['youtube_transcript_api', video_id, '--format', 'text'],
                        capture_output=True,
                        text=True
                    )
                    
                    if result.returncode == 0:
                        output_path = os.path.join(output_dir, f"{current_lecture}.txt")
                        with open(output_path, 'w') as out_f:
                            out_f.write(result.stdout)
                        print(f"Saved to {output_path}")
                    else:
                        print(f"Error fetching {current_lecture}: {result.stderr}")

                except Exception as e:
                    print(f"Could not fetch transcript for {current_lecture}: {e}")
            
            current_lecture = None

if __name__ == "__main__":
    main()
