import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CompanyInfoService {
  public name: string = 'Retífica Reação LTDA ME';
  public info1: string = 'Retífica Álcool e Gasolina';
  public info2: string = 'Biela, Bloco, Cabeçote, Virabrequim, Volante';
  public info3: string = 'Solda (Alumínio, Bloco, Cart, Ferro , Magnésio)'
  public document: string = 'CNPJ: 05.387.112/0001-60';
  public phone1: string = '11-2052-6193';
  public phone2!: string;
  public phone3!: string;
  public address: string = 'R. Italina, 99 - Itaquera - 08290-705';
  public mail: string = 'retificareacao@gmail.com';
  public logo: string = '../../assets/company-logo.jpg';
}