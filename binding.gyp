{
  "targets": [{
    "target_name": "transmission_native",
    "cflags_cc": ["-std=c++17"],
    "include_dirs": [
      "<!(node -e \"require('napi-macros')\")",
    ],
    "conditions": [
      ['OS=="linux"', {
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
      }],
      ['OS=="win"', {
        "libraries": [
          "<(module_root_dir)/deps/transmission/build/libtransmission/Release/transmission.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/dht.bld/pfx/lib/dht.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/jsonsl/Release/jsonsl.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libb64.bld/src/Release/b64.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libdeflate.bld/pfx/lib/deflatestatic.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libevent.bld/pfx/lib/event.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libnatpmp.bld/pfx/lib/natpmp.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libpsl.bld/pfx/lib/psl.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/libutp.bld/Release/utp.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/miniupnpc.bld/pfx/lib/miniupnpc.lib",
          "<(module_root_dir)/deps/transmission/build/third-party/wildmat/Release/wildmat.lib",
          "$(VCPKG_INSTALLATION_ROOT)/installed/x64-windows-static/lib/libcurl.lib",
          "$(VCPKG_INSTALLATION_ROOT)/installed/x64-windows-static/lib/zlib.lib",
          "$(VCPKG_INSTALLATION_ROOT)/installed/x64-windows-static/lib/libcrypto.lib",
          "$(VCPKG_INSTALLATION_ROOT)/installed/x64-windows-static/lib/libssl.lib",
          "ws2_32.lib",
          "Crypt32.lib",
          "Iphlpapi.lib",
        ]
      }],
    ],
    "sources": [
      "binding.cc"
    ],
  }]
}
