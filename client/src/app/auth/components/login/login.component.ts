import { Component } from '@angular/core';
import { DemoAngularMaterailModule } from '../../../DemoAngularMaterialModule'; 

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [DemoAngularMaterailModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
