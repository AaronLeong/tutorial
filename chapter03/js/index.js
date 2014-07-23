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
				$("#user_view").html("");
				BC.Bluetooth.StartScan("LE");
				scan_timestamp = new Date().getTime();
				interval_scan_index = window.setInterval(app.displayScanResult, 1000);
			}else if(state == 0){
				BC.Bluetooth.StopScan();
				if(interval_scan_index){
					window.clearInterval(interval_scan_index);
				}
			}
		});
    },
	
	displayScanResult: function(){
		_.each(BC.bluetooth.devices,function(device){
			if(scan_timestamp < device.advTimestamp && app.notOnUI(device)){
				var viewObj	= $("#user_view");
				var liTplObj=$("#li_tpl").clone();
				$("a",liTplObj).attr("onclick","app.device_page('"+device.deviceAddress+"')");
				liTplObj.show();
				for(var key in device){
					if(key == "isConnected"){
						if(device.isConnected){
							$("[dbField='"+key+"']",liTplObj).html("YES");
						}
						$("[dbField='"+key+"']",liTplObj).html("NO");
					}else{
						$("[dbField='"+key+"']",liTplObj).html(device[key]);
					}
				}	
				viewObj.append(liTplObj);
				viewObj.listview("refresh");
			}
		});
	},
	
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("org.bcsphere.bcjs");
		var _ = window._ = cordova.require("org.underscorejs.underscore");
	},
	
	onBCReady: function() {
		BC.bluetooth.addEventListener("newdevice",function(event){
			var newDevice = event.target;
			newDevice.addEventListener("deviceconnected",function(arg){
				var deviceAddress = arg.deviceAddress;
				alert(arg.deviceAddress +" is connected!");				
			});
			newDevice.addEventListener("devicedisconnected",function(arg){
				alert("device:"+arg.deviceAddress+" is disconnected!");
				$.mobile.changePage("index.html","slideup");				
			});			
		});
    },
    
    device_page: function(deviceAddress){
    	app.device = BC.bluetooth.devices[deviceAddress];
		BC.Bluetooth.StopScan();
		var scanOnOff = $("#scanOnOff");
		scanOnOff[0].selectedIndex = 0;
		scanOnOff.slider("refresh");
    	$.mobile.changePage("device_detail.html","slideup");
    },
	
	notOnUI: function(device){
		var length = $("#user_view li").length;
		for(var i = 0; i < length; i++){
			var liTplObj = $("#user_view li")[i];
			var deviceAddr = $("[dbField='deviceAddress']",liTplObj).html();
			if(deviceAddr == device.deviceAddress){
				return false;
			}
		}
		return true;
	},
	
	onCharacteristicRead : function(arg){
		alert(JSON.stringify(arg));
	},
	
	seeAdvData: function(){
		var device = BC.bluetooth.devices[app.device.deviceAddress];
		alert(JSON.stringify(device.advertisementData));
		if(device.advertisementData.manufacturerData){
			alert("ManufacturerData(Hex):"+app.device.advertisementData.manufacturerData.getHexString()+"\n"+
			  "ManufacturerData(ASCII):"+app.device.advertisementData.manufacturerData.getASCIIString()+"\n"+
			  "ManufacturerData(Unicode):"+app.device.advertisementData.manufacturerData.getUnicodeString());
		}
	},
	
	deviceViewInit: function(){
		$("#deviceName").html(app.device.deviceName);
		$("#deviceAddress").html(app.device.deviceAddress);
		var isconnect = app.device.isConnected;

		if(!isconnect){
			$("#connect").show();
		}else{
			$("#device_operation").show();
			$("#disconnect").show();
		}
			
		$("#connect").click(app.connectDevice);
		$("#disconnect").click(app.disconnectDevice);
	},
	
	connectDevice: function(){
		app.showLoader("Connecting and discovering services...");
		app.device.connect(function(){
			$("#device_operation").show();
			$("#disconnect").show();
			$("#connect").hide();
			app.hideLoader();			
		},function(){
			alert("connect the device error!");
			app.hideLoader();			
		});
		app.device.addEventListener("deviceconnected",function(device){
			alert("device connected:" + device.deviceAddress);
		});
		app.device.addEventListener("devicedisconnected",function(device){
			alert("device disconnected:" + device.deviceAddress);
		});
	},
	
	disconnectDevice: function(){
		app.device.disconnect(function(){
			$("#connect").show();
			$("#disconnect").hide();
			$("#device_operation").hide();
			$("#service_view").empty();
		});
	},
	
	showLoader : function(message) {
		$.mobile.loading('show', {
			text: message, 
			textVisible: true, 
			theme: 'a',        
			textonly: true,   
			html: ""           
		});
	},

	hideLoader : function(){
		$.mobile.loading('hide');
	},

	getRSSI : function(){
		app.device.getRSSI(function(data){
			alert(JSON.stringify(data));
		});
	},
	
	getDeviceInfo : function(){
		app.device.discoverServices(function(){
			app.device.getDeviceInfo(function(){
				alert("System ID:"+app.device.systemID.getHexString()+"\n"+
					  "Model Number:"+app.device.modelNum.getASCIIString()+"\n"+
					  "Serial Number:"+app.device.serialNum.getASCIIString()+"\n"+
					  "Firmware Revision:"+app.device.firmwareRevision.getASCIIString()+"\n"+
					  "Hardware Revision:"+app.device.hardwareRevision.getASCIIString()+"\n"+
					  "Software Revision:"+app.device.softwareRevision.getASCIIString()+"\n"+
					  "Manufacturer Name:"+app.device.manufacturerName.getASCIIString());				
			},function(){
				alert("get device ID (profile) error!");
			});
		},function(){
			alert("discover service error!");
		});
	},

};
