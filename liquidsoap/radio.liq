settings.log.file := true
settings.log.file.path := "/home/magmek/stream/logs/liquidsoap.log"
settings.log.stdout := true

music_root = "/home/magmek/stream/music"


adventure = mksafe(playlist(id="adventure", mode="random", reload_mode="watch", music_root ^ "/adventure"))
ballads = mksafe(playlist(id="ballads", mode="random", reload_mode="watch", music_root ^ "/ballads"))
battle = mksafe(playlist(id="battle", mode="random", reload_mode="watch", music_root ^ "/battle"))
celtic = mksafe(playlist(id="celtic", mode="random", reload_mode="watch", music_root ^ "/celtic"))
village = mksafe(playlist(id="village", mode="random", reload_mode="watch", music_root ^ "/village"))
all_mix = mksafe(playlist(id="all_mix", mode="random", reload_mode="watch", music_root ^ "/all_mix"))


# Create a control variable
current = ref("adventure")

def changeCur(name)
    ignore(server.execute(name ^ ".reload"));
    current := name
    "Playlist changed to: " ^ name
end

server.register(
  namespace="playlist",
  description="Switch playlist",
  "set",
  changeCur
)

# Switch logic
radio = mksafe(
  switch(track_sensitive=false, [
    ({current() == "adventure"}, adventure),
    ({current() == "ballads"}, ballads),
    ({current() == "battle"}, battle),
    ({current() == "celtic"}, celtic),
    ({current() == "village"}, village),
    ({current() == "all_mix"}, all_mix),
    ({true}, adventure)
  ])
)
radio = mksafe(crossfade(radio))

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8005,
  password="MagMekMedia42$@",
  mount="/ag-radio",
  radio
)
# Helper function that creates a stream from a directory
#< def make_stream(name, path) =
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
    password="MagMekMedia42$@",
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
make_stream("all", music_root ^ "/all_mix") >#