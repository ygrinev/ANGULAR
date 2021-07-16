import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {
  // showInvalid : boolean = true;
  // showMissing : boolean = true;
  public options: any = {
  chart: {
    type: 'spline'
  },
  title: {
      text: 'DQ invalid contacts history'
  },
  subtitle: {
      text: 'Source system: TTS'
  },
  xAxis: {
      categories: ['2021-01-01', '2021-01-02', '2021-01-03', '2021-01-04', 
      '2021-01-05', '2021-01-06', '2021-01-07', '2021-01-08', '2021-01-09', 
      '2021-01-10', '2021-01-11', '2021-01-12','2021-01-13', '2021-01-14', 
      '2021-01-15', '2021-01-16', '2021-01-17', '2021-01-18', '2021-01-19', 
      '2021-01-20', '2021-01-21', '2021-01-22', '2021-01-23', '2021-01-24']
      // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
      title: {
          text: 'Contacts'
      }
      // ,
      // labels: {
      //     formatter: function () {
      //         return this.value + '°';
      //     }
      // }
  },
  tooltip: {
      crosshairs: true,
      shared: true
  },
  plotOptions: {
      spline: {
          marker: {
              radius: 3,
              lineColor: '#666666',
              lineWidth: 1
          }
      },
  },
  series: [{
      name: 'Invalid',
      visible: false,
      marker: {
          symbol: 'triangle'
      },
      data: [70, 69, 95, 145, 182, 215, 252, {
          y: 265,
          marker: {
              symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          }
      }, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, {
        y: 265,
        marker: {
            symbol: 'square'
        }
    }, 233, 183, 139, 96]

    }, 
    {
      name: 'Missing',
      marker: {
          symbol: 'diamond'
      },
      data: [{
          y: 39,
          marker: {
              symbol: 'square'
                  }
              }, 42, 57, 85, 119, 152, 170, 166, 142, 103, 66, 48, 39, 42, 57, 85, 119, 152, 170, 166, 142, 103, 66, 48]
  }]
}
  subscription: Subscription;
  constructor(private http: HttpClient) { }

  ngOnInit(){
    Highcharts.chart('container', this.options);

    // Set 10 seconds interval to update data again and again
    // const source = interval(10000);

    // // Sample API
    // const apiLink = 'https://api.myjson.com/bins/13lnf4';

    // this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
    //   data => {
    //     const updated_normal_data = [];
    //     const updated_abnormal_data = [];
    //     data.forEach(row => {
    //       const temp_row = [
    //         new Date(row.timestamp).getTime(),
    //         row.value
    //       ];
    //       row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
    //     });
    //     this.options.series[0]['data'] = updated_normal_data;
    //     this.options.series[1]['data'] = updated_abnormal_data;
    //     Highcharts.chart('container', this.options);
    //   },
    //   error => {
    //     console.log('Something went wrong.');
    //   })
    // );
  }

  getApiResponse(url) {
    return this.http.get<any>(url, {})
      .toPromise().then(res => {
        return res;
      });
  }
  // toggleInvalid(){
  //   this.showInvalid = !this.showInvalid;
  // }
  // toggleMissing(){
  //   this.showInvalid = !this.showInvalid;
  // }
}

