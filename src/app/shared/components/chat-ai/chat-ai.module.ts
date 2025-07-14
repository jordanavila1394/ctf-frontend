import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatAiComponent } from './chat-ai.component';

@NgModule({
    declarations: [ChatAiComponent],
    imports: [
        CommonModule,
    ],
    exports: [ChatAiComponent],

})
export class ChatAiModule { }
