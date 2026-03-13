settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

server.telnet(port=1234)

music_root = "/home/magmek/stream/playlists"
current_playlist = ref("prelude")

#prelude = mksafe(playlist(id="prelude", reload_mode="watch", music_root ^ "/prelude"))
#circle_procession = mksafe(playlist(id="circle_procession", reload_mode="watch", music_root ^ "/circle_procession"))
#planting = mksafe(playlist(id="planting", reload_mode="watch", music_root ^ "/planting"))
#grounding_procession = mksafe(playlist(id="grounding_procession", reload_mode="watch", music_root ^ "/grounding_procession"))
#rain_showers = mksafe(playlist(id="rain_showers", reload_mode="watch", music_root ^ "/rain_showers"))
#post = mksafe(playlist(id="post", reload_mode="watch", music_root ^ "/post"))

# A function to generate the URI for the playlist
# This ensures we are always looking at the right folder
def get_playlist_path()
  music_root ^ "/" ^ !current_playlist
end

# Create a control variable
current = ref("prelude")

# Create a single playlist source that updates its content
# mode="normal" ensures alphabetical order
# check_next is a hook we can use to force resets
vocal_playlist = playlist(
  id="dynamic_list",
  mode="normal", 
  reload_mode="watch",
  get_playlist_path
)
#< def changeCur(name)
    current := name
    server.execute("playlist.reload " ^ name)
    "Playlist changed to: " ^ name
end >#
# The switch function via Telnet
def change_playlist(name)
  current_playlist := name
  # 1. Reload the playlist to pick up the new directory's files
  server.execute("dynamic_list.reload")
  # 2. Skip the current track so the new playlist starts immediately 
  # from the first file in the new folder
  source.skip(vocal_playlist)
  "Playlist swapped to: " ^ name
end

#< server.register(
  namespace="playlist",
  description="Switch playlist",
  "set",
  changeCur
) >#

server.register(
  namespace="playlist",
  description="Switch playlist and reset to start",
  "set",
  change_playlist
)

# Switch logic
#< radio = mksafe(
  switch(track_sensitive=false, [
    ({current() == "prelude"}, prelude),
    ({current() == "circle_procession"}, circle_procession),
    ({current() == "planting"}, planting),
    ({current() == "grounding_procession"}, grounding_procession),
    ({current() == "rain_showers"}, rain_showers),
    ({current() == "post"}, post),
    ({true}, prelude)
  ])
)
radio = mksafe(crossfade(radio)) >#

# Since we are using one dynamic playlist source, 
# we don't need the complex switch() operator anymore.
radio = mksafe(vocal_playlist)
radio = crossfade(radio)

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  radio
)