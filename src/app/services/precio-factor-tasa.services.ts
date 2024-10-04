import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { PrecioFactorTasa } from "app/models/precio-factor-tasa.interface";
import { Observable } from "rxjs";

@Injectable({providedIn : 'root'})
export class PrecioFactorTasaService{
    public caedecs = signal<PrecioFactorTasa[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getPrecioFactorTasa(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/pft`)
         
     }

     public crearPrecioFactorTasa(pft : PrecioFactorTasa): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/pft`, pft)
    }

    public actualizaPrecioFactorTasa(id : number, pft:PrecioFactorTasa ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/pft/`+id, pft)

    }
    public eliminaPrecioFactorTasa(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/pft/`+id)
    }

}