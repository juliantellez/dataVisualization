// LOAD DATABASE AND RENDER GRAPHS ::::::::::::::::::::::::::::
queue()
    .defer(d3.json, "/api/data")
    .await(renderGraphs);

function renderGraphs(error, apiData) {
// SAMPLE OBJECT ::::::::::::::::::::::::::::::::::::::::::::::: 
// _____________________________________________________________
// _____________________________________________________________
    // advertiser_id: (Number)
    // browser_name: (String)
    // campaing_spend: (Number)
    // clicks: (Number)
    // device_type: (String)
    // impressions: (Number)
    // macro_strategy_id: (Number)
    // micro_strategy_id: (Number)
    // name_of_day: (String)
    // post_click_conv: (Number)
    // post_view_conv: (Number)
    // record_day: (Number)
    // record_hour: (Number)
    // record_month: (Number)
    // record_year: (Number)
    // site_domain: (String)
// _____________________________________________________________
// _____________________________________________________________
    if(error) {return console.log(error);}
//  GET ALL OBJECTS 
var data                        = apiData[0].Accuen,
// PASS DATA THROUGH CROSSFILTER ::::::::::::::::::::::::::::::::::::::::::::
	ndx                         = crossfilter(data),
// DEFINE FILTER DIMENSIONS :::::::::::::::::::::::::::::::::::::::::::::::::
    // advertiser_id       = ndx.dimension(function(d){return d.advertiser_id}),
    // browser_name        = ndx.dimension(function(d){return d.browser_name}),
    campaing_spend              = ndx.dimension(function(d){return d.campaing_spend}),
    clicks                      = ndx.dimension(function(d){return d.clicks}),
    // device_type         = ndx.dimension(function(d){return d.device_type}),
    impressions                 = ndx.dimension(function(d){return d.impressions}),
    // macro_strategy_id   = ndx.dimension(function(d){return d.macro_strategy_id}),
    // micro_strategy_id   = ndx.dimension(function(d){return d.micro_strategy_id}),
    // name_of_day         = ndx.dimension(function(d){return d.name_of_day}),
    post_click_conv             = ndx.dimension(function(d){return d.post_click_conv}),
    post_view_conv              = ndx.dimension(function(d){return d.post_view_conv}),
    record_day                  = ndx.dimension(function(d){return d.record_day}),
    record_hour                 = ndx.dimension(function(d){return d.record_hour}),
    record_month                = ndx.dimension(function(d){return d.record_month}),
    record_year                 = ndx.dimension(function(d){return d.record_year}),
    site_domain                 = ndx.dimension(function(d){return d.site_domain}),
// METRICS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // groupByAdvertiser   = advertiser_id.group(),
    // groupByBrowser      = browser_name.group(),
    // groupByDevice       = device_type.group(),
    // groupByMacroStrat   = macro_strategy_id.group(),
    // groupByMicroStrat   = micro_strategy_id.group(),
    // groupByDayOfWeek    = name_of_day.group(),
    // groupByPostClick    = post_click_conv.group(),
    // groupByPostView     = post_view_conv.group(),
    groupByDay                  = record_day.group(),
    groupByHour                 = record_hour.group(),
    groupByMonth                = record_month.group(),
    groupByYear                 = record_year.group(),
    all                         = ndx.groupAll();
// CALCULATE GROUPS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
var recordDayImpressions        = record_day.group().reduceSum(function(d){ return d.impressions;}),
    recordMonthImpressions      = record_month.group().reduceSum(function(d){return d.impressions;}),
    recordHourImpressions       = record_hour.group().reduceSum(function(d){return d.impressions;}),
    impressionsGroup            = ndx.groupAll().reduceSum(function(d){return d.impressions;}),
    clicksGroup                 = ndx.groupAll().reduceSum(function(d){return d.clicks;}),
    totalSpent                  = ndx.groupAll().reduceSum(function(d){return d.campaing_spend}),
    // totalClicks = clicks.groupAll().reduceSum(function(d){return d.clicks}).value(),
    totalConversions            = ndx.groupAll().reduceSum(function(d){return d.post_click_conv + d.post_view_conv;}),
    conversionRateGroup         = ndx.groupAll().reduceSum(function(d){return ((d.post_click_conv + d.post_view_conv/data.length))});
    costPerConversionGroup      = ndx.groupAll().reduceSum(function(d){return})
// DEFINE DATA TRHESHOLD VALUES :::::::::::::::::::::::::::::::::::::::::::::::::
var minDay                      = record_day.bottom(1)[0].record_day,
    maxDay                      = record_day.top(1)[0].record_day,
    minMonth                    = record_month.bottom(1)[0].record_month,
    maxMonth                    = record_month.top(1)[0].record_month,
    minHour                     = record_hour.bottom(1)[0].record_hour,
    maxHour                     = record_hour.top(1)[0].record_hour;
// DATA OPTIONS :::::::::::::::::::::::::::::::::::::::::::::::::::::::
var totalClicks                 = dc.numberDisplay('#totalClicks')
                                    .formatNumber(d3.format("s"))
                                    .valueAccessor(function(d){return d;})
                                    .group(clicksGroup),

    totalImpressions            = dc.numberDisplay('#totalImpressions')
                                    .formatNumber(d3.format("s"))
                                    .valueAccessor(function(d){return d;})
                                    .group(impressionsGroup),

    totalCost                   = dc.numberDisplay('#totalCost')
                                    .formatNumber(d3.format(',.0f'))
                                    .valueAccessor(function(d){return d;})
                                    .group(totalSpent),

    totalConversions2            = dc.numberDisplay('#totalConversions')
                                    .formatNumber(d3.format(',.0f'))
                                    .valueAccessor(function(d){return d;})
                                    .group(totalConversions),

    Conversion                  = dc.numberDisplay('#conversionRate')
                                    .formatNumber(d3.format('%'))
                                    .valueAccessor(function(d){return d * 0.01;})
                                    .group(conversionRateGroup), 

    costPerConversion           = dc.numberDisplay('#costPerConversion')
                                    .formatNumber(d3.format(',.0f'))
                                    .valueAccessor(function(d){ return d / totalConversions.value() })
                                    .group(totalCost), 

    clickThroughRate            = dc.numberDisplay('#clickThroughRate')
                                    .formatNumber(d3.format('%'))
                                    .valueAccessor(function(d){ return d/impressionsGroup.value()})
                                    .group(clicksGroup); 
    costPerClick                = dc.numberDisplay('#costPerClick')
                                    .formatNumber(d3.format(',.0f'))
                                    .valueAccessor(function(d){ return d/clicksGroup.value()})
                                    .group(totalSpent);
    
// CHARTS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
var impressionsByDayChart       = dc.lineChart("#impressionsByDay-chart"),
    impressionsByMonthChart     = dc.lineChart("#impressionsByMonth-chart"),
    impressionsByHourChart      = dc.lineChart("#impressionsByHour-chart");    

     
    impressionsByHourChart
        .width(500).height(300)
        .margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        })
      .dimension(record_month)
      .group(recordHourImpressions)
      .renderArea(true)
      .transitionDuration(1000)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .x(d3.time.scale().domain([minHour, maxHour]))
      .yAxis().ticks(6).tickFormat(d3.format(',.f'))
    impressionsByDayChart
        .width(500).height(300)
        .margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        })
      .dimension(record_day)
      .group(recordDayImpressions)
      .renderArea(true)
      .transitionDuration(1000)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .x(d3.time.scale().domain([minDay, maxDay]))
      .yAxis().ticks(6).tickFormat(d3.format(',.f'))
    impressionsByMonthChart
        .width(500).height(300)
        .margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        })
      .dimension(record_month)
      .group(recordMonthImpressions)
      .renderArea(true)
      .transitionDuration(1000)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .x(d3.time.scale().domain([minMonth, maxMonth]))
      .yAxis().ticks(6).tickFormat(d3.format(',.f'))
   
// PRINT FILTER :::: ONLY FOR PRODUCTION ::::::::::::::::::::::::::::::::::::::::::::::
// _____________________________________________________________
// print_filter('VALUE');
// _____________________________________________________________
function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    console.log(filter+":"+f.length);
    }
// _____________________________________________________________
// _____________________________________________________________
// RENDER ALL DATA ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    dc.renderAll();
};