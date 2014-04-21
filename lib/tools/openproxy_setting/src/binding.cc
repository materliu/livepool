#include <node.h>
#include <v8.h>
#include <WinInet.h>

#pragma comment (lib, "WinInet.lib")

using namespace v8;

extern "C" {

Handle<Value> RefreshProxy(const Arguments& args) {
	HandleScope scope;

	BOOL settingsReturn = InternetSetOption(NULL, INTERNET_OPTION_SETTINGS_CHANGED, NULL, 0);
	BOOL refreshReturn = InternetSetOption(NULL, INTERNET_OPTION_REFRESH, NULL, 0);

	return scope.Close(String::New("world"));
}



void init(Handle<Object> target) {
		NODE_SET_METHOD(target, "RefreshProxy", RefreshProxy);
}

NODE_MODULE(openproxy_setting, init)

}
