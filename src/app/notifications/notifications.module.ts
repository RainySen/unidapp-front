import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillboardComponent } from './components/billboard/billboard.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateBillboardComponent } from './components/create-billboard/create-billboard.component';
import { NewsComponent } from './components/news/news.component';
import { CreateNewsComponent } from './components/create-news/create-news.component';
import { ChatNotificationComponent } from './components/chat-notification/chat-notification.component';
import { CreateChatComponent } from './components/create-chat/create-chat.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { CreatePqrsComponent } from './components/create-pqrs/create-pqrs.component';
import { ListPqrsComponent } from './components/list-pqrs/list-pqrs.component';
import { FilterChatPipe } from './pipes/filter-chat/filter-chat.pipe';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';



@NgModule({
  declarations: [
    BillboardComponent,
    CreateBillboardComponent,
    NewsComponent,
    CreateNewsComponent,
    ChatNotificationComponent,
    CreateChatComponent,
    PqrsComponent,
    CreatePqrsComponent,
    ListPqrsComponent,
    FilterChatPipe,
    TruncatePipe
  ],
  exports: [
    BillboardComponent,
    NewsComponent,
    ChatNotificationComponent,
    PqrsComponent,
    ListPqrsComponent,
    FilterChatPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ]
})
export class NotificationsModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
