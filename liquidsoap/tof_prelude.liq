set("log.file", true)
set("log.file.path", "/home/magmek/stream/logs/liquidsoap.log")
set("log.stdout", true)

music = playlist("/home/magmek/stream/playlists/prelude")

radio = mksafe(music)

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/tof",
  name="Old Forest Ceremony",
  description="PRELUDE (TO START IN ADVANCE AND PLAY AS PEOPLE ARRIVE)",
  genre="Ambient",
  radio
)