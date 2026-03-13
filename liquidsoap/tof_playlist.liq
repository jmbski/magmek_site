settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

server.telnet(port=1234)

music_root = "/home/magmek/stream/playlists"

#< prelude = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/prelude"))
circle_procession = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/circle_procession"))
planting = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/planting"))
grounding_procession = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/grounding_procession"))
rain_showers = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/rain_showers"))
post = mksafe(playlist(mode="normal", reload_mode="watch", music_root ^ "/post")) >#

# Create a control variable
#< current = ref("prelude") >#

queue = request.queue(id="main_queue")
radio = mksafe(crossfade(queue))

def load_playlist(dir_name)
  server.execute("request.queue.clear main_queue")
  dir_path = music_root ^ "/" ^ dir_name

  filepaths = file.ls(dir_path)
  list.iter(fun(f) -> queue.push(request, f), filepaths)
  "Playlist loaded: " ^ dir_name
end

#< def changeCur(name)
    current := name
    "Playlist changed to: " ^ name
end >#


server.register(
  namespace="playlist",
  description="Switch playlist",
  "set",
  load_playlist
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

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  radio
)