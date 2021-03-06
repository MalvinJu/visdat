var tBencana = ["Banjir", "Gempa Bumi", "Kebakaran Hutan"];
var blue = '#384ba0';
var brown = '#b25728';
var yellow ='#f3b31e';
var black = '#0f0f0f';
var grey = '#b2b2b2';
var yearMin = 2010;
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
	$(".sidenav").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
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
												{label: 'Value', id: 'value', type: 'number'}, 
												{type:'string', role:'tooltip'}];
numRegionMapArray.push(regionMapLabel);
lossRegionMapArray.push(regionMapLabel);

//BAR
var barChartArray = [];
var barChartArrayDirty = [];
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

//Carousal
$('#mapCarousel').on('slide.bs.carousel', function () {
	yFrom = Number($("#yearFrom option:selected").text());
	yTo = Number($("#yearTo option:selected").text());
	iName = $("#selectPulau option:selected" ).text();
	if (iName == "Bali dan Nusa Tenggara") {
		iName = "Nusa Tenggara";
	}
	isFlood = ( $('#banjir').attr('name') == 'banjir' && $('#banjir').is(':checked'));
	isQuake = ( $('#gempabumi').attr('name') == 'gempabumi' && $('#gempabumi').is(':checked'));
	isFFire = ( $('#kebakaran').attr('name') == 'kebakaran' && $('#kebakaran').is(':checked'));

	dType = ( (isFlood && isQuake && isFFire) ? 1 : 
						( (isFlood && isQuake) ? 5 : 
							( (isFlood && isFFire) ? 6 : 
								( (isQuake && isFFire) ? 7 : 
									( isFlood ? 2 : 
										( isQuake ? 3 :  
											( isFFire ? 4 : 0 ) ) ) ) ) ) );
	readData(yFrom, yTo, iName, dType);
})

//PARSE
function readData(yFrom, yTo, iName, dType) {
	numRegionMapArray = [];
	numRegionMapArrayDirty = [];
	lossRegionMapArray = [];
	lossRegionMapArrayDirty = [];
	numRegionMapArray.push(regionMapLabel);
	lossRegionMapArray.push(regionMapLabel);
	barChartArray = [];
	barChartArray.push(barChartLabel);
	barChartArrayDirty = [];
	pieChartArray = [];
	pieChartArray.push(pieChartLabel);
	totalNumFlood = 0;
	totalNumQuake = 0;
	totalNumFFire = 0;
	sumDisasterCount = 0;
	sumLossCount = 0;
	$.when(readDataFile()).then(function (data) {
		$.each(data, function(yKey, yVal) {
			year = yVal.tahun;
			totalLossFlood = 0
			totalLossQuake = 0
			totalLossFire = 0
			if (year >= yFrom && year <= yTo) {
				$.each(yVal.dataPulau, function(iKey, iVal) {
					pulau = iVal.pulau;
					numRegionMapData = [];
					lossRegionMapData = [];
					barChartData = [];
					if (iName == pulau || iName == "Seluruh Indonesia") {
						$.each(iVal.dataProvinsi, function(pKey, pVal) {
							province = pVal.provinsi;
							numFlood = Number(pVal.nBanjir);
							numQuake = Number(pVal.nGempa);
							numFFire = Number(pVal.nKebakaran);
							lossFlood = Number(pVal.rugiBanjir);
							lossQuake = Number(pVal.rugiGempa);
							lossFFire = Number(pVal.rugiKebakaran);
							
							switch (dType) { 
								case 1:
									totalDisasterCount = numFlood + numQuake + numFFire;
									totalLossCount = lossFlood + lossQuake + lossFFire;

									numRegionMapData = [province, totalDisasterCount, numFlood, numQuake, numFFire];

									lossRegionMapData = [province, totalLossCount, lossFlood, lossQuake, lossFFire];

									totalLossFlood += lossFlood/100000000000;
									totalLossFire += lossFFire/100000000000;
									totalLossQuake += lossQuake/100000000000;

									barChartData = [province, lossFlood/100000000000, lossQuake/100000000000, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;
								
								case 2:
									totalDisasterCount = numFlood;
									totalLossCount = lossFlood;

									numRegionMapData = [province, totalDisasterCount, numFlood, 0, 0];

									lossRegionMapData = [province, totalLossCount, lossFlood, 0, 0];

									barChartData = [province, lossFlood/100000000000, 0, 0];
									
									totalLossFlood += lossFlood/100000000000;

									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case 3:
									totalDisasterCount = numQuake;
									totalLossCount = lossQuake;

									numRegionMapData = [province, totalDisasterCount, 0, numQuake, 0];

									lossRegionMapData = [province, totalLossCount, 0, lossQuake, 0];

									totalLossQuake += lossQuake/100000000000;
									barChartData = [province, 0, lossQuake/100000000000, 0];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case 4:
									totalDisasterCount = numFFire;
									totalLossCount = lossFFire;

									numRegionMapData = [province, totalDisasterCount, 0, 0, numFFire];

									lossRegionMapData = [province, totalLossCount, 0, 0, lossFFire];

									totalLossFire += lossFFire/100000000000;
									barChartData = [province, 0, 0, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case 5:
									totalDisasterCount = numFlood + numQuake;
									totalLossCount = lossFlood + lossQuake;

									numRegionMapData = [province, totalDisasterCount, numFlood, numQuake, 0];

									lossRegionMapData = [province, totalLossCount, lossFlood, lossQuake, 0];

									totalLossFlood += lossFlood/100000000000;
									totalLossQuake += lossQuake/100000000000;
									barChartData = [province, lossFlood/100000000000, lossQuake/100000000000, 0];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case 6:
									totalDisasterCount = numFlood + numFFire;
									totalLossCount = lossFlood + lossFFire;

									numRegionMapData = [province, totalDisasterCount, numFlood, 0, numFFire];

									lossRegionMapData = [province, totalLossCount, lossFlood, 0, lossFFire];

									totalLossFlood += lossFlood/100000000000;
									totalLossFire += lossFFire/100000000000;
									barChartData = [province, lossFlood/100000000000, 0, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;

								case 7:
									totalDisasterCount = numQuake + numFFire;
									totalLossCount = lossQuake + lossFFire;

									numRegionMapData = [province, totalDisasterCount, 0, numQuake, numFFire];

									lossRegionMapData = [province, totalLossCount, 0, lossQuake, lossFFire];

									totalLossFire += lossFFire/100000000000;
									totalLossQuake += lossQuake/100000000000;
									barChartData = [province, 0, lossQuake/100000000000, lossFFire/100000000000];
									
									totalNumFlood += numFlood;
									totalNumQuake += numQuake;
									totalNumFFire += numFFire;

									sumDisasterCount += totalDisasterCount;
									sumLossCount += totalLossCount;
									break;
							}
							numRegionMapArrayDirty.push(numRegionMapData);
							lossRegionMapArrayDirty.push(lossRegionMapData);
							if (iName == pulau) {
								barChartArrayDirty.push(barChartData);
							}
						})
					}
					if (iName == "Seluruh Indonesia") {
						barChartArrayDirty.push([pulau, totalLossFlood, totalLossQuake, totalLossFire]);
					}
				})
			}
		})
		arrNumFlood = ["Banjir", totalNumFlood];
		arrNumQuake = ["Gempa Bumi", totalNumQuake];
		arrNumFFire = ["Kebakaran Hutan", totalNumFFire];
		pieChartArray.push(arrNumFlood, arrNumQuake, arrNumFFire);
		console.log(pieChartArray);
		for (i = 0; i < barChartArrayDirty.length/(yTo - yFrom+1); i++) {
			pulau = barChartArrayDirty[i][0];
			totalLossFire = barChartArrayDirty[i][3];
			totalLossQuake = barChartArrayDirty[i][2];
			totalLossFlood = barChartArrayDirty[i][1];
			for (j = 0; j < barChartArrayDirty.length; j++) {
					if (i != j) {
						if (barChartArrayDirty[i][0] == barChartArrayDirty[j][0]) {
							totalLossFire += barChartArrayDirty[j][3];
							totalLossQuake += barChartArrayDirty[j][2];
							totalLossFlood += barChartArrayDirty[j][1];
						}
					}
			}
			barChartArray.push([pulau, totalLossFlood, totalLossQuake, totalLossFire]);
		}
		for (i = 0; i < numRegionMapArrayDirty.length / (yTo - yFrom + 1); i++) {
			pulau = numRegionMapArrayDirty[i][0];
			totalDisasterDirty = 0;
			totalFloodDisaster = 0;
			totalQuakeDisaster = 0;
			totalFireDisaster = 0;
			strTooltip = ""
			for (j = 0; j < numRegionMapArrayDirty.length; j++) {
						if (numRegionMapArrayDirty[i][0] == numRegionMapArrayDirty[j][0]) {
							totalDisasterDirty += numRegionMapArrayDirty[j][1];
							totalFloodDisaster += numRegionMapArrayDirty[j][2];
							totalQuakeDisaster += numRegionMapArrayDirty[j][3];
							totalFireDisaster += numRegionMapArrayDirty[j][4];
						}
			}
			strTooltip += "Total: " + totalDisasterDirty
			if (totalFloodDisaster != 0) {
				strTooltip += "\nBanjir: " + totalFloodDisaster
			}
			if (totalQuakeDisaster != 0) {
				strTooltip += "\nGempa: " + totalQuakeDisaster
			}
			if (totalFireDisaster != 0) {
				strTooltip += "\nKebakaran: " + totalFireDisaster
			}
			numRegionMapArray.push([pulau, totalDisasterDirty, strTooltip]);
		}
		for (i = 0; i < lossRegionMapArrayDirty.length / (yTo - yFrom + 1); i++) {
			pulau = lossRegionMapArrayDirty[i][0];
			totalLossDirty = 0;
			totalFloodLoss = 0;
			totalQuakeLoss = 0;
			totalFireLoss = 0;
			strTooltip = ""
			for (j = 0; j < lossRegionMapArrayDirty.length; j++) {
					if (lossRegionMapArrayDirty[i][0] == lossRegionMapArrayDirty[j][0]) {
						totalLossDirty += lossRegionMapArrayDirty[j][1];
						totalFloodLoss += lossRegionMapArrayDirty[j][2];
						totalQuakeLoss += lossRegionMapArrayDirty[j][3];
						totalFireLoss += lossRegionMapArrayDirty[j][4];
					}
				
			}
			strTooltip += "Total: " + shortenNum(totalLossDirty, '0.00 a')
			if (totalFloodLoss != 0) {
				strTooltip += "\nBanjir: " + shortenNum(totalFloodLoss, '0.00 a')
			}
			if (totalQuakeLoss != 0) {
				strTooltip += "\nGempa: " + shortenNum(totalQuakeLoss, '0.00 a')
			}
			if (totalFireLoss != 0) {
				strTooltip += "\nKebakaran: " + shortenNum(totalFireLoss, '0.00 a')
			}
			lossRegionMapArray.push([pulau, totalLossDirty, strTooltip]);
		}
		switch (dType) {
			case 1 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, black, 'map');
					drawRegionMap(lossRegionMapArray, black, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, blue, brown, yellow); 
				});
				break;
			case 2 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, blue, 'map');
					drawRegionMap(lossRegionMapArray, blue, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, blue, grey, grey); 
				});
				break;
			case 3 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, brown, 'map');
					drawRegionMap(lossRegionMapArray, brown, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, grey, brown, grey); 
				});
				break;
			case 4 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, yellow, 'map');
					drawRegionMap(lossRegionMapArray, yellow, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, grey, grey, yellow); 
				});
				break;
			case 5 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, black, 'map');
					drawRegionMap(lossRegionMapArray, black, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, blue, brown, grey); 
				});
				break;
			case 6 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, black, 'map');
					drawRegionMap(lossRegionMapArray, black, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, blue, grey, yellow); 
				});
				break;
			case 7 :
				google.charts.setOnLoadCallback(function() {
					drawRegionMap(numRegionMapArray, black, 'map');
					drawRegionMap(lossRegionMapArray, black, 'map1');
					drawBarChart(barChartArray);
					drawPieChart(pieChartArray, grey, brown, yellow); 
				});
				break;
			case 0:
				alert("Mohon memilih minimal 1 jenis bencana");
				break;
		}
		$("#jumlah_bencana").text(shortenNum(sumDisasterCount,'0,00') + ' kejadian');
		$("#kerugian").text(shortenNum(sumLossCount,'$0.00 a'));
	})
}

function shortenNum(number, format) {
	return numeral(number).format(format);
}

google.charts.load('visualization', '1', {
	'packages':['geochart', 'corechart'],
	'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
	'language': 'id'
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

function drawRegionMap(array, color, id) {
	var mapArray = google.visualization.arrayToDataTable(array);

	var options = {
		region: 'ID',
		resolution: 'provinces',
		legend: {numberFormat: 'short'},
		tooltip: {
			textStyle: {
				fontName: 'Open Sans',
				fontSize: 14,
			}
		},
		datalessRegionColor: '#ffffff',
		colorAxis: {colors: [ '#f8f8f8', color ]}
	};

	var chart = new google.visualization.GeoChart(document.getElementById(id));
	chart.draw(mapArray, options);
};

function drawBarChart(array) {
	var barArray = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		isStacked: 'true',
		tooltip: {
			textStyle: {
				fontName: 'Open Sans',
				fontSize: 12,
			}
		},
		colors:[ blue , brown, yellow ]
	};
 var chart = new google.visualization.BarChart(document.getElementById('barchart'));
	chart.draw(barArray, options);
}

function drawPieChart(array, color1, color2, color3) {
	var pieArray = google.visualization.arrayToDataTable(array);

	var options = {
		legend: 'none',
		tooltip: {
			textStyle: {
				fontName: 'Open Sans',
				fontSize: 12,
			}
		},
		colors:[ color1, color2, color3 ]
	};
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(pieArray, options);
}

window.onload = function loadGraph() {
	yFrom = Number($("#yearFrom option:selected").text());
	yTo = Number($("#yearTo option:selected").text());
	iName = $("#selectPulau option:selected" ).text();
	if (iName == "Bali dan Nusa Tenggara") {
		iName = "Nusa Tenggara";
	}
	isFlood = ( $('#banjir').attr('name') == 'banjir' && $('#banjir').is(':checked'));
	isQuake = ( $('#gempabumi').attr('name') == 'gempabumi' && $('#gempabumi').is(':checked'));
	isFFire = ( $('#kebakaran').attr('name') == 'kebakaran' && $('#kebakaran').is(':checked'));

	dType = ( (isFlood && isQuake && isFFire) ? 1 : 
						( (isFlood && isQuake) ? 5 : 
							( (isFlood && isFFire) ? 6 : 
								( (isQuake && isFFire) ? 7 : 
									( isFlood ? 2 : 
										( isQuake ? 3 :  
											( isFFire ? 4 : 0 ) ) ) ) ) ) );
	readData(yFrom, yTo, iName, dType);
};

$("#mySidenav").change(function () {
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

	yFrom = Number($("#yearFrom option:selected").text());
	yTo = Number($("#yearTo option:selected").text());
	iName = $("#selectPulau option:selected" ).text();
	if (iName == "Bali dan Nusa Tenggara") {
		iName = "Nusa Tenggara";
	}
	isFlood = ( $('#banjir').attr('name') == 'banjir' && $('#banjir').is(':checked'));
	isQuake = ( $('#gempabumi').attr('name') == 'gempabumi' && $('#gempabumi').is(':checked'));
	isFFire = ( $('#kebakaran').attr('name') == 'kebakaran' && $('#kebakaran').is(':checked'));

	dType = ( (isFlood && isQuake && isFFire) ? 1 : 
						( (isFlood && isQuake) ? 5 : 
							( (isFlood && isFFire) ? 6 : 
								( (isQuake && isFFire) ? 7 : 
									( isFlood ? 2 : 
										( isQuake ? 3 :  
											( isFFire ? 4 : 0 ) ) ) ) ) ) );
	readData(yFrom, yTo, iName, dType);

	if (dType == 2) {
		$('#banjir').prop("disabled", true);
	} else if (dType == 3) {
		$('#gempabumi').prop("disabled", true);
	} else if (dType == 4) {
		$('#kebakaran').prop("disabled", true);
	} else {
		$('#banjir').prop("disabled", false);
		$('#gempabumi').prop("disabled", false);
		$('#kebakaran').prop("disabled", false);
	}
});
