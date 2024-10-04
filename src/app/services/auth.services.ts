import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@envs/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn:'root'})
export class AuthService{
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    router = inject(Router)
    private userSubject = new BehaviorSubject<any>(null);
    private userIdSubject = new BehaviorSubject<any>(null);
   user$ = this.userSubject.asObservable();
   userId$ = this.userIdSubject.asObservable();
   constructor() {
      const user = localStorage.getItem('usuario') || 'null';
      const userId = localStorage.getItem('usuarioId') || 'null';
      this.userSubject.next(user);
      this.userIdSubject.next(userId);
   }

    public login(data: any): void {
        // console.log(data.correo);
  
        this._http.post<any>(`${this._endPoint}/login`, data)
           .subscribe(response => {
  
              
  
              localStorage.setItem("token", response.token);
              localStorage.setItem("usuario", response.nombre);
              localStorage.setItem("usuarioId", response.id);
              this.router.navigate(['/layout']);
              this.userSubject.next(response.nombre);
              this.userIdSubject.next([response.id])
  
  
  
           })
     }

     logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this.userSubject.next(null); // Emitir null al cerrar sesión
   }

}