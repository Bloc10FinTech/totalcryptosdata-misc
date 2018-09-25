//io.sails.url = 'https://cron.totalcryptos.com';
//io.sails.url = 'https://13.58.6.200:9001';
io.sails.url = 'http://localhost:1338';
//var currencies=['btc','usd','eth','bch','gbp','ltc','eur','etc','bch'];
var roomName='sdmhx4qy2';
var dashboard_table_init=false;
var is_page_load=true;
var i=0,j=0;
$(document).ready(function(){
	//socket_request();
	//setInterval(socket_request, 300000);

	io.socket.on( 'connect', function () {
		io.socket.post('/predatortrade/subscribe_room',{roomName:roomName},function (resData) {
			//console.log(resData);
		}); 
	}); 
	
	io.socket.on('predator_alert', function (object){
	  if($("#sound")){
		 playSound('bell'); 
	  }
	  
	  if(is_page_load){
		  /*if($("#dashboard_div")){
			var exchanges=object.exchange_list.map(function(exchange){return exchange.name;}); 
			var last_exchange=exchanges[exchanges.length-1];
			exchanges=exchanges.slice(0,exchanges.length-1);
			$("#exchanges").html('<h3>Showing data from <span style="text-transform:capitalize;">'+exchanges.join(', ')+'</span> and <span style="text-transform:capitalize;">'+last_exchange+'</span> exchanges</h3>');
		  }*/
	  }
	  else{
		  /*if($("#alerts_div")){
			 $("#alerts_div").fadeOut(2000);
			 $("#alerts_div").html(''); 
		  }
		  if($("#trade_div")){
			  $("#trade_div").fadeOut(2000);
			  $("#trade").html('');
		  }
		  if($("#dashboard_div")){
			  $("#dashboard_div").fadeOut(2000);
			  $("#dashboard_table_body").html('');
		  }*/
	  }
	  is_page_load=false;
	  console.log(object);
	  object.data.forEach(function(currency,index){
		var product=currency.product.split("_");
		
		if($("#alerts_div") || $("#trade_div")){
			var date_buy = new Date(currency.buy_from.date_created);
			var date_sell = new Date(currency.sell_at.date_created);
			
			var buy_time=(date_buy.getHours()<10?('0'+date_buy.getHours()):date_buy.getHours())+':'+(date_buy.getMinutes()<10?('0'+date_buy.getMinutes()):date_buy.getMinutes())+':'+(date_buy.getSeconds()<10?('0'+date_buy.getSeconds()):date_buy.getSeconds())+(date_buy.getHours()<12?' AM':' PM');
			
			var buy_date=(date_buy.getMonth()<9?('0'+(1+date_buy.getMonth())):(1+date_buy.getMonth()))+'/'+(date_buy.getDate()<10?('0'+date_buy.getDate()):date_buy.getDate())+'/'+date_buy.getFullYear();
			
			var sell_time=(date_sell.getHours()<10?('0'+date_sell.getHours()):date_sell.getHours())+':'+(date_sell.getMinutes()<10?('0'+date_sell.getMinutes()):date_sell.getMinutes())+':'+(date_sell.getSeconds()<10?('0'+date_sell.getSeconds()):date_sell.getSeconds())+(date_sell.getHours()<12?' AM':' PM');
			
			var sell_date=(date_sell.getMonth()<9?('0'+(1+date_sell.getMonth())):(1+date_sell.getMonth()))+'/'+(date_sell.getDate()<10?('0'+date_sell.getDate()):date_sell.getDate())+'/'+date_sell.getFullYear();
		}
		
		//PROCESS TO SHOW ALERTS
		if($("#alerts_div")){
			var wrapper_open='<div col-md-12><ul style="list-style-type: circle;"><li>';
			var title='<p><strong><span style="color:#2076b3;font-size:18px;font-weight:600;">Trade '+(product[0]+'/'+product[1]).toUpperCase()+' from '+currency.buy_from.exchange+' to '+currency.sell_at.exchange+'</strong></span><br/><span style="font-size:12px;">'+sell_date+' '+sell_time+'<span></p>';
			
			var content='<p><span style="color:#666666de;font-size:17px;">Buy 1 #'+product[0]+' for '+currency.buy_from.buy+' #'+product[1]+' at #'+currency.buy_from.exchange+'. Sell for '+currency.sell_at.sell+' #'+product[1]+' at #'+currency.sell_at.exchange+'. Your profit '+parseFloat(currency.sell_at.sell-currency.buy_from.buy).toFixed(5)+' #'+product[1]+'! ('+parseFloat((currency.sell_at.sell-currency.buy_from.buy)*100/currency.buy_from.buy).toFixed(2)+'%)</span></p>';
			
			var wrapper_close='</li></ul></div>';
			
			$("#alerts_div").prepend(wrapper_open+title+content+wrapper_close);
		}
		
		
		//PROCESS TO SHOW TRADES
		if($("#trade_div")){
			var background='#fff2cc;';
			if(i%2==0){
				background='#ffff99;';
			}
			i++;
			
			var trade_by='<tr style="background:'+background+'"><td>ALERT/SIGNAL</td><td>BUY</td><td>'+(product[0]+'/'+product[1]).toUpperCase()+'</td><td>'+currency.buy_from.buy+'</td><td>'+buy_time+'</td><td>'+buy_date+'</td><td>'+currency.buy_from.exchange.toUpperCase()+'</td></tr>';
			
			var trade_sell='<tr style="background:'+background+'"><td>ALERT/SIGNAL</td><td>SELL</td><td>'+(product[0]+'/'+product[1]).toUpperCase()+'</td><td>'+currency.sell_at.sell+'</td><td>'+sell_time+'</td><td>'+sell_date+'</td><td>'+currency.sell_at.exchange.toUpperCase()+'</td></tr>';
			
			$("#trade").prepend(trade_by+trade_sell);
		}
		
		if($("#dashboard_div")){
			background='#fff';
			if(j%2==0){
				background='#e5e5e5';	
			}
			j++;
			var buy_header='<tr style="background:'+background+'"><td>SYMBOL</td><td>BUY</td><td>EXCHANGE</td><td>VOLUME (24h)</td></tr>';
			var buy_content='<tr style="background:'+background+'"><td><strong>'+(product[0]+'/'+product[1]).toUpperCase()+'</strong></td><td><strong>'+currency.buy_from.buy+'</strong></td><td><strong>'+currency.buy_from.exchange.toUpperCase()+'</strong></td><td><strong>'+parseFloat(currency.buy_from.volume).toFixed(5)+'</strong></td></tr>';
			
			var sell_header='<tr style="background:'+background+'"><td>PROFIT</td><td>SELL</td><td>EXCHANGE</td><td>VOLUME (24h)</td></tr>';
			var sell_content='<tr style="background:'+background+'"><td><strong>'+parseFloat((currency.sell_at.sell-currency.buy_from.buy)*100/currency.buy_from.buy).toFixed(2)+'%</strong></td><td><strong>'+currency.sell_at.sell+'</strong></td><td><strong>'+currency.sell_at.exchange.toUpperCase()+'</strong></td><td><strong>'+parseFloat(currency.sell_at.volume).toFixed(5)+'</strong></td></tr>';
			
			var loaded_records='';
			if(dashboard_table_init){
				$('#dashboard_table').dataTable().fnDestroy();
				loaded_records=$("#dashboard_table_body").html();
			}
			$("#dashboard_table_body").html(buy_header+buy_content+sell_header+sell_content+loaded_records);
			
			$("#dashboard_table").DataTable({
				"paging": false, 
				"info": false,
				"sorting": false,
				dom: 'Bfrtip'
			});
			dashboard_table_init=true;
			
		}
	  });
	  
	  //if($("#alerts_div")){ $("#alerts_div").fadeIn(2000);}
	  //if($("#trade_div")){ $("#trade_div").fadeIn(2000);}
	  
	});
	
	//DAY TRADING ALERT
	io.socket.on('day_trading_alert', function (object){
		if($("#gainers_1h")){
			var str='';
			console.log(object.data.gainers_1h);
			object.data.gainers_1h.forEach(function(data){
				str+='<tr>';
				str+='<td>';
				str+=data.product;
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.price).toFixed(6);
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.change_perc_1h).toFixed(2);
				str+='</td>';
				str+='</td>';
				str+='</tr>';
			});
			$("#gainers_1h").html(str);
		
			var str='';
			object.data.losers_1h.forEach(function(data){
				str+='<tr>';
				str+='<td>';
				str+=data.product;
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.price).toFixed(6);
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.change_perc_1h).toFixed(2);
				str+='</td>';
				str+='</td>';
				str+='</tr>';
			});
			$("#losers_1h").html(str);
		
			var str='';
			object.data.gainers_24h.forEach(function(data){
				str+='<tr>';
				str+='<td>';
				str+=data.product;
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.price).toFixed(6);
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.change_perc_24h).toFixed(2);
				str+='</td>';
				str+='</td>';
				str+='</tr>';
			});
			$("#gainers_24h").html(str);
		
			var str='';
			object.data.losers_24h.forEach(function(data){
				str+='<tr>';
				str+='<td>';
				str+=data.product;
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.price).toFixed(6);
				str+='</td>';
				str+='<td>';
				str+=parseFloat(data.change_perc_24h).toFixed(2);
				str+='</td>';
				str+='</td>';
				str+='</tr>';
			});
			$("#losers_24h").html(str);
		}
	});
});

/*function socket_request(){
	var today = new Date();
	today=today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
	
	io.socket.post('/predatortrade/subscribe_room',{roomName:roomName,currencies:currencies,today:today},function (resData) {
		//console.log(resData);
	}); 
}*/

function playSound(filename){
	var mp3Source = '<source src="' + filename + '.mp3" type="audio/mpeg">';
	//var oggSource = '<source src="' + filename + '.ogg" type="audio/ogg">';
	var wavSource = '<source src="' + filename + '.wav" type="audio/wav">';
	var embedSource = '<embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3">';
	$("#sound").html('<audio autoplay="autoplay">' + mp3Source + wavSource + embedSource + '</audio>');
}