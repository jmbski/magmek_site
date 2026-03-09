settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

music_root = "/home/magmek/stream/music"

# Get everything in the music directory
entries = file.list(music_root)

# Keep only directories
dirs =
  list.filter(
    fun(x) -> file.is_directory(music_root ^ "/" ^ x),
    entries
  )

def make_stream(name) =
  path = music_root ^ "/" ^ name

  log("Creating stream: " ^ name)

  src =
    playlist(
      mode="random",
      reload_mode="watch",
      path
    )

  radio = mksafe(src)

  output.icecast(
    %mp3(bitrate=128, samplerate=44100, stereo=true),
    host="localhost",
    port=8005,
    password="sourcepassword",
    mount="/" ^ name,
    name="Aetherglow - " ^ name,
    genre="Ambient",
    description="Aetherglow ambience",
    radio
  )
end

list.iter(fun(d) -> make_stream(d), dirs)