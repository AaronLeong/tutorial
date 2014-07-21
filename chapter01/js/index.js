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

var app = {

	device :{},

    // Application Constructor
    initialize: function() {
        app.bindCordovaEvents();
    },
    
    bindCordovaEvents: function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("org.bcsphere.bcjs");
	},
	
	onBCReady : function(){
		var device = new BC.Device({deviceAddress:"20:CD:39:AD:65:20",type:"BLE"});
		device.addEventListener("deviceconnected",function(device){
            alert("device:" + s.deviceAddress + "is connected successfully!");
		});
		device.addEventListener("devicedisconnected",function(device){
            alert("device:" + device.deviceAddress + "is connected successfully!")
		});
	},
	
	write : function(){
		var device = app.device;
		device.connect(function(){
			device.discoverServices(function(){
				var service = device.getServiceByUUID("1802")[0];
				service.discoverCharacteristics(function(){
					var character = service.getCharacteristicByUUID("2a26")[0];
					character.write("Hex","01",function(data){
						alert(JSON.stringify(data));
					},function(){
						alert("write error!");
					});
				},function(){
					alert("discoverCharacteristics error!");
				});
			},function(){
				alert("discoverServices error!");
			});
		},function(){
			alert("connnect error!");
		});
	},
};
