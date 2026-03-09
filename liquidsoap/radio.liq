settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

music_root = "/home/magmek/stream/music"

# Helper function that creates a stream from a directory
def make_stream(name, path) =
  s =
    playlist(
      mode="random",
      reload_mode="watch",
      path
    )

  radio = mksafe(s)

  output.icecast(
    %mp3(bitrate=128, samplerate=44100, stereo=true),
    host="localhost",
    port=8005,
    password="sourcepassword",
    mount="/" ^ name,
    name="Aetherglow Radio - " ^ name,
    genre="Ambient",
    description="Aetherglow ambience stream",
    radio
  )
end

make_stream("adventure", music_root ^ "/adventure")
make_stream("ballads", music_root ^ "/ballads")
make_stream("battle", music_root ^ "/battle")
make_stream("celtic", music_root ^ "/celtic")
make_stream("village", music_root ^ "/village")