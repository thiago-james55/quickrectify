import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CompanyInfoService {
  public name: string = 'Retífica Reação LTDA ME';
  public detail1: string = 'Retífica Álcool e Gasolina';
  public detail2: string = 'Biela, Bloco, Cabeçote, Virabrequim, Volante';
  public detail3: string = 'Solda (Alumínio, Bloco, Cart, Ferro , Magnésio)'
  public document: string = 'CNPJ: 05.387.112/0001-60';
  public phone1: string = '(11) 2052-6193 (WhatsApp)';
  public phone2!: string;
  public phone3!: string;
  public address: string = 'R. Italina, 99 - Itaquera - 08290-705';
  public mail: string = 'retificareacao@gmail.com';
  public logo: string = '../../assets/company-logo.jpg';
  public qrcode: string = '../../assets/pix.jpeg';
  public info1: string = 'Lavar e Varetar Bem as Peças!';
  public info2: string = 'As peças só serão retiradas mediante apresentação desta via!';
  public info3: string = 'O prazo de retirada das peças é de 30 dias desde a data da emissão da ordem, não retirando as peças neste prazo determinado,será cobrada uma taxa de estadia no valor de R$20,00 (Vinte Reais) por dia excedido!';
  public info4: string = 'Garantia Legal de 3 Meses!';
}