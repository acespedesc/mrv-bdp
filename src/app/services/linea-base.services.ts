import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { LineaBase } from "app/models/linea-base.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class LineaBaseService{
    public caedecs = signal<LineaBase[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getLineaBase(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/linea`)
         
     }

     public crearLineaBase(linea : LineaBase): Observable<any>{
        console.log(linea)
        return this._http.post<any>(`${this._endPoint}/linea`, linea)
    }

    public actualizaLineaBase(id : number, linea:LineaBase ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/linea/`+id, linea)

    }
    public eliminaLineaBase(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/linea/`+id)
    }
}