{
  "targets": [{
    "target_name": "transmission_native",
    "include_dirs": [
      "<!(node -e \"require('napi-macros')\")"
    ],
    "libraries": [
      "<(module_root_dir)/deps/build/libtransmission/libtransmission.a",
      "<(module_root_dir)/deps/build/libtransmission/libtransmission-test.a",
      "<(module_root_dir)/deps/build/third-party/b64-c1e3323498/lib/libb64.a",
      "<(module_root_dir)/deps/build/third-party/dht-cc379e406d/lib/libdht.a",
      "<(module_root_dir)/deps/build/third-party/miniupnpc-5de2bcb561/lib/libminiupnpc.a",
      "<(module_root_dir)/deps/build/third-party/natpmp-cf7f452d66/lib/libnatpmp.a",
      "<(module_root_dir)/deps/build/third-party/utp-7c4f19abdf/lib/libutp.a"
    ],
    "link_settings": {
      "libraries": [
        "-levent"
      ]
    },
    "sources": [
      "binding.c"
    ],
  }]
}
