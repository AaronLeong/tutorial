/*
	Copyright 2013-2014, JUMA Technology

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var interval_scan_index = "";
var scan_timestamp = 0;
//var ProximityUUID = "e2c56db5-dffb-48d2-b060-d0f5a71096e0";

var app = {

    // Application Constructor
    initialize: function() {
	
		document.addEventListener('deviceready',function(){
			var BC = window.BC = cordova.require("org.bcsphere.bcjs");
			var BC = window.BC = cordova.require("org.bluetooth.profile.find_me");
			app.findmeProfile = new BC.FindMeProfile();
			navigator.notification = cordova.require('org.apache.cordova.dialogs.notification');
		},false);
		
        document.addEventListener('bcready', function(){
			app.device = new BC.Device({deviceAddress:DEVICEADDRESS,type:DEVICETYPE});
			app.device.connect(function(){
				app.device.discoverServices(function(){
					var service = app.device.getServiceByUUID('ffe0')[0];
					service.discoverCharacteristics(function(){
						var character = service.getCharacteristicByUUID('f000ffe1-0451-4000-b000-000000000000')[0];
						character.subscribe(function(){
							navigator.notification.beep();
						});
					},function(){
						alert("discover characteristics error!");
					});
				},function(){
					alert("discover services error!");
				});
			});
			
		}, false);
		
    },
	
	findme : function(){
		app.findmeProfile.high_alert(app.device);
	},
	
	foundme : function(){
		app.findmeProfile.no_alert(app.device);
	},
	
	stopBeep : function(){
		navigator.notification.stopBeep();
	},
	
};
