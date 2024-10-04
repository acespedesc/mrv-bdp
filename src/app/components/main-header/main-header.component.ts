import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/services/auth.services'

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  usuario: string | null = null;
  router = inject(Router)

  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      
      console.log(user)
      
      if (user) {
        this.usuario = 'Analista : '+ user;
      } else {
        this.usuario = '';
      }
    });
  }

  logout() {
    this.authService.logout(); // Cierra sesión y actualiza el observable
    this.router.navigate(['/']);
  }

}
