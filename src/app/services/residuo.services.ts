import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Residuo } from "app/models/residuo.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class ResiduoService{
    
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getResiduo(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/residuo`)
         
     }

     public crearResiduo(residuo : Residuo): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/residuo`, residuo)
    }

    public actualizaResiduo(id : number, residuo:Residuo ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/residuo/`+id, residuo)

    }
    public eliminaResiduo(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/residuo/`+id)
    }
}