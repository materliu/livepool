{
	"targets" : [
		{
			"target_name" : "openproxy_setting",
			"sources" : [ "src/binding.cc" ],
			"link_settings" : {
				"libraries" : [
					"WinInet.lib"
				]
			}
			
		}
	]
}