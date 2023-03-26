{
  "targets": [{
    "target_name": "transmission_native",
    "cflags_cc": ["-std=c++17"],
    "include_dirs": [
      "<!(node -e \"require('napi-macros')\")",
    ],
    "libraries": [
      "<(module_root_dir)/deps/transmission/build/libtransmission/libtransmission.a",
      "<(module_root_dir)/deps/transmission/build/third-party/dht.bld/pfx/lib/libdht.a",
      "<(module_root_dir)/deps/transmission/build/third-party/jsonsl/libjsonsl.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libb64.bld/src/libb64.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libdeflate.bld/pfx/lib/libdeflate.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libevent.bld/pfx/lib/libevent.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libnatpmp.bld/pfx/lib/libnatpmp.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libpsl.bld/pfx/lib/libpsl.a",
      "<(module_root_dir)/deps/transmission/build/third-party/libutp.bld/libutp.a",
      "<(module_root_dir)/deps/transmission/build/third-party/miniupnpc.bld/pfx/lib/libminiupnpc.a",
      "<(module_root_dir)/deps/transmission/build/third-party/wildmat/libwildmat.a",
      "-lcurl"
    ],
    "sources": [
      "binding.cc"
    ],
  }]
}
