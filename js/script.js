var tBencana = ["Banjir", "Gempa Bumi", "Kebakaran Hutan"];
var blue = '#384ba0';
var brown = '#b25728';
var yellow ='#f3b31e';
var black = '#0f0f0f';
var grey = '#fdfdfd';
var yearMin = 2011;
var yearMax = 2014;

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

function readDataFile() {
	return $.getJSON('https://raw.githubusercontent.com/MalvinJu/visdat/master/data/all.json');
}

//ELLIPSIS LONG WORDS
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

//NUMBERS
var sumDisasterCount = 0;
var sumLossCount = 0;

//MAP
var markerMapArray = [];
var markerMapLabel = [ {label: 'Latitude', id: 'latitude', type: 'number'},
												{label: 'Longitude', id: 'longitude', type: 'number'},
												{label: 'Description', id: 'description', type: 'string'},
												{label: 'Value', id: 'value', type: 'number'}];
markerMapArray.push([markerMapLabel]);

var numRegionMapArray = [];
var lossRegionMapArray = [];
var regionMapLabel = [ {label: 'Province', id: 'Province', type: 'string'},
												{label: 'Value', id: 'value', type: 'number'}];
numRegionMapArray.push(regionMapLabel);
lossRegionMapArray.push(regionMapLabel);

//BAR
var barChartArray = [];
var barChartLabel = [ {label: 'Provinsi', id: 'provinsi', type: 'string'},
												{label: 'Banjir', id: 'banjir', type: 'number'},
												{label: 'Gempa Bumi', id: 'gempa', type: 'number'},
												{label: 'Kebakaran', id: 'kebakaran', type: 'number'} ];
barChartArray.push(barChartLabel);

//PIE
var pieChartArray = [];
var pieChartLabel = [ {label: 'Jenis Bencana', id: 'jenis', type: 'string'}, 
												{label: 'Jumlah Kejadian', id: 'jumlah', type: 'number'} ];
pieChartArray.push(pieChartLabel);

//PARSE
function readData(yFrom, yTo, iName, dType) {
	console.log(yFrom);
	console.log(yTo);
	console.log(iName);
	console.log(dType);
	$.when(readDataFile()).then(function (data) {
		$.each(data, function(yKey, yVal) {
			year = yVal.tahun;
			sumDisasterCount = 0;
			sumLossCount = 0;
			if (year >= yFrom && year <= yTo) {
				$.each(yVal.dataPulau, function(iKey, iVal) {
					pulau = iVal.pulau;
					totalNumFlood = 0;
					totalNumQuake = 0;
					totalNumFFire = 0;
					if (iName == pulau || iName == "Seluruh Indonesia") {
						$.each(iVal.dataProvinsi, function(pKey, pVal) {
							province = pVal.provinsi;
							numFlood = Number(pVal.nBanjir);
							numQuake = Number(pVal.nGempa);
							numFFire = Number(pVal.nKebakaran);
							lossFlood = Number(pVal.rugiBanjir);
							lossQuake = Number(pVal.rugiGempa);
							lossFFire = Number(pVal.rugiKebakaran);
							numRegionMapData = [];
							lossRegionMapData = [];
							barChartData = [];
							
							switch (dType) { 
								case 1:
									totalDisasterCount = numFlood + numQuake + numFFire;
									totalLossCount = lossFlood + lossQuake + lossFFire;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, lossFlood/100000000000, lossQuake/100000000000, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;
								
								case '2':
									totalDisasterCount = numFlood;
									totalLossCount = lossFlood;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, lossFlood/100000000000, 0, 0];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case '3':
									totalDisasterCount = numQuake;
									totalLossCount = lossQuake;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, 0, lossQuake/100000000000, 0];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case '4':
									totalDisasterCount = numFFire;
									totalLossCount = lossFFire;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, 0, 0, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case '5':
									totalDisasterCount = numFlood + numQuake;
									totalLossCount = lossFlodd + lossQuake;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, lossFlood/100000000000, lossQuake/100000000000, 0];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case '6':
									totalDisasterCount = numFlood + numFFire;
									totalLossCount = lossFlodd + lossFFire;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, lossFlood/100000000000, 0, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case '7':
									totalDisasterCount = numQuake + numFFire;
									totalLossCount = lossQuake + lossFFire;

									numRegionMapData = [province, totalDisasterCount];

									lossRegionMapData = [province, totalLossCount];

									barChartData = [province, 0, lossQuake/100000000000, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;
							}
							numRegionMapArray.push(numRegionMapData);
							lossRegionMapArray.push(lossRegionMapData);
							barChartArray.push(barChartData);
						})
						arrNumFlood = ["Banjir", totalNumFlood];
						arrNumQuake = ["Gempa Bumi", totalNumQuake];
						arrNumFFire = ["Kebakaran Hutan", totalNumFFire];
						pieChartArray.push(arrNumFlood, arrNumQuake, arrNumFFire);
					}
				})
			}
		})
	})
}

google.charts.load('current', {
	'packages':['geochart', 'corechart'],
	'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});

google.charts.setOnLoadCallback(function() {
	drawRegionMap(numRegionMapArray, black);
});
google.charts.setOnLoadCallback(function() {
	drawBarChart(barChartArray);
});
google.charts.setOnLoadCallback(function() {
	drawPieChart(pieChartArray); 
});

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
	var mapArray = google.visualization.arrayToDataTable(array);

	var options = {
		region: 'ID',
		resolution: 'provinces',
		colorAxis: {colors: [ '#f8f8f8', color ]}
	};
	var chart = new google.visualization.GeoChart(document.getElementById('map'));
	chart.draw(mapArray, options);
	console.log('im very wrong')
};

function drawBarChart(array) {
	var barArray = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		isStacked: 'true',
		colors:[ blue , brown, yellow ]
	};
 var chart = new google.visualization.BarChart(document.getElementById('barchart'));
	chart.draw(barArray, options);
}

function drawPieChart(array, color1, color2, color3) {
	var pieArray = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		colors:[ color1, color2, color3 ]
	};
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(pieArray, options);
}

$("#mySidenav").change(function () {
	yFrom = Number($("#yearFrom option:selected").text());
	yTo = Number($("#yearTo option:selected").text());
	iName = $("#selectPulau option:selected" ).text();
	isFlood = false;
	isQuake = false;
	isFFire = false;
	$("#disasterType:checkbox:checked").each(function() {
		isFlood = ( $(this).text() == 'Banjir' || isFlood );
		isQuake = ( $(this).text() == 'Gempa Bumi' || isQuake );
		isFFire = ( $(this).text() == 'Kebakaran Hutan' || isFFire );
	})

	dType = ( (isFlood && isQuake && isFFire) ? 1 : 
		( (isFlood && isQuake) ? 5 : 
			( (isFlood && isFFire) ? 6 : 
				( (isQuake && isFFire) ? 7 : 
					( isFlood ? 1 : 
						( isQuake ? 2 :  
							( isFFire ? 3 : 1 ) ) ) ) ) ) );

	$("#jumlah_bencana").text(numeral(sumDisasterCount).format('0,00 a'));
	$("#kerugian").text(numeral(sumLossCount).format('$0.00 a'));

	readData(yFrom, yTo, iName, dType);
	google.charts.setOnLoadCallback(function() {
		drawRegionMap(numRegionMapArray, black);
	});
	google.charts.setOnLoadCallback(function() {
		drawBarChart(barChartArray);
	});
	google.charts.setOnLoadCallback(function() {
		drawPieChart(pieChartArray, blue, brown, yellow); 
	});

	$("#selectPulau option:selected" ).each(function() {
  	var pulau = $(this).text();
		$("#pulauName").text(truncateWithEllipses(pulau, 14));
		$("#pulauName").attr('title', pulau);
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
