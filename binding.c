#include <stdio.h>
#include <stdlib.h>
#include <node_api.h>
#include <napi-macros.h>

#include "deps/transmission/libtransmission/transmission.h"
#include "deps/transmission/libtransmission/rpcimpl.h"
#include "deps/transmission/libtransmission/utils.h"
#include "deps/transmission/libtransmission/variant.h"

#define APP_NAME "transmission"

#define MEM_K 1024
#define MEM_K_STR "KiB"
#define MEM_M_STR "MiB"
#define MEM_G_STR "GiB"
#define MEM_T_STR "TiB"

#define DISK_K 1000
#define DISK_K_STR "kB"
#define DISK_M_STR "MB"
#define DISK_G_STR "GB"
#define DISK_T_STR "TB"

#define SPEED_K 1000
#define SPEED_K_STR "kB/s"
#define SPEED_M_STR "MB/s"
#define SPEED_G_STR "GB/s"
#define SPEED_T_STR "TB/s"

tr_session* session;
char const* configDir;

static void rpc_response_func(tr_session* session, tr_variant* response, void* setme) {
  *(tr_variant*)setme = *response;
  tr_variantInitBool(response, false);
}

NAPI_METHOD(sessionInit) {
  tr_variant settings;

  tr_formatter_mem_init(MEM_K, MEM_K_STR, MEM_M_STR, MEM_G_STR, MEM_T_STR);
  tr_formatter_size_init(DISK_K, DISK_K_STR, DISK_M_STR, DISK_G_STR, DISK_T_STR);
  tr_formatter_speed_init(SPEED_K, SPEED_K_STR, SPEED_M_STR, SPEED_G_STR, SPEED_T_STR);

  configDir = tr_getDefaultConfigDir(APP_NAME);

  tr_variantInitDict(&settings, 0);
  tr_sessionLoadSettings(&settings, configDir, APP_NAME);

  session = tr_sessionInit(configDir, true, &settings);

  tr_variantFree(&settings);

  return NULL;
}

NAPI_METHOD(sessionClose) {
  tr_variant settings;

  tr_variantInitDict(&settings, 0);
  tr_sessionSaveSettings(session, configDir, &settings);

  tr_sessionClose(session);

  tr_variantFree(&settings);

  return NULL;
}

NAPI_METHOD(request) {
  NAPI_ARGV(1)
  NAPI_ARGV_BUFFER(buf_json, 0)

  tr_variant request;
  tr_variant response;
  const char* response_str;

  tr_variantFromJson(&request, buf_json, buf_json_len);

  tr_rpc_request_exec_json(session, &request, rpc_response_func, &response);

  response_str = tr_variantToStr(&response, TR_VARIANT_FMT_JSON, NULL);

  tr_variantFree(&request);
  tr_variantFree(&response);

  NAPI_RETURN_STRING(response_str)
}

NAPI_INIT() {
  NAPI_EXPORT_FUNCTION(sessionInit)
  NAPI_EXPORT_FUNCTION(sessionClose)
  NAPI_EXPORT_FUNCTION(request)
}
