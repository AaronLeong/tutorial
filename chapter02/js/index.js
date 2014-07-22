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

	device : null,
	
	service : null,
	
	characteristic1 : null,
	
	characteristic2 : null,

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
		app.device = new BC.Device({deviceAddress:"78:C5:E5:99:26:54",type:"BLE"});
		app.device.addEventListener("deviceconnected",function(device){
            alert("device:" + device.deviceAddress + "is connected successfully!");
		});
		app.device.addEventListener("devicedisconnected",function(device){
            alert("device:" + device.deviceAddress + "is connected successfully!")
		});
	},
	
	connect : function(){
		var device = app.device;
		device.connect(function(){
			device.discoverServices(function(){
				app.service = device.getServiceByUUID("fff0")[0];
				app.service.discoverCharacteristics(function(){
					app.characteristic1 = app.service.getCharacteristicByUUID("fff1")[0];
					app.characteristic2 = app.service.getCharacteristicByUUID("fff4")[0];
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
	
	write : function(){
		app.characteristic1.write("Hex","01",function(data){
			alert(JSON.stringify(data));
		},function(){
			alert("write error!");
		});
	},
	
	read : function(){
		app.characteristic1.read(function(data){
			alert(JSON.stringify(data));
		},function(){
			alert("read error!");
		});
	},
	
	subscribe : function(){
		app.characteristic2.subscribe(function(data){
			alert(JSON.stringify(data));
		});
	},
	
	unsubscribe : function(){
		app.characteristic2.unsubscribe(function(){
			alert("unsubscribe success");
		},function(){
			alert("unsubscribe error!");
		});
	},
};
















