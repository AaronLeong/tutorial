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
        app.bindCordovaEvents();
        app.bindUIEvents();
    },
    
    bindCordovaEvents: function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	bindUIEvents: function(){
    	$('#scanOnOff').change(function(){
			var state = $("#scanOnOff").val();
			if(state == 1){
				BC.Bluetooth.StartIBeaconScan();
			}else if(state == 0){
				BC.Bluetooth.StopIBeaconScan();
			}
		});
    },
	
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("org.bcsphere.bcjs");
		var BC = window.BC = cordova.require("org.bcsphere.ibeacon");
	},
	
	onBCReady: function() {
		BC.iBeaconManager.addEventListener("newibeacon",app.onNewIBeacon);
    },
	
	onNewIBeacon : function(s){
		var newibeacon = s.target;
		newibeacon.addEventListener("ibeaconproximityupdate",function(){
			alert(newibeacon.proximity);
		});
		newibeacon.addEventListener("ibeaconaccuracyupdate",function(){
			//alert(newibeacon.accuracy);
		});
	},
};
