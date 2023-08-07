//var defaults = {};
var data = {};
var settings = {};
var data_map = {};
var myChart;

var isMobile = false; //initiate as false
//device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

function commafy(a) {
	var parts = String(a).split('.');
	if (parts.length > 1){
		return String(parts[0]).split("").reverse().join("").replace(/(.{3}\B)/g, "$1,").split("").reverse().join("") + '.' + parts[1];
	}
	else {
		return String(a).split("").reverse().join("").replace(/(.{3}\B)/g, "$1,").split("").reverse().join("");
	}
}

function validate_slider(e, el, min, max){
    var val = parseInt($(el).val());
    delay(function(){
      if ((val < min ) ||  (val > max)){
        $(el).addClass('slider-has-error');
        $(el).siblings('.slider-display-error').removeClass('alert-success').addClass('alert-danger');
        $(el).parent('.slider-lable-value').siblings('.slider-slider').addClass('slider-slider-error');
        e.preventDefault();
      }
      else {
        $(el).removeClass('slider-has-error');
        $(el).siblings('.slider-display-error').removeClass('alert-danger').addClass('alert-success');
        $(el).parent('.slider-lable-value').siblings('.slider-slider').removeClass('slider-slider-error');
      }
    }, 200 );
  }

function validate_slider_input(e, el, min, max){
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 37, 39]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
         // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             // let it happen, don't do anything
             return
    } else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
        return;
    }

    if ($.isNumeric($(el).val())){
       var val = parseInt($(el).val());
       if (val < min ) {
       } else if (val > max){
         e.preventDefault();
       }
    }
}

function download_data(){
  edit_date = new Date();
  $('#update-date').html(edit_date.toDateString());

  data.settings = settings;
  data.data_map = data_map;

  if (isMobile){
	  localStorage.setItem('sap_asset_information', JSON.stringify(data));
	  alert('Data has been saved.');
  } else {
	  var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=UTF-8"} );
	  saveAs(blob, 'ecm_calculator.json');
  }
}

function format_number(num){
	var val = num;
	if ( num > 999999999 ) {
		val = (num/1000000000).toFixed(1) + 'B'
	} else if ( num > 999999 ) {
		val = (num/1000000).toFixed(1) + 'M'
	} else if ( num > 999 ) {
		val = (num/1000).toFixed(1) + 'K'
	}
	
	return val
}

$(document).ready(function(){

	$('input.form-control').val('4');
	$('select.form-control').val('2');

	settings['a1'] = {'c':.05,'l':.10};
	settings['a2'] = {'c':.05,'l':.10};
	settings['a3'] = {'c':.20,'l':.30};
	settings['a4'] = {'c':.2,'l':.3};
	settings['a5'] = {'c':.05,'l':.11};
	settings['a6'] = {'c':.02,'l':.07};
	settings['a7'] = {'c':.05,'l':.10};
	settings['a8'] = {'c':.01,'l':.05};

//	$.getJSON("static/defaults.js", function(json) {
//		defaults = json;
		settings = defaults['settings'];
		data_map = defaults['data_map'];
		data['settings'] = settings;

		Chart.defaults.global.defaultFontFamily = "'Open Sans', 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif";
		Chart.defaults.global.defaultFontSize = 16;
		var ctx = document.getElementById("tab5-chart").getContext("2d");
//		var ctx = document.getElementById("tab5-chart");
		myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: [],
				datasets: [
/*					{
						backgroundColor: [
							'#DA5120'
						],
						borderWidth: 0,
						data: [10],
						label: "Without"
					},
*/					{
						backgroundColor: [
							'#4A90E2'
						],
						borderWidth: 0,
						data: [10],
						label: "Conservative"
					},
					{
						backgroundColor: [
							'#BBDAFF'
						],
						borderWidth: 0,
						data: [30],
						label: "Likely"
					}
				]
			},
			options: {
				legend: {
					labels: {
						boxWidth: 16,
						padding: 30,
					},
					position: 'bottom'
				},
				scales: {
					xAxes: [{
						stacked: false
					}],
					yAxes: [{
						stacked: false,
						ticks: {
//							beginAtZero: true,
//							display: false,
							autoSkip: true,
							autoSkipPadding: 2,
							fontColor: '#9B9B9B',
							fontSize: 12,
							callback: function(value, index, values) {
								if (index % 2 == 0){
									return '$' + format_number(value);
								}
								return undefined
		                    }						}
					}],
				},
				title: {
					display: true,
					fontSize: 24,
					fontStyle: 'normal',
					padding: 16,
					text: 'Savings'
				},
                animation: {
                    duration: 1,
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "rgba(0, 0, 0, 1)";
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText($('#assumptions-currency option:selected').text() + format_number(data), bar._model.x, bar._model.y - 5);

                            });
                        });
                    }
                },
                tooltips: {
		            callbacks: {
		                label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': $';
		                    }
		                    label += commafy(tooltipItem.yLabel);
		                    return label;
		                }
		            }
		        }
			}
		});


		$('.form-control').each(function(){
			$(this).val(data_map[$(this).attr('id')])
		});

		updateData();

//	});


	function calc_data(key, sources, complexity){
	}

	function updateData(){
		var total_savings = 0;
		var total_cost = 0;
		var total_cost_con = 0;
		var total_cost_likely = 0;
		var total_savings_con = 0;
		var total_savings_likely = 0;
		var UNKNOWN = 50000;

		// Fix floats
		$('input[data-float=true]').each(function(){
			data_map[$(this).attr('id')] = parseFloat($(this).val());
		});

		data['a1'] = data_map['t1-q4'] * settings['a6']['l'] * settings['a2']['l'];
		data['a1-c'] = data_map['t1-q4'] * settings['a6']['c'] * settings['a2']['c'];
		data['a1-l'] = data_map['t1-q4'] * settings['a6']['l'] * settings['a2']['l'];
		$('.a1-c').text(commafy(Math.round(data['a1-c'])));
		$('.a1-l').text(commafy(Math.round(data['a1-l'])));

		data['a2'] = Math.round((settings['a1']['c'] * data_map['t1-q5'] / (data_map['t1-q1']*1000)) * data_map['t1-q1']);
		data['a2-c'] = Math.round((settings['a1']['c'] * data_map['t1-q5'] / (data_map['t1-q1']*1000)) * (settings['a7']['c']) * (data_map['t1-q1']*1000));
		data['a2-l'] = Math.round((settings['a1']['l'] * data_map['t1-q5'] / (data_map['t1-q1']*1000)) * (settings['a7']['l']) * (data_map['t1-q1']*1000));
		$('.a2-c').text(commafy(Math.round(data['a2-c'])));
		$('.a2-l').text(commafy(Math.round(data['a2-l'])));

		data['a3'] = Math.round((data_map['t2-q2']*data_map['t2-q3']*data_map['t2-q5']/(settings['assumptions-working-minutes']*settings['assumptions-working-days'])*settings['a3']['l']));
		data['a3-c'] = Math.round((data_map['t2-q2']*data_map['t2-q3']*data_map['t2-q5']/(settings['assumptions-working-minutes']*settings['assumptions-working-days'])*settings['a3']['c']) * settings['a8']['c']*(data_map['t2-q1']/1000));
		data['a3-l'] = Math.round((data_map['t2-q2']*data_map['t2-q3']*data_map['t2-q5']/(settings['assumptions-working-minutes']*settings['assumptions-working-days'])*settings['a3']['l']) * settings['a8']['l']*(data_map['t2-q1']/1000));
		$('.a3-c').text(commafy(Math.round(data['a3-c'])));
		$('.a3-l').text(commafy(Math.round(data['a3-l'])));

		var b66 = data_map['t2-q2'];
		var b101_c = b66 * (data_map['t2-q3']/100) * data_map['t2-q5']/(settings['assumptions-working-days']*settings['assumptions-working-minutes'])*settings['a4']['c'];
		var b101_l = b66 * (data_map['t2-q3']/100) * data_map['t2-q5']/(settings['assumptions-working-days']*settings['assumptions-working-minutes'])*settings['a4']['l'];
		data['a4-c'] =  settings['a9']['c']*b101_c;
		data['a4-l'] =  settings['a9']['l']*b101_l;
		data['a4'] = Math.round((data_map['t2-q2'] * .5 * data_map['t2-q6'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes'])*settings['a4']['l']));
//		data['a4-c'] = Math.round((data_map['t2-q2'] * .5 * data_map['t2-q6'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes'])*settings['a4']['c'])  * settings['a9']['c']);
//		data['a4-l'] = Math.round((data_map['t2-q2'] * .5 * data_map['t2-q6'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes'])*settings['a4']['l'])  * settings['a9']['l']);
		$('.a4-c').text(commafy(Math.round(data['a4-c'])));
		$('.a4-l').text(commafy(Math.round(data['a4-l'])));

		// B110*(1-B111)*B114/(B116*B117*12)*B115
		data['a5'] = Math.round((data_map['t1-q1']*1000) * (1-(data_map['t1-q3']/100)) * data_map['t3-q1'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']*12) * settings['a5']['c']);
		data['a5-c'] =Math.round(((data_map['t1-q1']*1000) * (1-(data_map['t1-q3']/100)) * data_map['t3-q1'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']*12) * settings['a5']['c']) * settings['a10']['c']);
		data['a5-l'] =Math.round(((data_map['t1-q1']*1000) * (1-(data_map['t1-q3']/100)) * data_map['t3-q1'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']*12) * settings['a5']['l']) * settings['a10']['l']);
		$('.a5-c').text(commafy(Math.round(data['a5-c'])));
		$('.a5-l').text(commafy(Math.round(data['a5-l'])));

		data['a6'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q3']/100) * (data_map['t3-q4']/100) * (data_map['t3-q5']/100));
		data['a6-c'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q3']/100) * (data_map['t3-q4']/100) * (data_map['t3-q5']/100) * settings['a11']['c']);
		data['a6-l'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q3']/100) * (data_map['t3-q4']/100) * (data_map['t3-q5']/100) * settings['a11']['l']);
		$('.a6-c').text(commafy(Math.round(data['a6-c'])));
		$('.a6-l').text(commafy(Math.round(data['a6-l'])));

		var a7c = (data_map['t3-q3']/100) + settings['a12']['c'];
		var a7l = (data_map['t3-q3']/100) + settings['a12']['l'];
		var a = .20 - (data_map['t3-q3']/100);
		if ( a < 0 ){
			a = 0.00000000000000;
		}

		if ( a < a7l){
			a7l = a;
			a7c = a;
		}
		data['a7'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q4']/100) * a7l);
		data['a7-c'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q4']/100) * a7c);
		data['a7-l'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t3-q4']/100) * a7l);
		$('.a7-c').text(commafy(Math.round(data['a7-c'])));
		$('.a7-l').text(commafy(Math.round(data['a7-l'])));

		
		data['a8'] = Math.round((data_map['t4-q5']/100) * 10 * 1 * settings['a1']['c'] * settings['a13']['c']);
		data['a8-c'] = Math.round((data_map['t4-q5']/100) * 10 * 1 * settings['a1']['c'] * settings['a13']['c']);
		data['a8-l'] = Math.round((data_map['t4-q5']/100) * 10 * 1 * settings['a1']['l'] * settings['a13']['l']);
		$('.a8-c').text(commafy(Math.round(data['a8-c'])));
		$('.a8-l').text(commafy(Math.round(data['a8-l'])));

		
		data['a9'] = Math.round(data_map['t4-q6'] * settings['a14']['l']);
		data['a9-c'] = Math.round(data_map['t4-q6'] * settings['a14']['c']);
		data['a9-l'] = Math.round(data_map['t4-q6'] * settings['a14']['l']);
		$('.a9-c').text(commafy(Math.round(data['a9-c'])));
		$('.a9-l').text(commafy(Math.round(data['a9-l'])));
		
		data['a10'] = Math.round((data_map['t3-q2']*1000000) * settings['a1']['c']);
		data['a10-c'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t4-q1']/100) * settings['a15']['c']);
		data['a10-l'] = Math.round((data_map['t3-q2']*1000000) * (data_map['t4-q1']/100) * settings['a15']['l']);
		$('.a10-c').text(commafy(Math.round(data['a10-c'])));
		$('.a10-l').text(commafy(Math.round(data['a10-l'])));
		
		// B126*B127/(B129*B130)*B128
		data['a11'] = Math.round(data_map['t4-q3'] * data_map['t4-q4'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']) * UNKNOWN);
		data['a11-c'] = Math.round(data_map['t4-q3'] * data_map['t4-q4'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']) * UNKNOWN * settings['a16']['c']);
		data['a11-l'] = Math.round(data_map['t4-q3'] * data_map['t4-q4'] / (settings['assumptions-working-days']*settings['assumptions-working-minutes']) * UNKNOWN * settings['a16']['l']);
		$('.a11-c').text(commafy(Math.round(data['a11-c'])));
		$('.a11-l').text(commafy(Math.round(data['a11-l'])));

		total_savings_con = data['a1-c'] + data['a2-c'] + data['a3-c'] + data['a4-c'] + data['a5-c'] + data['a6-c'] + data['a7-c'] + data['a8-c'] + data['a9-c'] + data['a10-c'] + data['a11-c'];
		total_savings_likely = data['a1-l'] + data['a2-l'] + data['a3-l'] + data['a4-l'] + data['a5-l'] + data['a6-l'] + data['a7-l'] + data['a8-l'] + data['a9-l'] + data['a10-l'] + data['a11-l'];

		total_cost = data['a1'] + data['a2'] + data['a3'] + data['a4'] + data['a5'] + data['a6'] + data['a7'] + data['a8'] + data['a9'] + data['a10'] + data['a11'] ;
		total_cost_con = total_cost - total_savings_con;
		total_cost_likely = total_cost - total_savings_likely;

		$('.total-c').text(commafy(total_savings_con));
		$('.total-l').text(commafy(total_savings_likely));
		$('.total-c').each(function(){
			var total = 0;
			$(this).closest('table').find("tr").each(function(){
				var i = parseInt(data[$(this).find("td:nth-child(2)").attr('class')]);
				if (i){
				    total = total + i;
				}
			});

			$(this).text(commafy(Math.round(total)));
		});

		$('.total-l').each(function(){
			var total = 0;
			$(this).closest('table').find("tr").each(function(){
				var i = parseInt(data[$(this).find("td:nth-child(3)").attr('class')]);
				if (i){
				    total = total + i;
				}
			});

			$(this).text(commafy(Math.round(total)));

		});

		$('.total-savings-span').text($('#total-savings-final').text());

		/* Charts */
		var datasets= [
/*					{
						backgroundColor: [
							'#DA5120'
						],
						borderWidth: 0,
						data: [Math.round(total_cost)],
						label: "Without"
					},
*/					{
						backgroundColor: [
							'#4A90E2'
						],
						borderWidth: 0,
						data: [Math.round(total_savings_con)],
						label: "Conservative"
					},
					{
						backgroundColor: [
							'#BBDAFF'
						],
						borderWidth: 0,
						data: [Math.round(total_savings_likely)],
						label: "Likely"
					}
				];

		myChart.data.datasets=datasets;
		myChart.update();

	}


	function import_data(evt){
	    //Retrieve the first (and only!) File from the FileList object
	    var f = evt.target.files[0];

	    if (f) {
	      var r = new FileReader();
	      r.onload = function(e) {
	        var contents = e.target.result;

	        var tmp = JSON.parse(contents);

	        if (confirm('All current data will be overwritten.  Do you wish to continue?')){
	          data = tmp;

	          data_map = data.data_map;
	          settings = data.settings;

	  		  $.each(data_map, function(k,v){
				$('#'+k).val(v);
	  		  });
	          updateData();

	        }
	      };
	      r.readAsText(f);
	    } else {
	      alert("Failed to load file");
	    }
	}

	$('.form-control').each(function(){
		data_map[$(this).attr('id')] = parseInt($(this).val());
	});

	$('.form-control').on('change',function(){
		var val = parseInt($(this).val());

		if ($(this).data('float') == true){
			val = parseFloat($(this).val());			
		}
		data_map[$(this).attr('id')] = val;
		
		data_map['t4-q2'] =  Math.round(data_map['t3-q2']*1000000*(data_map['t4-q1']/100));
		$('#t4-q2').val(data_map['t4-q2']);

		data_map['t2-q2'] =  Math.round( (((data_map['t1-q1'] * 1000) * (data_map['t1-q3']/100))/12) * (data_map['t2-q1']/100) );
		$('#t2-q2').val(data_map['t2-q2']);

		updateData();
	});
	  $('#export-data').on('click', function(e){
		    e.preventDefault();
		    download_data();
		  });

	  $('#load-data-btn').on('click',function(e){
		 if (isMobile){
			 e.preventDefault();
			 if (confirm('All current data will be overwritten.  Do you wish to continue?')){
		          data = JSON.parse(window.localStorage.getItem('sap_asset_information'));
		          data_map = data.data_map;
		          settings = data.settings;

		  		  $.each(data_map, function(k,v){
					$('#'+k).val(v);
		  		  });

		          updateData();
			 }
		 } else {
			$("#load-data").modal('show');
		 }
	  });
	  $('.btn-file :file').on('change', function(event, numFiles, label) {
	        var input = $(this).parents('.input-group').find(':text'),
	            log = numFiles > 1 ? numFiles + ' files selected' : label;

	        if( input.length ) {
	            input.val(log);
	            import_data(event);
	        } else {
	            if( log ) alert(log);
	        }

	        $(this).closest('.modal').modal('hide');

      });
	  $('#submit-import').on('click', function(e){
		    e.preventDefault();
		    download_data();
		  });

	  $('.assumption').each(function(){
		  $(this).val(settings[$(this).attr('id')]);
	  });
	  
      /* Sliders */
	  $('.slider-item').each(function(){
		  var key = $(this).attr('rel');
		  var max = $(this).data('max');
		  var min = 0;
		  var container = this;
		  if ($(this).data('min')){
			  min = $(this).data('min');
		  }

		  var is_percent = $(this).data("percent");
		  var val = settings[key];
		  var val_c = 0;
		  var val_l = 0
		  if (is_percent) {
			  val_c = Math.round(val['c'] * 100);
			  val_l = Math.round(val['l'] * 100);
		  } else {
			  val_c = val['c'];
			  val_l = val['l'];
		  }

		  var step = 10;
		  var diff = max - min;
		  if ( diff < 50){
			  step = 1;
		  } else if ( (diff > 100) && (diff < 1000)){
			  step = 20;
		  } else if ( (diff > 1000) && (diff < 10000)){
			  step = 1000;
		  } else if ( diff > 10000){
			  step = 10000;
		  }

		  var item = $(this).find('.slider').slider({ min: min, max: max, values: [val_c,val_l], range: true });

		  $(this).find('.slider-amount-c').val(val_c);
		  $(this).find('.slider-amount-l').val(val_l);
		  item.slider("pips", { first: "pip", last: "pip", step: step, rest: "label", labels: { first: "Min", last: "Max" }}).slider("float");
		  $(this).find('.slider').on("slide", function(e,ui) {
			  if (is_percent){
				  settings[key] = {'c':ui.values[0]/100,'l':ui.values[1]/100};
			  } else {
				  settings[key] = {'c':ui.values[0],'l':ui.values[1]};
			  }

			  $(container).find('.slider-amount-c').val(ui.values[0]);
			  $(container).find('.slider-amount-l').val(ui.values[1]);
	        })
	        .on('slidechange', function(){
	          $(container).closest('.slider-container').find('.slider-has-error').removeClass('slider-has-error');
	          $(container).closest('.slider-container').find('.alert-danger').removeClass('alert-danger');
	          $(container).closest('.slider-container').find('.slider-slider-error').removeClass('slider-slider-error');
	          updateData();
	        });

	  });

	  $('.pips-input-box').on('change', function(){
		  var container = $(this).closest('.slider-item');
		  var c = parseInt($(container).find('.slider-amount-c').val());
		  var l = parseInt($(container).find('.slider-amount-l').val());
		  $(container).find('.slider').slider({values:[c,l]}).slider("pips", "refresh");
		  var key = $(container).attr('rel');
		  var is_percent = $(this).data("percent");

		  if (is_percent){
			  settings[key] = {'c':c/100,'l':l/100};
		  } else {
			  settings[key] = {'c':c,'l':l};
		  }


          updateData();
	  });
	  
	  $('#assumptions-currency').on('change',function(){
		  $('.currency').text($('#assumptions-currency option:selected').text());
	  });
	  $('.currency').text($('#assumptions-currency option:selected').text());
	  $('.print-page').on('click',function(){
		  window.print();
	  });


});
