import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { Usuario } from "app/models/usuario.interface";
import { environment } from "@envs/environment";
import { Observable } from "rxjs";

@Injectable({providedIn : 'root'})
export class UsuarioService{
    public usuarios = signal<Usuario[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getUsuarios(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/usuario`)
         
     }  
     
     public crearUsuario(usu : Usuario): Observable<any>{
        console.log(usu)
        return this._http.post<any>(`${this._endPoint}/usuario`, usu)
    }
    
    public eliminaUsuario(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/usuario/`+id)
    }

    public actualizaUsuario(id : number, usu:Usuario ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/usuario/`+id, usu)

    }
    
}