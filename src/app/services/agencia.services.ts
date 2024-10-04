import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Agencia } from "app/models/agencia.interface";

import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class AgenciaService{
    public agencia = signal<Agencia[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getAgencia(regId: number | null): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/agencia/`+regId)
         
     }

    

     public crearAgencia(agencia : Agencia): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/agencia`, agencia)
    }

    public actualizaAgencia(id : number, agencia:Agencia ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/agencia/`+id, agencia)

    }
    public eliminaAgencia(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/agencia/`+id)
    }
}