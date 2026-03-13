settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

server.telnet(port=1234)

music_root = "/home/magmek/stream/playlists"
current_playlist = ref("prelude")

# This function tells Liquidsoap how to find the "next" song
# based on the current value of the 'current_playlist' ref.
def get_next_song() =
  # We use 'request.create' to grab the next available file 
  # from the specific directory.
  path = music_root ^ "/" ^ !current_playlist
  
  # 'request.dynamic' expects a request object. 
  # We'll use a playlist internally to handle the alphabetical 'normal' logic.
  # However, to keep it simple and reactive to your 'skip' command:
  result = process.read("ls -1 " ^ path ^ "/*.mp3 | head -n 1")
  request.create(result)
end

# A better way: Use the 'playlist' source but wrap it in a switch 
# or use a dynamic request that we can reset.
# Since you want strict alphabetical order and 'reset to start' capability:

# 1. Define the playlists normally (as you had before)
prelude = playlist(id="prelude", mode="normal", music_root ^ "/prelude")
circle_procession = playlist(id="circle_procession", mode="normal", music_root ^ "/circle_procession")
planting = playlist(id="planting", mode="normal", music_root ^ "/planting")
grounding_procession = playlist(id="grounding_procession", mode="normal", music_root ^ "/grounding_procession")
rain_showers = playlist(id="rain_showers", mode="normal", music_root ^ "/rain_showers")
post = playlist(id="post", mode="normal", music_root ^ "/post")

# 2. Map them for easy access
playlists = [
  ("prelude", prelude),
  ("circle_procession", circle_procession),
  ("planting", planting),
  ("grounding_procession", grounding_procession),
  ("rain_showers", rain_showers),
  ("post", post)
]

# 3. Create the active source using 'switch'
# We use track_sensitive=false so the switch can happen mid-song if needed
radio = switch(track_sensitive=false, [
  ({!current_playlist == "prelude"}, prelude),
  ({!current_playlist == "circle_procession"}, circle_procession),
  ({!current_playlist == "planting"}, planting),
  ({!current_playlist == "grounding_procession"}, grounding_procession),
  ({!current_playlist == "rain_showers"}, rain_showers),
  ({!current_playlist == "post"}, post)
])

# The Fix for "Picking up where it left off":
def change_playlist(name)
  current_playlist := name
  
  # Find the playlist source in our list and force it to reload/skip
  # This resets the internal pointer of the specific playlist source
  server.execute(name ^ ".reload")
  server.execute(name ^ ".skip")
  
  "Playlist swapped to: " ^ name
end

server.register(namespace="playlist", "set", change_playlist)

radio = mksafe(crossfade(radio))

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  radio
)