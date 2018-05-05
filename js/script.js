function openNav() {
		document.getElementById("mySidenav").style.width = "300px";
		document.getElementById("main").style.marginRight = "300px";
		document.body.style.backgroundColor = "#f8f9fa";
}

function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("main").style.marginRight= "0";
		document.body.style.backgroundColor = "white";
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

// switch between locales
numeral.locale('id');

//MAP
var arrayMapData = [];
var label = [ {label: 'LATITUDE', id: 'Latitude', type: 'number'},
							{label: 'LONGITUDE', id: 'Longitude', type: 'number'},
							{label: 'DESCRIPTION', id: 'Description', type: 'string'},
							{label: 'VALUE', id: 'value', type: 'number'}];
arrayMapData.push(label);

var arrayCloroData = [];
var label1 = ['Province', 'nBanjir', 'nGempa', 'nKebakaran'];
arrayCloroData.push(label1);
var arrayTotalData = [];
var label2 = ['Province', 'nBencana'];
arrayTotalData.push(label2);

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
		if(data != undefined && f.dataProvinsi != undefined){
			nBencana = 0
			nBanjir = 0
			nGempa = 0
			nKebakaran = 0
			$.each(f.dataProvinsi, function (j, perPulau){
				nBanjir = parseFloat(perPulau.nBanjir)
				nGempa = parseFloat(perPulau.nGempa)
				nKebakaran = parseFloat(perPulau.nKebakaran)
				nBencana = nBanjir + nGempa + nKebakaran
				clorodata = [perPulau.provinsi, nBanjir, nGempa, nKebakaran]
				totaldata = [perPulau.provinsi, nBencana]
				arrayCloroData.push(clorodata);
				arrayTotalData.push(totaldata);
			})
		}
	})
});

google.charts.load('current', {
		'packages':['geochart'],
		'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});
google.charts.setOnLoadCallback(drawTotalMap);

function drawScatterMap() {
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

function drawCloroMap() {
	var x = google.visualization.arrayToDataTable(arrayCloroData);

	var options = {
		region: 'ID',
		resolution: 'provinces',
		zoomLevel: 4,
		legend: 'none',
		colorAxis: {colors: ['#384ba0','#b25728','#f3b31e']}
	};

	var chart = new google.visualization.GeoChart(document.getElementById('map'));
	chart.draw(x, options);
};

function drawTotalMap() {
	var x = google.visualization.arrayToDataTable(arrayTotalData);

	var options = {
		region: 'ID',
		resolution: 'provinces',
		sizeAxis: {minValue: 0, maxValue: 300},
		colorAxis: {colors: [ '#f8f8f8', '#0f0f0f' ]},
		backgroundColor: '#fdfdfd',
		datalessRegionColor: '#ffffff',
		defaultColor: '#f5f5f5',
	};

	var chart = new google.visualization.GeoChart(document.getElementById('map'));
	chart.draw(x, options);
};

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

	document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaJawa).format('0,00 a');
	document.getElementById("kerugian").innerHTML = numeral(totalKerugianJawa).format('$0.00 a');
});

google.charts.load('current', {
	'packages':['corechart'],
});

google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarJawa, 'Jawa'); });

function drawBarChart(array, name) {
	var data = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		isStacked: 'true',
		colors:['#384ba0','#b25728','#f3b31e']
	};
 var chart = new google.visualization.BarChart(document.getElementById('barchart'));
	chart.draw(data, options);
}

google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieJawa, 'Jawa'); });

function drawPieChart(array,name) {
	var data = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		colors:['#384ba0','#b25728','#f3b31e']
	};
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(data, options);
}

$("#mySidenav").change(function () {
	$("#selectPulau option:selected" ).each(function() {
  	var pulau = $(this).text();
  	switch (pulau) {
  		case 'Jawa':
  			document.getElementById("pulauName").innerHTML = "Jawa";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaJawa).format('0,00 a');
				document.getElementById("kerugian").innerHTML = numeral(totalKerugianJawa).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarJawa, 'Jawa'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieJawa, 'Jawa'); });
  			break;
  		case 'Kalimantan':
  			document.getElementById("pulauName").innerHTML = "Kalimantan";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaKalimantan).format('0,00 a');
				document.getElementById("kerugian").innerHTML = numeral(totalKerugianKalimantan).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarKalimantan, 'Kalimantan'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieKalimantan, 'Kalimantan'); });
  			break;
  		case 'Maluku':
  			document.getElementById("pulauName").innerHTML = "Maluku";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaMaluku).format('0,00 a');
				document.getElementById("kerugian").innerHTML = numeral(totalKerugianMaluku).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarMaluku, 'Maluku'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieMaluku, 'Maluku'); });
  			break;
  		case 'Bali dan Nusa Tenggara':
  			document.getElementById("pulauName").innerHTML = "Bali dan Nusa Tenggara";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaNT).format('0,00 a');
  			document.getElementById("kerugian").innerHTML = numeral(totalKerugianNT).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarNT, 'NT'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieNT, 'NT'); });
  			break;
  		case 'Papua':
  			document.getElementById("pulauName").innerHTML = "Papua";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaPapua).format('0,00 a');
  			document.getElementById("kerugian").innerHTML = numeral(totalKerugianPapua).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarPapua, 'Papua'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPiePapua, 'Papua'); });
  			break;
  		case 'Sulawesi':
  			document.getElementById("pulauName").innerHTML = "Sulawesi";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaSulawesi).format('0,00 a');
  			document.getElementById("kerugian").innerHTML = numeral(totalKerugianSulawesi).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarSulawesi, 'Sulawesi'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieSulawesi, 'Sulawesi'); });
  			break;
  		case 'Sumatera':
  			document.getElementById("pulauName").innerHTML = "Sumatera";
  			document.getElementById("jumlah_bencana").innerHTML = numeral(totalBencanaSumatera).format('0,00 a');
  			document.getElementById("kerugian").innerHTML = numeral(totalKerugianSumatera).format('$0.00 a');
  			google.charts.setOnLoadCallback(function() {drawBarChart(arrayBarSumatera, 'Sumatera'); });
  			google.charts.setOnLoadCallback(function() {drawPieChart(arrayPieSumatera, 'Sumatera'); });
  			break;
  	}
	});
	$("#disasterType").each(function() {
		$("#banjir :checkbox").each(function() {

		})
	});
});
