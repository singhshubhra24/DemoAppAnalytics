import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
// import { ThousandSuffixesPipe } from '../../../services/shortkeys.pipe'
import '../../../../assets/scripts/populatecohortdata.js';
declare var populateCohortData: any;
import '../../../../assets/scripts/cornelius.js';
declare var Cornelius: any;
import '../../../../assets/scripts/table2csv.js';
declare var export_table_to_csv : any;
import * as $ from 'jquery';
import * as moment from 'moment';

// import 'jquery';
declare global {
  interface JQuery {
    retention(data): JQuery;
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  argsInstall : any = {};
  txtVal : string = '';
  isAbsolute : boolean = true;
  isCustom : boolean = true;
  isAbsolutesource : boolean = true;
  isAbsoluteFilter : String = 'All';
  cohortDateFilter : String = 'yearly';
  chunkDateFilter : string;
  installGraphDateFilter : string ='All';
  scale : string = 'monthly';
  argsNew : any;
  rangeValueChunks : string;
  startDateChunk = new Date();
  endDateChunk = new Date();
  endDate = new Date();
  startDate = new Date();
  bsRangeValue: Date[];
  bsRangeValueChunks : Date[];
  installdata : any;
  activeUser : any;
  churndata : any;
  records:any;
  start =  moment().subtract('days', 30).valueOf()/1000;
  end =  moment().valueOf()/1000;
  argsMine = {"startDate_C":1556649000,"endDate_C":1559240999.999,"startDate_P":1554057000,"endDate_P":1556648999.999,"startDate_CNew":"2019-05-01","endDate_CNew":"2019-05-30","startDate_PNew":"2019-04-01","endDate_PNew":"2019-04-30"};
  isVisibleInstall : boolean;
  isVisibleUninstall : boolean;
  isVisibleEngage : boolean;
  changeInstall : any = 0;
  changeEngagement : any = 0;
  changeChurn : any = 0;
  graphData : any;
  maxInstallCount : number = 0;
  maxUnInstallCount : number = 0;
  percentage : Number = 0;
  globalGraphData : any = [];
  valid : boolean = false;
  sourceCampaignValue : string = 'source';
  clickView : boolean = true;
  // myPipe : any = ThousandSuffixesPipe;

  constructor( private dashboardService : DashboardService) {
    this.startDate.setMonth(0);
    this.startDate.setDate(1)
    this.bsRangeValue = [this.startDate, this.endDate];
    this.bsRangeValueChunks = [this.startDate, this.endDate];
  }

  ngOnInit() {
    this.bindCohortData();
    this.installs();
    this.activeUsers();
  }

  viewChunks(){
    console.log(`bsRangeValueChunks ==> ${this.bsRangeValueChunks}`);
    this.startDateChunk = this.bsRangeValueChunks[0];
    this.endDateChunk = this.bsRangeValueChunks[1];
    console.log(`start date ==> ${this.startDateChunk}.....end date==> ${this.endDateChunk}...chunkDateFilter==> ${this.chunkDateFilter}`);
    // this.argsNew = this.getDateRangeFilter(this.chunkDateFilter); 
    var startdate_CNew = moment(this.startDateChunk).format('YYYY-MM-DD');
    var endDate_CNew = moment(this.endDateChunk).format('YYYY-MM-DD');
    var endDate_PNew = moment(startdate_CNew).subtract(1,'days').format('YYYY-MM-DD');
    const diffTime = Math.abs(new Date(startdate_CNew).getTime() - new Date(endDate_CNew).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    var startdate_PNew = moment(endDate_PNew).subtract(diffDays, 'days').format("YYYY-MM-DD")
    this.argsNew = {
      startDate_C : new Date(startdate_CNew).getTime(),
      endDate_C : new Date(endDate_CNew).getTime(),
      startDate_P : new Date(startdate_PNew).getTime(),
      endDate_P : new Date(endDate_PNew).getTime(),
      startDate_CNew : startdate_CNew,
      endDate_CNew :  endDate_CNew,
      startDate_PNew : startdate_PNew,
      endDate_PNew : endDate_PNew
    }
    console.log("==========================================range"+JSON.stringify(this.argsNew));
    this.installNew();
    this.activeUsersNew();
  }

  chunkOnChange(value){
    this.chunkDateFilter = value[value.selectedIndex].value;
    if(this.chunkDateFilter == "custom"){
      this.isCustom = false;
      this.scale = this.chunkDateFilter;
      debugger
      console.log(`custom values ==> ${this.isCustom}`);
    }else{
      this.isCustom = true;
      console.log(`custom value =====> ${this.isCustom},${this.chunkDateFilter}`);
      console.log(`chunkDateFilter=====> ${this.chunkDateFilter}`);
      this.scale = this.chunkDateFilter;
      this.argsNew = this.getDateRangeFilter(this.chunkDateFilter);
      this.installNew();
      this.activeUsersNew();
    }
  }

  installGraphChange(value){
    this.isAbsoluteFilter = value;
    this.installGraphDateFilter = value;
    console.log(`value====>${this.installGraphDateFilter}`);
    // this.checkIfAbsoluteSource(this.sourceCampaignValue);
    this.getInstalls(this.sourceCampaignValue)
  }

  checkIfAbsolute(){
    this.isAbsolute = !this.isAbsolute;
    this.bindCohortData();
  }
  
  checkIfAbsoluteSource(params){
    this.sourceCampaignValue = params;
    this.isAbsolutesource = !this.isAbsolutesource;
    console.log(`inside block click on source and campaign==>`);
    this.getInstalls(params)
  }

  getInstalls(params){
    if(params=='source'){
      console.log("inside source functions");
      this.getSourceInstalls();
    }else if(params=='campaign'){
        console.log("inside campaign functions");
        this.getCampaignInstalls();
    }
  }

  getSourceInstalls(){
    this.dashboardService.getInstall(this.argsMine).subscribe(result=>{
      if(Object.keys(result).length){
        result.data = this.shortObject(result);
        if(this.installGraphDateFilter=='Android'){
          this.graphData = result.data.current.all.android;
          console.log(`result under spourcewise table ${result.data.current.all.android}`);
          this.populateInstallUninstall(this.graphData, this.filterData);
        }else if(this.installGraphDateFilter=='ios'){
          this.graphData = result.data.current.all.ios;
          console.log(`result under spourcewise table ${result.data.current.all.ios}`);
          this.populateInstallUninstall(this.graphData, this.filterData);
        }else if(this.installGraphDateFilter=='All'){
          this.graphData = result.data.current.android;
          console.log(`result under spourcewise table ${result.data.current.all}`);
          this.populateInstallUninstall(this.graphData, this.filterData);
        }
      }
    },error=> {
        console.log( `error`);
      })
  }

  getCampaignInstalls(){
    this.dashboardService.getCampaignStat().subscribe(result => {
      if(Object.keys(result).length){
        result.data = this.shortObject(result);
        if(this.installGraphDateFilter=='Android'){
          this.graphData = result.data.android;
          console.log(`result under spourcewise table ${JSON.stringify(this.graphData)}`);
          this.populateInstallUninstall(this.graphData, this.filterData);
        }else if(this.installGraphDateFilter=='ios'){
          this.graphData = result.data.ios;
          console.log(`result under spourcewise table ${JSON.stringify(this.graphData)}`);
          this.populateInstallUninstall(this.graphData, this.filterData);
        }
      }
  },error => {
    console.log(`error in soursewise install`);
  })
  }
  viewCohort(){
    this.startDate = this.bsRangeValue[0];
    this.endDate = this.bsRangeValue[1];
    this.bindCohortData();
  }

  cohortOnChange(value){
    this.cohortDateFilter = value[value.selectedIndex].value;
    this.bindCohortData();
  }

  bindCohortData(){
    let filter = this.cohortDateFilter;
    var startDate = this.startDate.getTime();
    var endDate = this.endDate.getTime();
    console.log(`start date ====> ${startDate}........endate==>${endDate}`);
    let args = {
      "startDate" : startDate,
      "endDate" : endDate,
      "startDateNew": this.startDate,
      "endDateNew": this.endDate,
      "periodtype":filter.substr(0,1),
      "metrices":[{}]
    }
    this.dashboardService.getCohortData(args).subscribe(res=>{
      var cohortData =  populateCohortData(res, filter, this.startDate, this.endDate, moment)
      var weekNumber = moment(this.startDate).week();
      var tmpDate = moment(this.startDate).format('YYYY');
      var cWeekNo = 0;

      Cornelius.draw({
          labels: {
              time: 'Time', // Time
              people: 'Acquisition', // People
              weekOf: '' // Week Of
          },
          formatWeeklyLabel: function (date, i) {
              //date.setDate(date.getDate() + i); // update the date object to the corresponding month
              var cWeek = (weekNumber + cWeekNo);
              var wYear = parseInt(moment(tmpDate, 'YYYY').week(cWeek).format('YYYY'));
              var sYear = parseInt(moment(tmpDate, 'YYYY').format('YYYY'));
              if (sYear < wYear) {
                  tmpDate = moment(endDate).format('YYYY');
                  weekNumber = 1;
                  cWeekNo = 0;
              }
              cWeek = (weekNumber + cWeekNo);
              cWeekNo++;
              return "Week " + cWeek;
          },
          initialDate: new Date(this.startDate),
          container: document.getElementById('installCohort'),
          cohort: cohortData,
          timeInterval: filter,
          displayAbsoluteValues: this.isAbsolute
      });
    },err=>{
      debugger
    })
  }

installNew(){
  console.log(`args value on installNew call ${JSON.stringify(this.argsNew)}`);
  this.dashboardService.getInstall(this.argsNew).subscribe(result =>{
    if(Object.keys(result).length){
        console.log("inside if block")
        // console.log(`result.data.current.all.android====>${JSON.stringify(result)}`)
        result.data = this.shortObject(result);
        this.graphData = result.data.current.all.android;
        this.populateInstallUninstall(this.graphData, this.filterData);
        console.log(result.data.current.totalUniqueInstall);
        // console.log(`graphData=====>${JSON.stringify(this.graphData)}`);
        var currentTotal = (result.data.current.androidTotal + result.data.current.iosTotal + result.data.current.webTotal);
        var previousTotal = (result.data.previous.androidTotal + result.data.previous.iosTotal + result.data.previous.webTotal);
        var changedTotal = 0;
        // var percentChange = 0;
        var platforms = ["Android", "iOS", "Web"];
        var platformData = [];

        this.installdata = {
            timelyCurrentData : result.data.current,
            timelyPreviousData : result.data.previous.previousTotal,
            currentTotal : result.data.currentTotal,
            countInstall : result.data.current.totalUniqueInstall
        }
        this.churndata = {
            currentTotal : result.data.current.totalUninstall,
            previous : result.data.previous,
            uniqueUninstall : result.data.current.totalUniqueUninstall
        }
        changedTotal = currentTotal - previousTotal;
        // console.log(`changedTotal====>${changedTotal}`);
        var percentChange = (previousTotal == 0) ? 100 : Number(changedTotal / previousTotal * 100).toFixed();
        // console.log(`percentChange====>${percentChange}`);

        if (currentTotal == 0 && previousTotal == 0) {
            percentChange = 0;
        }
        if (percentChange > 0) {
            this.isVisibleInstall = true;
            // var requiredResult = this.thousandSuffixesPipe.transform(percentChange);
            this.changeInstall = this.resultCompile(percentChange);
            // $('#lblChangeInstalls').text(requiredResult);
            // console.log(`1st block===>${requiredResult}`);
        }
        else if (percentChange < 0) {
            this.isVisibleInstall = false;
            percentChange = Number(percentChange) * -1;
            this.changeInstall = this.resultCompile(percentChange);
            // $('#lblChangeInstalls').text(requiredResult);
          // $('#lblChangeInstalls').text(Number(percentChange) | this.myPipe);
            console.log(`2nd block`);
        }
        else {
            percentChange = 0;
            this.changeInstall = 'NA';
            console.log(`3rd block`);
        }
        if (previousTotal == 0) {
            this.changeInstall = 'NA';
            console.log(`4th block`);
        }
        this.populateUniqueInstalls(result.data.current.totalUniqueInstall);
        // console.log(`installdata => ${this.installdata}`);
        this.populateChurns(result.data.current,result.data.previous);
        }
}, error => {
    console.log(error);
  })
  
}

installs(){
  console.log(`chunkDateFilte inside install====>`);
  var endDate_CNew = new Date();
  var startdate_CNew = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
  const diffTime = Math.abs(new Date(startdate_CNew).getTime() - new Date(endDate_CNew).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  console.log(diffDays);  
  var endDate_PNew = moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
  var startdate_PNew = moment(endDate_PNew).subtract(diffDays, 'days').format("YYYY-MM-DD") //"2019-01-01" start of last month
  var args = {
    startDate_C : new Date(startdate_CNew).getTime(),
    endDate_C : new Date(endDate_CNew).getTime(),
    startDate_P : new Date(startdate_PNew).getTime(),
    endDate_P : new Date(endDate_PNew).getTime(),
    startDate_CNew : startdate_CNew,
    endDate_CNew :  endDate_CNew,
    startDate_PNew : startdate_PNew,
    endDate_PNew : endDate_PNew
  }    
    this.dashboardService.getInstall(args).subscribe(result =>{
      if(Object.keys(result).length){
          console.log("inside if block")
          // console.log(`result.data.current.all.android====>${JSON.stringify(result)}`)
          result.data = this.shortObject(result);
          this.graphData = result.data.current.all.android;
          this.populateInstallUninstall(this.graphData, this.filterData);
          console.log(result.data.current.totalUniqueInstall);
          // console.log(`graphData=====>${JSON.stringify(this.graphData)}`);
          var currentTotal = (result.data.current.androidTotal + result.data.current.iosTotal + result.data.current.webTotal);
          var previousTotal = (result.data.previous.androidTotal + result.data.previous.iosTotal + result.data.previous.webTotal);
          var changedTotal = 0;
          // var percentChange = 0;
          var platforms = ["Android", "iOS", "Web"];
          var platformData = [];

          this.installdata = {
              timelyCurrentData : result.data.current,
              timelyPreviousData : result.data.previous.previousTotal,
              currentTotal : result.data.currentTotal,
              countInstall : result.data.current.totalUniqueInstall
          }
          this.churndata = {
              currentTotal : result.data.current.totalUninstall,
              previous : result.data.previous,
              uniqueUninstall : result.data.current.totalUniqueUninstall
          }
          changedTotal = currentTotal - previousTotal;
          // console.log(`changedTotal====>${changedTotal}`);
          var percentChange = (previousTotal == 0) ? 100 : Number(changedTotal / previousTotal * 100).toFixed();
          // console.log(`percentChange====>${percentChange}`);

          if (currentTotal == 0 && previousTotal == 0) {
              percentChange = 0;
          }
          if (percentChange > 0) {
              this.isVisibleInstall = true;
              // var requiredResult = this.thousandSuffixesPipe.transform(percentChange);
              this.changeInstall = this.resultCompile(percentChange);
              // $('#lblChangeInstalls').text(requiredResult);
              // console.log(`1st block===>${requiredResult}`);
          }
          else if (percentChange < 0) {
              this.isVisibleInstall = false;
              percentChange = Number(percentChange) * -1;
              this.changeInstall = this.resultCompile(percentChange);
              // $('#lblChangeInstalls').text(requiredResult);
            // $('#lblChangeInstalls').text(Number(percentChange) | this.myPipe);
          }
          else {
              percentChange = 0;
              this.changeInstall = 'NA';
              console.log(`3rd block`);
          }
          if (previousTotal == 0) {
              this.changeInstall = 'NA';
              console.log(`4th block`);
          }
          this.populateUniqueInstalls(result.data.current.totalUniqueInstall);
          // console.log(`installdata => ${this.installdata}`);
          this.populateChurns(result.data.current,result.data.previous);
      }
   }, error => {
      console.log(error);
    })

}

activeUsers(){
    console.log(`inside active user blocks`);
    var endDate_CNew = new Date();
    var startdate_CNew = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
    const diffTime = Math.abs(new Date(startdate_CNew).getTime() - new Date(endDate_CNew).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays);  
    var endDate_PNew = moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
    var startdate_PNew = moment(endDate_PNew).subtract(diffDays, 'days').format("YYYY-MM-DD") //"2019-01-01" start of last month
    var args = {
      startDate_C : new Date(startdate_CNew).getTime(),
      endDate_C : new Date(endDate_CNew).getTime(),
      startDate_P : new Date(startdate_PNew).getTime(),
      endDate_P : new Date(endDate_PNew).getTime(),
      startDate_CNew : startdate_CNew,
      endDate_CNew :  endDate_CNew,
      startDate_PNew : startdate_PNew,
      endDate_PNew : endDate_PNew
    }    
    console.log(`args value on activeUsers call ${JSON.stringify(args)}`);
    this.dashboardService.getActiveUsers(args).subscribe(result => {
    if(Object.keys(result).length){
        // console.log(`result => ${JSON.stringify(result)}`);
        result.data = this.shortObject(result)
        // console.log(result.data.activeUsers);
        this.activeUser = {
            timelyCurrentData : result.data.current,
            timelyPreviousData : result.data.previous.previousTotal,
            currentactiveuser : this.resultCompile(result.data.activeUsers),
            currentTotal : result.data.currentTotal
        }
        // this.activeUser.currentActive = this.resultCompile(this.activeUser.currentactiveuser);

        var timelyPreviousData = result.data.previous.previousTotal ? result.data.previous.previousTotal:0
        console.log(`sdsdsdscurrentactiveuser => ${this.activeUser.currentactiveuser}`);
        var changedTotal = result.data.currentTotal-timelyPreviousData;
        // console.log(`changedTotal => ${changedTotal}`);
        var percentChange = (timelyPreviousData==0) ? 100: Number(changedTotal/timelyPreviousData*100).toFixed(2);
        // console.log(`percentChange =>${percentChange}`);
        
        var strPercentChange; 
        if(percentChange>0){
            this.isVisibleEngage = false;
            strPercentChange = Number(percentChange);
            this.changeEngagement = this.resultCompile(strPercentChange);
            // console.log(`percentage engagement ===> ${strPercentChange}`);
        }
        else if(percentChange<0){
            this.isVisibleEngage = true;
            // console.log(`========================>percentChange =>${percentChange}`);
            percentChange=Number(percentChange)*-1;
            strPercentChange = Number(percentChange);
            this.changeEngagement = this.resultCompile(strPercentChange);
            // $("#lblChangeTotalSessions").text(requiredResult);
        }
        else if(percentChange==0){
          this.changeEngagement = Number(percentChange);
        }
        if(this.activeUser.timelyPreviousData == 0){
          this.changeEngagement = 'NA';
        }
        // console.log(`strPercentChange => ${strPercentChange}`);
        // $("#lblChangeTotalSessions").text(strPercentChange); //previous data
    }
  },error => {
      console.log(error);  
  })
}

activeUsersNew(){
  console.log(`args value on activeUser api ${JSON.stringify(this.argsNew)}`);
  this.dashboardService.getActiveUsers(this.argsNew).subscribe(result => {
    if(Object.keys(result).length){
        result.data = this.shortObject(result)
        this.activeUser = {
            timelyCurrentData : result.data.current,
            timelyPreviousData : result.data.previous.previousTotal,
            currentactiveuser : result.data.activeUsers,
            currentTotal : result.data.currentTotal
        }
        // this.activeUser.currentActive = this.resultCompile(this.activeUser.currentactiveuser);

        var timelyPreviousData = result.data.previous.previousTotal ? result.data.previous.previousTotal:0
        console.log(`currentactiveuser total => ${this.activeUser.currentactiveuser}`);
        console.log(`currentTotal value => ${this.activeUser.currentTotal}`);
        var changedTotal = result.data.currentTotal-timelyPreviousData;
        // console.log(`changedTotal => ${changedTotal}`);
        var percentChange = (timelyPreviousData==0) ? 100: Number(changedTotal/timelyPreviousData*100).toFixed(2);
        // console.log(`percentChange =>${percentChange}`);
        
        var strPercentChange; 
        if(percentChange>0){
            this.isVisibleEngage = false;
            strPercentChange = Number(percentChange);
            this.changeEngagement = this.resultCompile(strPercentChange);
            console.log(`percentage engagement ===> ${strPercentChange}`);
        }
        else if(percentChange<0){
            this.isVisibleEngage = true;
            // console.log(`========================>percentChange =>${percentChange}`);
            percentChange=Number(percentChange)*-1;
            strPercentChange = Number(percentChange);
            this.changeEngagement = this.resultCompile(strPercentChange);
            console.log(`percentage engagement ===> ${strPercentChange}`);
             // $("#lblChangeTotalSessions").text(requiredResult);
        }
        else if(percentChange==0){
          this.changeEngagement = Number(percentChange);
        }
        if(this.activeUser.timelyPreviousData == 0){
          this.changeEngagement = 'NA';
        }
    }
  },error => {
      console.log(error);  
  })
}
private shortObject (data: any[]){
return Object.keys(data)
              .sort().reduce((a, v) => {
                  a[v] = data[v];
                  return a; }
              , {});
}
resultCompile(input: any, args?: any): any {
  var exp, rounded,
    suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
  
  if (Number.isNaN(input)) {
    return null;
  }

  if (input < 1000) {
    return input;
  }

  exp = Math.floor(Math.log(input) / Math.log(1000));
  return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
}
uniquetotal = 0;
populateUniqueInstalls(uniqueInstall) {
    if (uniqueInstall == undefined) {
        uniqueInstall = 0
    }
    $('#uniqueInstalls').html(uniqueInstall);
}
populateChurns(current, previous) {
  if (current.totalUninstall == undefined) {
      current.totalUninstall = 0;
  }
  if (previous.totalUninstall == undefined) {
      previous.totalUninstall = 0;
  }

  var currentTotal = current.totalUninstall;
  var previousTotal = previous.totalUninstall;
  var changedTotal = 0;

  changedTotal = currentTotal - previousTotal;
  var percentChange = (previousTotal == 0) ? 100 : Number(changedTotal / previousTotal * 100).toFixed(2);
  if (currentTotal == 0 && previousTotal == 0) {
      percentChange = 0;
  }
  if (percentChange > 0) {
      this.isVisibleUninstall = false;
      var requiredResult = this.resultCompile(percentChange);
      this.changeChurn = requiredResult;
      // console.log(`percentChange uninstall =>${requiredResult}`);
  }
  else if (percentChange < 0) {
      this.isVisibleUninstall = true;
      percentChange = Number(percentChange) * -1;
      var requiredResult = this.resultCompile(percentChange);
      this.changeChurn = requiredResult;
      // console.log(`percentChange uninstall =>${percentChange}`);
  }
  else {
      percentChange = 0;
      this.changeChurn = 'NA'
      // $('#lblChangeTotalChurn').text('NA');
  }
  if (previousTotal == 0) {
      this.changeChurn = 'NA'
      // $('#lblChangeTotalChurn').text('NA');
  }
  // $('#lblChangeTotalChurn').text(requiredResult);
}
populateInstallUninstall(graphData, callback){
  // console.log(`graphData=====>${JSON.stringify(graphData)}`);
  let maxInstall = 0;
  let maxUninstall = 0;
  graphData.forEach(item => {
      let key = Object.keys(item)[0];
      let install = item[key]['in']
      let uninstall = item[key]['un']
      if(install > 0){
          this.percentage = Number(Number((uninstall / install) * 100).toFixed(2));
          // console.log(`percentage value ===> ${this.percentage}`);
      }
      if(install > maxInstall) maxInstall = install;
      if(uninstall > maxUninstall) maxUninstall = uninstall;

      if(maxInstall > maxUninstall) this.maxInstallCount = maxInstall;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
      if(maxUninstall > maxInstall) this.maxInstallCount = maxUninstall;   
  });
  callback(graphData, this.maxInstallCount, this)
}
filterData(graphData, maxInstallCount, tempThis){
  graphData.map((item)=>{
      let install = 0;
      let uninstall = 0;
      let key = Object.keys(item)[0];
      let obj = item[key];
      if(obj['in']){
      install = obj['in'];
      }
      if(obj['un']){
      uninstall = obj['un'];
      }
      
      // install count
      var count = Number(install / maxInstallCount * 100).toFixed();
      if(Number(count) > 100) {
          item.installCount = '100';
      }
      else if(Number(count) <= 0 && (install / maxInstallCount * 100) > 0){
          if(install / maxInstallCount * 100 > 0)  item.installCount = 1;
          else  item.installCount = '0';
      }
      else item.installCount = count;
     
      // calculate percentage 
      item.percentage = Number((uninstall / install) * 100).toFixed(2)+"%";
      item.percent = (item.percentage == 'Infinity%') ? '0%' : item.percentage;
     
      // calculate unistall count
      var count = Number(uninstall / maxInstallCount * 100).toFixed();
      if(Number(count) > 100) item.uninstallCount = '100';
      else if(Number(count) <= 0 && (uninstall / maxInstallCount * 100) > 0){
          if(uninstall / maxInstallCount * 100 > 0) item.uninstallCount = 1;
          else item.uninstallCount = '0';
      }
      else item.uninstallCount = count;

      item['source_name'] = Object.keys(item)[0];

      if(item[key]['cpi']){
          item['cpi'] = item[key]['cpi'];
          console.log(`cpi value=======>${item['cpi']}`);
      }
      else{
          item['cpi'] = '0';
          console.log(`cpi value else block=======>${item['cpi']}`);
      }
     return item;
  })
  tempThis.valid = true;
  // console.log(' graph data ===????', graphData)
}
/* View More */
viewmore(){
     this.clickView  = true;
    // $('.progres-table-info').css('overflow-y','auto');
    // $('.view-more-wrap').hide();
}

status: boolean = false;
muteStream() {
  this.status = !this.status;
  this.clickView  = false;
}
downloadCohort2Csv(){
  export_table_to_csv('.cornelius-table', 'cohort-graph-data.csv')
}
getDateRangeFilter(date_range) {
  console.log(`date_range===>${date_range}`);
  var currDate = moment(new Date()).format('YYYY-MM-DD');
  switch (date_range) {
      case "last_30_days":
          var endDate_CNew = currDate;
          var startdate_CNew = moment(currDate).subtract(29, 'days').format('YYYY-MM-DD');
          var endDate_PNew = moment(startdate_CNew, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
          var startdate_PNew = moment(endDate_PNew, "YYYY-MM-DD").subtract(29, 'days').format('YYYY-MM-DD');
          break;
          case "last_7_days":
          var endDate_CNew = currDate;
          var startdate_CNew = moment(currDate).subtract(6, 'days').format('YYYY-MM-DD');
          var endDate_PNew = moment(startdate_CNew, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
          var startdate_PNew = moment(endDate_PNew, "YYYY-MM-DD").subtract(6, 'days').format('YYYY-MM-DD');
          break;
      case "today":
            var yesterday = moment(currDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
            var startdate_CNew = currDate;
            var endDate_CNew = currDate;
            var startdate_PNew = yesterday;
            var endDate_PNew = yesterday;
            break;
      case "yesterday":  
          var yesterday = moment(currDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
          var prev_yesterday = moment(yesterday, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
          var startdate_CNew = yesterday;
          var endDate_CNew = yesterday;
          var startdate_PNew = prev_yesterday;
          var endDate_PNew = prev_yesterday;
          break;
      case "monthly":
          var endDate_CNew = currDate;
          var startdate_CNew = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
          const diffTime = Math.abs(new Date(startdate_CNew).getTime() - new Date(endDate_CNew).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          console.log(diffDays);  
          var endDate_PNew = moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
          var startdate_PNew = moment(endDate_PNew).subtract(diffDays, 'days').format("YYYY-MM-DD") //"2019-01-01" start of last month
          break;
      case "weekly":
           var endDate_CNew = currDate;
           var startdate_CNew = moment(currDate, "YYYY-MM-DD").subtract(6, 'days').format('YYYY-MM-DD');
           var endDate_PNew =  moment(startdate_CNew, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
           var startdate_PNew = moment(endDate_PNew, "YYYY-MM-DD").subtract(6, 'days').format('YYYY-MM-DD');
           break;
      case "quarter":
          var startQuarter = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
          var startOfQuarterMonth = moment().subtract(3, 'months').date(1).format("YYYY-MM-DD") //"2019-01-01" start of last month
          var endOfLastMonth = moment(new Date()).subtract(6, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
          var start_date = [startOfQuarterMonth, startQuarter];
          var end_date = [endOfLastMonth, startOfQuarterMonth]
          break;
      default:
          var start_date = [currDate, currDate];
          var end_date = [currDate, currDate];
  };
  var args = {
    startDate_C : new Date(startdate_CNew).getTime(),
    endDate_C : new Date(endDate_CNew).getTime(),
    startDate_P : new Date(startdate_PNew).getTime(),
    endDate_P : new Date(endDate_PNew).getTime(),
    startDate_CNew : startdate_CNew,
    endDate_CNew :  endDate_CNew,
    startDate_PNew : startdate_PNew,
    endDate_PNew : endDate_PNew
  }    
  console.log("==========================================range"+JSON.stringify(args));
  return args;
}
}