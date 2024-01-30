import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export enum ToastTypes {
  DEFAULT = "default-toast",
  SUCCESS = "success-toast",
  ERROR = "error-toast",
  CAUTION = "caution-toast"
}

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  private readonly duration: number = 5000;

  constructor(private _snackBar: MatSnackBar) { }

  private show(message: string, panelClass: string): void {
    
    const config: MatSnackBarConfig = {
      duration: this.duration,
      panelClass: [panelClass],
    };

    this._snackBar.open(message, '', config);
  }

  showToastDefault(message: string)   { this.show(message, ToastTypes.DEFAULT) }
  showToastSuccess(message: string)   { this.show("(✓) " + message, ToastTypes.SUCCESS) }
  showToastError(message: string)     { this.show("(X) " + message, ToastTypes.ERROR) }
  showToastCaution(message: string)   { this.show("(⚠) " + message, ToastTypes.CAUTION) }

}
