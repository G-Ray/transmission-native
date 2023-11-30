#!/usr/bin/env node
const os = require('node:os')
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')

const NPROCESSORS = os.availableParallelism()
const COMMON_CMAKE_FLAGS = [
  '-DCMAKE_BUILD_TYPE=Release',
  '-DENABLE_DAEMON=OFF',
  '-DENABLE_GTK=OFF',
  '-DENABLE_QT=OFF',
  '-DENABLE_UTILS=OFF',
  '-DENABLE_CLI=OFF',
  '-DENABLE_TESTS=OFF',
  '-DENABLE_UTP=ON',
  '-DENABLE_NLS=OFF',
  '-DINSTALL_DOC=OFF',
  '-DINSTALL_LIB=OFF',
  '-DUSE_SYSTEM_EVENT2=OFF',
  '-DUSE_SYSTEM_DEFLATE=OFF',
  '-DUSE_SYSTEM_DHT=OFF',
  '-DUSE_SYSTEM_MINIUPNPC=OFF',
  '-DUSE_SYSTEM_NATPMP=OFF',
  '-DUSE_SYSTEM_UTP=OFF',
  '-DUSE_SYSTEM_B64=OFF',
  '-DUSE_SYSTEM_PSL=OFF',
  '-DWITH_CRYPTO=openssl'
]

const { env } = process
const transmissionPath = path.join(__dirname, '../deps/transmission')
const buildPath = path.join(transmissionPath, 'build')

const runCommand = async (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.on('close', resolve)
    child.on('error', reject)
  })
}

// Clone transmission repo
const clone = async () => {
  if (fs.existsSync(transmissionPath)) return

  await runCommand('git', [
    'clone',
    '-b',
    '4.0.4',
    '--recurse-submodules',
    'https://github.com/transmission/transmission.git',
    transmissionPath
  ])
}

const cmake = (...args) => runCommand('cmake', ...args)

const build = async () => {
  const osType = os.type()

  await clone()

  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath)
  }

  if (osType === 'Linux') {
    const flags = [
      ...COMMON_CMAKE_FLAGS,
      '-DCMAKE_C_FLAGS=-fPIC',
      '-DCMAKE_CXX_FLAGS=-fPIC'
    ]

    await cmake([...flags, '..'], { cwd: buildPath, env })
    await cmake(['--build', buildPath, `-j${NPROCESSORS}`], { env })
  } else if (osType === 'Windows_NT') {
    const { VCPKG_INSTALLATION_ROOT } = process.env
    if (!VCPKG_INSTALLATION_ROOT) {
      throw new Error('Please set VCPKG_INSTALLATION_ROOT env var')
    }

    const flags = [
      ...COMMON_CMAKE_FLAGS,
      // Set vcpkg toolchain file path
      `-DCMAKE_TOOLCHAIN_FILE=${VCPKG_INSTALLATION_ROOT}/scripts/buildsystems/vcpkg.cmake`,
      // Set include and lib dir paths to static libcurl
      `-DCURL_INCLUDE_DIR=${VCPKG_INSTALLATION_ROOT}/packages/curl_x64-windows-static/include`,
      `-DCURL_LIBRARY=${VCPKG_INSTALLATION_ROOT}/packages/curl_x64-windows-static/lib/libcurl.lib`,
      `-DOPENSSL_ROOT_DIR=${VCPKG_INSTALLATION_ROOT}/packages/openssl_x64-windows-static`,
      // Use static version of the run-time library
      '-DCMAKE_C_FLAGS=/MT /MP',
      '-DCMAKE_CXX_FLAGS=/MT /MP',
      '-DCMAKE_C_FLAGS_RELEASE=/MT /MP',
      '-DCMAKE_CXX_FLAGS_RELEASE=/MT /MP'
    ]

    await cmake([...flags, '..'], { cwd: buildPath, env })
    await cmake(['--build', buildPath, '--config', 'Release', `-j${NPROCESSORS}`], { env })
  } else {
    console.log('Unsupported os type:', osType)
  }
}

build()
