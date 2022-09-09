import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "convertDate" })
export class ConvertDatePipe implements PipeTransform {
  transform(value: string): string {
    console.log({ value });
    return ("" + new Date(+value)).split(" ").slice(1, 4).join(" ");
  }
}
