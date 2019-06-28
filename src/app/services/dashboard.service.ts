import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private commonService : CommonService) { }

  getCohortData(args){
    return this.commonService.get(`https://panel.appice.io/o/metrices/getCohortDataForInstalls?args=${JSON.stringify(args)}&api_key=d985715d1bb48942d36d5d08de3b6a8c&app_id=5ad83ce1f71de7016db4c0c1&_=1559907023369`)
  }
  getActiveUsers(argsMine){
    console.log("inside getActiveUser");
    return this.commonService.get("https://panel.appice.io/o/metrices/getActiveUserTimelySessions?args=" + JSON.stringify(argsMine) + "&app_id=5ad83ce1f71de7016db4c0c1&api_key=d985715d1bb48942d36d5d08de3b6a8c");
  }
  getInstall(argsNew){
    console.log(`this.argsinstall =>${JSON.stringify(argsNew)}`);
    return this.commonService.get(`https://panel.appice.io/o/metrices/getTotalStats?args=${JSON.stringify(argsNew)}&app_id=5ad83ce1f71de7016db4c0c1&api_key=d985715d1bb48942d36d5d08de3b6a8c`);
  }
  getCampaignStat(){
    return this.commonService.get(`https://panel.appice.io/o/metrices/getCampaignStats?args={"startDate_C":1557599400,"endDate_C":1560191399.999,"startDate_P":1555007400,"endDate_P":1557599399.999,"startDate_CNew":"2019-05-12","endDate_CNew":"2019-06-10","startDate_PNew":"2019-04-12","endDate_PNew":"2019-05-11"}&api_key=d985715d1bb48942d36d5d08de3b6a8c&app_id=5ad83ce1f71de7016db4c0c1`)
  }
}
