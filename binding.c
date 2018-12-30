#include <stdio.h>
#include <stdlib.h>
#include <node_api.h>
#include <napi-macros.h>
#include <uv.h>

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

typedef struct {
  uv_mutex_t _mutex;
  uv_cond_t _cond;
  int32_t _finished;
  napi_ref _callback;
  napi_async_work _request;
  tr_variant request;
  tr_variant response;
  const char* response_str;
} tr_napi_t;

tr_session* session;
char const* configDir;

void rpc_response_func(tr_session* session, tr_variant* response, void* data) {
  tr_napi_t* self = (tr_napi_t*)(data);

  self->response = *response;
  tr_variantInitBool(response, false);
  tr_variantFree(response);

  uv_mutex_lock(&(self->_mutex));
  uv_cond_signal(&(self->_cond));
  uv_mutex_unlock(&(self->_mutex));
  self->_finished = 1;
}

void Complete(napi_env env, napi_status status, void* data) {
  tr_napi_t* self = (tr_napi_t*)(data);

  if (status != napi_ok) {
    napi_throw_type_error(env, NULL, "Execute callback failed.");
    return;
  }

  napi_value argv[2];
  napi_get_null(env, &argv[0]);
  napi_create_string_utf8(env, self->response_str, NAPI_AUTO_LENGTH, &argv[1]);
  napi_value callback;
  napi_get_reference_value(env, self->_callback, &callback);
  napi_value global;
  napi_get_global(env, &global);
  napi_value result;

  napi_call_function(env, global, callback, 2, argv, &result);

  tr_variantFree(&(self->request));
  tr_variantFree(&(self->response));

  uv_mutex_destroy(&(self->_mutex));
  uv_cond_destroy(&(self->_cond));

  napi_delete_reference(env, self->_callback);
  napi_delete_async_work(env, self->_request);
}

void Execute(napi_env env, void* data) {
  tr_napi_t* self = (tr_napi_t*)(data);

  uv_cond_init(&self->_cond);
  uv_mutex_init(&self->_mutex);

  self->_finished = 0;

  tr_rpc_request_exec_json(session, &(self->request), rpc_response_func, self);

  uv_mutex_lock(&(self->_mutex));
  while(self->_finished == 0) {
    uv_cond_wait(&(self->_cond), &(self->_mutex));
  }
  uv_mutex_unlock(&(self->_mutex));

  self->response_str = tr_variantToStr(&(self->response), TR_VARIANT_FMT_JSON, NULL);
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
  NAPI_ARGV(3)
  NAPI_ARGV_BUFFER_CAST(tr_napi_t*, self, 0)
  NAPI_ARGV_BUFFER(buf_json, 1)
  napi_create_reference(env, argv[2], 1, &(self->_callback));

  napi_value resource_name;

  tr_variantFromJson(&(self->request), buf_json, buf_json_len);
  napi_create_string_utf8(env, "TrRequestResource", NAPI_AUTO_LENGTH, &resource_name);

  napi_create_async_work(env, NULL, resource_name, Execute, Complete, self, &(self->_request));
  napi_queue_async_work(env, self->_request);

  return NULL;
}

NAPI_INIT() {
  NAPI_EXPORT_SIZEOF(tr_napi_t)
  NAPI_EXPORT_FUNCTION(sessionInit)
  NAPI_EXPORT_FUNCTION(sessionClose)
  NAPI_EXPORT_FUNCTION(request)
}
