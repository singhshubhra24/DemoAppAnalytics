import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  tempSidebarValue : string = '';

  ngOnInit() {
  }

  showAccordiion(e){
    let elPanel = document.getElementsByClassName('panel');
    let elAccordion = document.getElementsByClassName('accordion');

    let prevVal = e.target.className.indexOf('active');
    
    for(let i = 0; i < elPanel.length; i++){
      elPanel[i].classList.remove('active');
      elAccordion[i].classList.remove('active');
    }
    if(prevVal == -1){
      e.target.classList.add('active')
      e.target.nextElementSibling.classList.add('active');
    }
  }

}
