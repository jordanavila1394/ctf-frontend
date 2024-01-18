import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [CommonModule, UserRoutingModule, TranslateModule, MessageModule],
})
export class UserModule {}
