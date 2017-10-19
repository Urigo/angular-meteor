import { Component, OnInit } from '@angular/core';
import { Chats } from '../../api/server/collections';
import { Chat } from '../../api/server/models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  chats: Chat[];

  constructor() {}

  ngOnInit() {
    Chats.find({}).subscribe((chats: Chat[]) => {
      this.chats = chats;
    });
  }
}
