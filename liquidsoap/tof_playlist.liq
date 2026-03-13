settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

server.telnet(port=1234)

music_root = "/home/magmek/stream/playlists"

prelude = mksafe(playlist(reload_mode="watch", music_root ^ "/prelude"))
circle_procession = mksafe(playlist(reload_mode="watch", music_root ^ "/circle_procession"))
planting = mksafe(playlist(reload_mode="watch", music_root ^ "/planting"))
grounding_procession = mksafe(playlist(reload_mode="watch", music_root ^ "/grounding_procession"))
rain_showers = mksafe(playlist(reload_mode="watch", music_root ^ "/rain_showers"))
post = mksafe(playlist(reload_mode="watch", music_root ^ "/post"))

# Create a control variable
current = ref("prelude")

server.register(
  namespace="playlist",
  description="Switch playlist",
  "set",
  fun(name) ->
    current := "" ^ name
)
# Switch logic
radio = mksafe(
  switch([
    ({current() == "prelude"}, prelude),
    ({current() == "circle_procession"}, circle_procession),
    ({current() == "planting"}, planting),
    ({current() == "grounding_procession"}, grounding_procession),
    ({current() == "rain_showers"}, rain_showers),
    ({current() == "post"}, post),
    ({true}, prelude)
  ])
)
radio = crossfade(radio)

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  radio
)