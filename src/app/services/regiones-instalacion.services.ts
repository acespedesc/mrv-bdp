import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { RegionesInstalacion } from "app/models/regiones-instalacion.interface";
import { Observable } from "rxjs";



@Injectable({providedIn : 'root'})
export class RegionesInstalacionService{
    public caedecs = signal<RegionesInstalacion[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getRegionesInstalacion(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/reg`)
         
     }
     public crearRegionesInstalacion(reg : RegionesInstalacion): Observable<any>{
        console.log(reg)
        return this._http.post<any>(`${this._endPoint}/reg`, reg)
    }
    public actualizaRegionesInstalacion(id : number, reg:RegionesInstalacion ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/reg/`+id, reg)

    }
    public eliminaRegionesInstalacion(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/reg/`+id)
    }
}