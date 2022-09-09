import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExcerptPipe } from "./excerpt.pipe";
import { GetValueByKeyPipe } from "./get-value-by-key.pipe";
import { RelativeTimePipe } from "./relative-time.pipe";
import { EmailAsteriskPipe } from "./emailAsterisks";
import { ConvertDatePipe } from "./convertDate";
import { ConfigureCurrency } from "./formatCurrency";
import { ToNumberPipe } from "./toNumber";

const pipes = [
  ExcerptPipe,
  GetValueByKeyPipe,
  RelativeTimePipe,
  EmailAsteriskPipe,
  ConvertDatePipe,
  ConfigureCurrency,
  ToNumberPipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: pipes,
  exports: pipes,
})
export class SharedPipesModule {}
