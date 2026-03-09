settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

music_root = "/home/magmek/stream/music"

# Retrieve directories inside music_root
dirs = list.dir(music_root)

def make_stream(name) =
  path = music_root ^ "/" ^ name

  source =
    playlist(
      mode="random",
      reload_mode="watch",
      path
    )

  radio = mksafe(source)

  log("Creating stream: " ^ name)

  output.icecast(
    %mp3(bitrate=128, samplerate=44100, stereo=true),
    host="localhost",
    port=8005,
    password="MagMekMedia42$@",
    mount="/" ^ name,
    name="Aetherglow Radio - " ^ name,
    description="Aetherglow ambience stream",
    genre="Ambient",
    radio
  )
end

# Iterate directories and create streams
list.iter(fun(d) -> make_stream(d), dirs)