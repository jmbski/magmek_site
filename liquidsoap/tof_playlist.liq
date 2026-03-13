settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true
server.telnet(port=1234)
music_root = "/home/magmek/stream/playlists"


prelude = playlist(reload_mode="watch", music_root ^ "/prelude")
circle_procession = playlist(reload_mode="watch", music_root ^ "/circle_procession")
planting = playlist(reload_mode="watch", music_root ^ "/planting")
grounding_procession = playlist(reload_mode="watch", music_root ^ "/grounding_procession")
rain_showers = playlist(reload_mode="watch", music_root ^ "/rain_showers")
post = playlist(reload_mode="watch", music_root ^ "/post")

current = ref(prelude)

radio = switch([
  mksafe({true}, !current)
])

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  radio
)
