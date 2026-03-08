set("log.file", true)
set("log.file.path", "/var/www/stream/logs/liquidsoap.log")
set("log.stdout", true)

music = playlist(mode="random", "/var/www/stream/music/celtic_grooves")

radio = mksafe(music)

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8000,
  password="MagMekMedia42$@",
  mount="/stream",
  name="Aetherglow Radio",
  description="Ambient Celtic Fantasy Music",
  genre="Ambient",
  radio
)