import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let exporting = require('highcharts/modules/exporting');
let exportData = require('highcharts/modules/export-data');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

@Component({
  selector: 'app-output-table',
  templateUrl: './output-table.component.html',
  styleUrls: ['./output-table.component.css']
})
export class OutputTableComponent implements OnInit {
  chart: any;
  constructor() { }

  ngOnInit() {
    this.generateTable();
    Highcharts.addEvent(Highcharts.Chart, 'render', function () {
      var table = this.dataTableDiv;
      if (table) {
          Highcharts.css(table.querySelector('table'), {
              'border-collapse': 'collapse',
              'border-spacing': 0,
              background: 'white',
              'min-width': '100%',
              'font-family': 'sans-serif',
              'font-size': '14px'
          });
  
          [].forEach.call(table.querySelectorAll('td, th, caption'), function (elem) {
              Highcharts.css(elem, {
                  border: '1px solid silver',
                  padding: '0.5em'
              });
          });
  
          Highcharts.css(table.querySelector('caption'), {
              'border-bottom': 'none',
              'font-size': '1.1em',
              'font-weight': 'bold'
          });
  
          [].forEach.call(table.querySelectorAll('caption, tr'), function (elem, i) {
              if (i % 2) {
                  Highcharts.css(elem, {
                      background: '#f8f8f8'
                  });
              }
          });
      }
    });
  }
  generateTable() {
    this.chart = Highcharts.chart('tblcontainer', {
      chart: {
          events: {
            redraw: function () {
              let table = this.container;
              if (table) {
                if (table.parentNode) {
                  table.parentNode.removeChild(table);
                }
                delete this.container;
              }
              var tableDiv = this.dataTableDiv.parentNode;
              if (tableDiv) {
                  let tbls = tableDiv.childNodes;
                  while(tbls.length > 2)
                  {
                    tableDiv.removeChild(tableDiv.lastChild);
                    tbls = tableDiv.childNodes;
                  }
                                        }
            }
        }
      },
      title: {
          text: 'Contacts Correction Table',
          style: {
              display: 'none'
          }
      },
  
      subtitle: {
          text: null,
          align: 'left'
      },
  
      credits: {
          enabled: false
      },
  
      xAxis: {
          visible: false
      },
  
      yAxis: {
          visible: false
      },
      legend: {
          enabled: false
      },
  
      plotOptions: {
          series: {
              pointStart: 2010,
              marker: {
                  enabled: false
              },
              lineWidth: 0,
              enableMouseTracking: false
          }
      },
  
      series: [{
          name: 'Installation',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
          name: 'Manufacturing',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
          name: 'Sales & Distribution',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      }, {
          name: 'Project Development',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
      }, {
          name: 'Other',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
      }],
  
      exporting: {
          showTable: true,
          allowHTML: true,
          csv: {
              columnHeaderFormatter: function(item, key) {
                  if (!item || item instanceof Highcharts.Axis) {
                      return 'Date'
                  } else {
                      return item.name;
                  }
              }
          }
      }
  
    });
    setTimeout(()=>
    {
      this.chart.redraw();
      //[].forEach.call(document.getElementsByTagName('td'), (el)=>el.classList().add('td-border'));
    }
    , 100);
  }
}
