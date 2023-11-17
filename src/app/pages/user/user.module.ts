import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, UserRoutingModule, TranslateModule],
})
export class UserModule {}
