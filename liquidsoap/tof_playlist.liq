settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

music_root = "/home/magmek/stream/playlists"

# Helper function that creates a stream from a directory
def make_stream(name, path) =
  s =
    playlist(
      reload_mode="watch",
      path
    )

  radio = mksafe(s)

  output.icecast(
    %mp3(bitrate=128, samplerate=44100, stereo=true),
    host="localhost",
    port=8005,
    password="MagMekMedia42$@",
    mount="/" ^ name,
    name="Aetherglow Radio - " ^ name,
    genre="Ambient",
    description="Aetherglow ambience stream",
    radio
  )
end

make_stream("circle_procession", music_root ^ "/circle_procession")
make_stream("grounding_procession", music_root ^ "/grounding_procession")
make_stream("planting", music_root ^ "/planting")
make_stream("celtic", music_root ^ "/celtic")
make_stream("village", music_root ^ "/village")
make_stream("all", music_root ^ "/all_mix")