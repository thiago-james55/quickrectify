import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [PageTitleComponent, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css', '../../../global.css']
})
export class ConfigurationComponent implements OnInit {

  vacationInfoData: VacationInfoData = {}
  
  constructor(private _storageService: StorageService, private _toastService: ToastService) {}

  ngOnInit(): void {
    const savedvacationInfoData = this._storageService.getItem("vacationInfoData");

    if (savedvacationInfoData !== null) {
      this.vacationInfoData = JSON.parse(savedvacationInfoData) as VacationInfoData;
    } else {
      this.vacationInfoData.vacationActivatedtoggleValue = 0;
    }
  }

  async handlevacationInfoSave() {
    if (this.vacationInfoData.vacationActivatedtoggleValue === 1 && await this.validadevacationInfoSave()) {
      this._storageService.setItem("vacationInfoData",this.vacationInfoData);
      this._toastService.showToastSuccess("Informações sobre aviso de férias salvos com sucesso!");
    } else {
      this._storageService.removeItem("vacationInfoData");
      this._toastService.showToastCaution("Informações sobre aviso de férias removidas com sucesso!")
    }
  }

  async validadevacationInfoSave(): Promise<boolean> {
    const fields: string[] = [];
  
    if (!this.vacationInfoData.dateInitial) fields.push("Data Inicial");
    if (!this.vacationInfoData.dateFinal) fields.push("Data Final");
    if (!this.vacationInfoData.message) fields.push("Mensagem");
  
    if (fields.length > 0) {
      this._toastService.showToastCaution(`Os campos ${fields.join(' e ')} não podem estar vazios!`);
      return false;
    }
    return true;
  }
  

  toggleRange(event: MouseEvent): void {
    event.preventDefault();
    this.vacationInfoData.vacationActivatedtoggleValue =  this.vacationInfoData.vacationActivatedtoggleValue === 0 ? 1 : 0;
  }

}

export interface VacationInfoData {
  vacationActivatedtoggleValue?: number;
  dateInitial?: string;
  dateFinal?: string;
  message?: string;
}
