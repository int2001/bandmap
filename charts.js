$(function() {
	var dxcluster_provider = 'https://dxc.jo30.de/dxcache';

	function render_chart (band,spot_data) {

		Highcharts.chart('container', {
			chart: {
				type: 'timeline',
				zoomType: 'x'
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: '<h5>{chartTitle}</h5>' +
						'<div>{typeDescription}</div>' +
						'<div>{chartSubtitle}</div>' +
						'<div>{chartLongdesc}</div>' +
						'<div>{viewTableButton}</div>'
				},
				point: {
					valueDescriptionFormat: '{index}. {point.label}. {point.description}.'
				}
			},
			xAxis: {
				visible: true,
				type: 'linear'
			},
			yAxis: {
				visible: false
			},
			title: {
				text: band
			},
			series: [ { data: spot_data } ] 
		});
	}

	function SortByQrg(a, b){
		var a = a.frequency;
		var b = b.frequency;
		return ((a< b) ? -1 : ((a> b) ? 1 : 0));
	}

	function reduce_spots(spotobject) {
		let unique=[];
		spotobject.forEach((single) => {
			if (!spotobject.find((item) => ((item.spotted == single.spotted) && (item.frequency == single.frequency) && (Date.parse(item.when)>Date.parse(single.when))))) {
				unique.push(single);
			}
		});
		return unique;
	}

	function convert2high(spotobject) {
		let ret={};
		ret.name=spotobject.spotted;
		ret.x=spotobject.frequency;
		ret.description=spotobject.frequency;
		return ret;
	}

	function set_chart(lowerQrg,upperQrg,maxAgeMinutes) {
		$.ajax({
			url: dxcluster_provider + "/spots",
			cache: false,
			dataType: "json"
		}).done(function(dxspots) {
			spots4chart=[];
			dxspots.sort(SortByQrg);
			dxspots=reduce_spots(dxspots);
			dxspots.forEach((single) => {
				if ( (single.frequency >= lowerQrg) && (single.frequency <= upperQrg) && (Date.parse(single.when)>(Date.now() - 1000 * 60 * maxAgeMinutes)) ) {
					spots4chart.push(convert2high(single));
				}
			});
			// console.log(spots4chart);
			render_chart('20m',spots4chart);
		});
	}

set_chart(14000,14310,30);
});
