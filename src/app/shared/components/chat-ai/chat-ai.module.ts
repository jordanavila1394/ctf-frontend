import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatAiComponent } from './chat-ai.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [ChatAiComponent],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [ChatAiComponent],

})
export class ChatAiModule { }
