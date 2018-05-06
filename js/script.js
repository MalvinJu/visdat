var tBencana = ["Banjir", "Gempa Bumi", "Kebakaran Hutan"];
var blue = '#384ba0';
var brown = '#b25728';
var yellow ='#f3b31e';
var black = '#0f0f0f';

function openNav() {
	document.getElementById("mySidenav").style.width = "300px";
	document.getElementById("main").style.marginRight = "300px";
	$(".legend").each( function() {
		var text = $(this).text();
		var newText = truncateWithEllipses(text, 6);
		$(this).text(newText);
	});
	t = $("#pulauName").text();
	$("#pulauName").text(truncateWithEllipses(t, 14));
	$("#pulauName").attr('title', t);
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginRight= "0";
	$(".sidenav").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
    function(e) {
    	$(".legend").each( function() {
				t = $(this).attr('title');
				$(this).text(truncateWithEllipses(t, 15));
			});
			t2 = $("#pulauName").attr('title');
			$("#pulauName").text(t2);
			$("#pulauName").removeAttr('title');
    })
}

function getJSONBanjir() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/banjir.json');
}
function getJSONGempa() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/gempa.json');
}
function getJSONKebakaran() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/kebakaran.json');
}
function getJSONKerugian() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/kerugiangabungan.json');
}
function getJSONPulau() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/tespulau.json');
}

//LEGEND ELLIPSIS
function truncateWithEllipses(text, max) {
	return text.substr(0, max).trim() + (text.length > max ? '...' : '');
}

//NUMBER FORMAT
numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'ribu',
        million: 'juta',
        billion: 'miliar',
        trillion: 'triliun'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'Rp '
    }
});
numeral.locale('id');

//MAP
var arrayMapData = [];
var label = [ {label: 'LATITUDE', id: 'Latitude', type: 'number'},
							{label: 'LONGITUDE', id: 'Longitude', type: 'number'},
							{label: 'DESCRIPTION', id: 'Description', type: 'string'},
							{label: 'VALUE', id: 'value', type: 'number'}];
arrayMapData.push([label]);

var arrayBanjirData = [];
arrayBanjirData.push(['Province', 'nBanjir']);
var arrayGempaData = [];
arrayGempaData.push(['Province', 'nGempa']);
var arrayKebakaranData = [];
arrayKebakaranData.push(['Province', 'nKebakaran']);

var arrayBGData = [];
arrayBGData.push(['Province', 'nBG']);
var arrayBKData = [];
arrayBKData.push(['Province', 'nBK']);
var arrayGKData = [];
arrayGKData.push(['Province', 'nGK']);

var arrayTotalData = [];
arrayTotalData.push(['Province', 'nBencana']);

$.when(getJSONBanjir()).then(function (dataBanjir) {
	$.each(dataBanjir, function(i, f) {   
		x = [f.latitude, f.longitude, 'Banjir', 1]
		arrayMapData.push(x)
	});
});
$.when(getJSONGempa()).then(function (dataGempa) {
	$.each(dataGempa, function(i, f) {   
		x = [f.latitude, f.longitude, 'Gempa bumi', 1]
		arrayMapData.push(x)
	});
});
$.when(getJSONKebakaran()).then(function (dataKebakaran) {
	$.each(dataKebakaran, function(i, f) {   
		x = [f.latitude, f.longitude, 'Kebakaran hutan', 1]
		arrayMapData.push(x)
	});
});
$.when(getJSONPulau()).then(function (data) {
	$.each(data, function(i, f) {
		if(data != undefined && f.dataProvinsi != undefined) {
			$.each(f.dataProvinsi, function (j, perPulau){
				nBanjir = parseFloat(perPulau.nBanjir)
				nGempa = parseFloat(perPulau.nGempa)
				nKebakaran = parseFloat(perPulau.nKebakaran)
				nBG = nBanjir + nGempa
				nBK = nBanjir + nKebakaran
				nGK = nGempa + nKebakaran
				nBencana = nBanjir + nGempa + nKebakaran
				banjirdata = [perPulau.provinsi, nBanjir]
				gempadata = [perPulau.provinsi, nGempa]
				kebakarandata = [perPulau.provinsi, nKebakaran]
				bgdata = [perPulau.provinsi, nBG]
				bkdata = [perPulau.provinsi, nBK]
				gkdata = [perPulau.provinsi, nGK]
				totaldata = [perPulau.provinsi, nBencana]
				arrayBanjirData.push(banjirdata);
				arrayGempaData.push(gempadata);
				arrayKebakaranData.push(kebakarandata);
				arrayBGData.push(bgdata);
				arrayBKData.push(bkdata);
				arrayGKData.push(gkdata);
				arrayTotalData.push(totaldata);
			})
		}
	})
});

//NUMBERS
var totalBencanaJawa = 0, totalKerugianJawa = 0;
var totalBencanaKalimantan = 0, totalKerugianKalimantan = 0;
var totalBencanaMaluku = 0, totalKerugianMaluku = 0;
var totalBencanaNT = 0, totalKerugianNT = 0;
var totalBencanaPapua = 0, totalKerugianPapua = 0;
var totalBencanaSulawesi = 0, totalKerugianSulawesi = 0;
var totalBencanaSumatera = 0, totalKerugianSumatera = 0;

//BAR
var arrayBarJawa = [];
var arrayBarKalimantan = [];
var arrayBarMaluku = [];
var arrayBarNT = [];
var arrayBarPapua = [];
var arrayBarSulawesi = [];
var arrayBarSumatera = [];

var label = ['Provinsi', 'Banjir', 'Gempa Bumi', 'Kebakaran Hutan'];
arrayBarJawa.push(label);
arrayBarKalimantan.push(label);
arrayBarMaluku.push(label);
arrayBarNT.push(label);
arrayBarPapua.push(label);
arrayBarSulawesi.push(label);
arrayBarSumatera.push(label);

//PIE
var arrayPieJawa = [];
var arrayPieKalimantan = [];
var arrayPieMaluku = [];
var arrayPieNT = [];
var arrayPiePapua = [];
var arrayPieSulawesi = [];
var arrayPieSumatera = [];

var namaProvinsi, nBanjir, nGempa, nKebakaran;
var label = ['Jenis Bencana', 'Jumlah Kejadian'];
arrayPieJawa.push(label);
arrayPieKalimantan.push(label);
arrayPieMaluku.push(label);
arrayPieNT.push(label);
arrayPiePapua.push(label);
arrayPieSulawesi.push(label);
arrayPieSumatera.push(label);

//PARSE
$.when(getJSONPulau()).then(function (data) {
	$.each(data, function(i, f) {
		if(data != undefined && f.dataProvinsi != undefined){
			nBanjir = 0;
			nGempa = 0;
			nKebakaran = 0;
			switch(f.pulau){
				case 'Jawa':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaJawa += parseFloat(perPulau.nBanjir);
						totalKerugianJawa += parseFloat(perPulau.rugiBanjir);

						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)

						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarJawa.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieJawa.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Kalimantan':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaKalimantan += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianKalimantan += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);
					
						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)

						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarKalimantan.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieKalimantan.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Maluku':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaMaluku += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianMaluku += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);
					
						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)

						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarMaluku.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieMaluku.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Nusa Tenggara':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaNT += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianNT += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);
					
						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)
						
						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarNT.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieNT.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Papua':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaPapua += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianPapua += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);
					
						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)
						
						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarPapua.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPiePapua.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Sulawesi':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaSulawesi += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianSulawesi += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);

						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)
						
						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarSulawesi.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieSulawesi.push(xBanjir, xGempa, xKebakaran);
					break;
				case 'Sumatera':
					$.each(f.dataProvinsi, function (j,perPulau){
						totalBencanaSumatera += parseFloat(perPulau.nBanjir) + parseFloat(perPulau.nGempa) + parseFloat(perPulau.nKebakaran);
						totalKerugianSumatera += parseFloat(perPulau.rugiBanjir) + parseFloat(perPulau.rugiGempa) + parseFloat(perPulau.rugiKebakaran);

						nBanjir += parseFloat(perPulau.nBanjir)
						nGempa += parseFloat(perPulau.nGempa)
						nKebakaran += parseFloat(perPulau.nKebakaran)
						
						y = [perPulau.provinsi, parseFloat(perPulau.rugiBanjir/100000000000), parseFloat(perPulau.rugiGempa/100000000000), parseFloat(perPulau.rugiKebakaran/100000000000)]
						arrayBarSumatera.push(y);
					})
					xBanjir = ['Banjir', nBanjir ]
					xGempa = ['Gempa', nGempa]
					xKebakaran = ['Kebakaran', nKebakaran]
					arrayPieSumatera.push(xBanjir, xGempa, xKebakaran);
					break;
			}
		}
	});

	$("#jumlah_bencana").text(numeral(totalBencanaJawa).format('0,00 a'));
	$("#kerugian").text(numeral(totalKerugianJawa).format('$0.00 a'));
});

google.charts.load('current', {
	'packages':['geochart', 'corechart'],
	'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});

google.charts.setOnLoadCallback(function() {drawRegionMap(arrayTotalData, black); });
google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarJawa, 'Jawa'); });
google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieJawa, 'Jawa'); });

function drawPlotMap() {
	var x = google.visualization.arrayToDataTable(arrayMapData);

	var options = {
		region: 'ID',
		displayMode: 'markers',
		zoomLevel: 4,
		sizeAxis: { minValue: -2, maxValue: 5, minSize: 1, maxSize: 5},
		legend: 'none',
		colorAxis: {colors: ['#808080']}
	};

	var chart = new google.visualization.GeoChart(document.getElementById('map'));
	chart.draw(x, options);
};

function drawRegionMap(array, color) {
	var x = google.visualization.arrayToDataTable(array);

	var options = {
		region: 'ID',
		resolution: 'provinces',
		colorAxis: {colors: [ '#f8f8f8', color ]},
		backgroundColor: { fill: '#ffffff', stroke: '#ffffff' },
		datalessRegionColor: '#ffffff',
		defaultColor: '#f5f5f5',
	};
	var chart = new google.visualization.GeoChart(document.getElementById('map'));
	chart.draw(x, options);
};

function drawBarChart(array, name) {
	var data = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		isStacked: 'true',
		backgroundColor: '#fdfdfd',
		colors:['#384ba0','#b25728','#f3b31e']
	};
 var chart = new google.visualization.BarChart(document.getElementById('barchart'));
	chart.draw(data, options);
}

function drawPieChart(array,name) {
	var data = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		backgroundColor: '#fdfdfd',
		colors:['#384ba0','#b25728','#f3b31e']
	};
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(data, options);
}

var yearMin = 2011;
var yearMax = 2014;

$("#mySidenav").change(function () {
	$("#selectPulau option:selected" ).each(function() {
  	var pulau = $(this).text();
		$("#pulauName").text(truncateWithEllipses(pulau, 14));
		$("#pulauName").attr('title', pulau);
  	switch (pulau) {
  		case 'Jawa':
  			$("#jumlah_bencana").text(numeral(totalBencanaJawa).format('0,00 a'));
				$("#kerugian").text(numeral(totalKerugianJawa).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarJawa, 'Jawa'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieJawa, 'Jawa'); });
				google.charts.setOnLoadCallback(function() {drawRegionMap(arrayTotalData, black); });
  			break;
  		case 'Kalimantan':
  			$("#jumlah_bencana").text(numeral(totalBencanaKalimantan).format('0,00 a'));
				$("#kerugian").text(numeral(totalKerugianKalimantan).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarKalimantan, 'Kalimantan'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieKalimantan, 'Kalimantan'); });
  			break;
  		case 'Maluku':
  			$("#jumlah_bencana").text(numeral(totalBencanaMaluku).format('0,00 a'));
				$("#kerugian").text(numeral(totalKerugianMaluku).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarMaluku, 'Maluku'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieMaluku, 'Maluku'); });
  			break;
  		case 'Bali dan Nusa Tenggara':
  			$("#jumlah_bencana").text(numeral(totalBencanaNT).format('0,00 a'));
  			$("#kerugian").text(numeral(totalKerugianNT).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarNT, 'NT'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieNT, 'NT'); });
  			break;
  		case 'Papua':
  			$("#jumlah_bencana").text(numeral(totalBencanaPapua).format('0,00 a'));
  			$("#kerugian").text(numeral(totalKerugianPapua).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarPapua, 'Papua'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPiePapua, 'Papua'); });
  			break;
  		case 'Sulawesi':
  			$("#jumlah_bencana").text(numeral(totalBencanaSulawesi).format('0,00 a'));
  			$("#kerugian").text(numeral(totalKerugianSulawesi).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarSulawesi, 'Sulawesi'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieSulawesi, 'Sulawesi'); });
  			break;
  		case 'Sumatera':
  			$("#jumlah_bencana").text(numeral(totalBencanaSumatera).format('0,00 a'));
  			$("#kerugian").text(numeral(totalKerugianSumatera).format('$0.00 a'));
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarSumatera, 'Sumatera'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieSumatera, 'Sumatera'); });
  			break;
  	}
	});
	$("#disasterType").each(function() {
		$("#banjir :checkbox").each(function() {

		})
	});
	$("#yearFrom option:selected" ).each(function() {
		var yTo = Number($("#yearTo option:selected").text());
		$("#yearTo option").remove();
		var yFrom = Number($(this).text());;
		for (i = yFrom; i <= yearMax; i++) {
			if (i == yTo) {
				$("#yearTo").append($("<option></option>").attr('selected', 'selected').text(i));
			} else {
				$("#yearTo").append($("<option></option>").text(i));
			}
		}
		$('#tahunFrom').text(yFrom);
	});
	$("#yearTo option:selected").each(function() {
		var yTo = Number($(this).text());
		$('#tahunTo').text(yTo);
	})
});
