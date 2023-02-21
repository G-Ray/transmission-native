{
  "targets": [{
    "target_name": "transmission_native",
    "include_dirs": [
      "<!(node -e \"require('napi-macros')\")",
    ],
    "libraries": [
      "<(module_root_dir)/deps/transmission/build/libtransmission/libtransmission.a",
      "<(module_root_dir)/deps/transmission/build/third-party/b64/lib/libb64.a",
      "<(module_root_dir)/deps/transmission/build/third-party/deflate/lib/libdeflate.a",
      "<(module_root_dir)/deps/transmission/build/third-party/dht/lib/libdht.a",
      "<(module_root_dir)/deps/transmission/build/third-party/event/lib/libevent.a",
      "<(module_root_dir)/deps/transmission/build/third-party/jsonsl/libjsonsl.a",
      "<(module_root_dir)/deps/transmission/build/third-party/miniupnpc/lib/libminiupnpc.a",
      "<(module_root_dir)/deps/transmission/build/third-party/natpmp/lib/libnatpmp.a",
      "<(module_root_dir)/deps/transmission/build/third-party/psl/lib/libpsl.a",
      "<(module_root_dir)/deps/transmission/build/third-party/utp/lib/libutp.a",
      "<(module_root_dir)/deps/transmission/build/third-party/wildmat/libwildmat.a",
      "<(module_root_dir)/deps/curl/build/lib/libcurl.a"
    ],
    "sources": [
      "binding.cc"
    ],
  }]
}
