mkdir deps/transmission/build
cd deps/transmission/build

export CFLAGS="$CFLAGS -fPIC"
export CXXFLAGS="$CXXFLAGS -fPIC"

cmake \
  -DENABLE_DAEMON=OFF \
  -DENABLE_GTK=OFF \
  -DENABLE_QT=OFF \
  -DENABLE_UTILS=OFF \
  -DENABLE_CLI=OFF \
  -DENABLE_TESTS=OFF \
  -DENABLE_LIGHTWEIGHT=OFF \
  -DENABLE_UTP=ON \
  -DENABLE_NLS=OFF \
  -DINSTALL_DOC=OFF \
  -DINSTALL_LIB=OFF \
  -DUSE_QT5=OFF \
  -DUSE_SYSTEM_EVENT2=OFF \
  -DUSE_SYSTEM_DHT=OFF \
  -DUSE_SYSTEM_MINIUPNPC=OFF \
  -DUSE_SYSTEM_NATPMP=OFF \
  -DUSE_SYSTEM_UTP=OFF \
  -DUSE_SYSTEM_B64=OFF \
  -DWITH_CRYPTO=openssl \
  -DWITH_INOTIFY=ON \
  -DWITH_KQUEUE=OFF \
  -DWITH_SYSTEMD=OFF \
  ..

make
cd ../../..
